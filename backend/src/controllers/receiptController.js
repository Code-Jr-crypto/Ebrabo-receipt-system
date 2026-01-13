const db = require("../db");
const { calculateVAT } = require("../utils/vat");
const { generateVerificationCode } = require("../utils/qr");

exports.createReceipt = (req, res) => {
  const { customer, items, cash } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  // Calculate total exclusive
  let totalExclusive = 0;
  items.forEach(i => {
    totalExclusive += Number(i.price) * Number(i.quantity);
  });

  const vat = totalExclusive * 0.18;
  const totalInclusive = totalExclusive + vat;
  const change = cash - totalInclusive;

  const receiptNumber = "EBR" + Date.now();
  const zno = "ZNO" + Math.floor(Math.random() * 9999);
  const verificationCode = generateVerificationCode(receiptNumber);

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);

    conn.beginTransaction(err => {
      if (err) return res.status(500).json(err);

      conn.query(
        `INSERT INTO customers 
         (name,id_type,id_number,mobile,address,vrn)
         VALUES (?,?,?,?,?,?)`,
        [
          customer.name,
          customer.idType,
          customer.idNumber,
          customer.mobile,
          customer.address,
          customer.vrn
        ],
        (err, cust) => {
          if (err) return conn.rollback(() => res.status(500).json(err));

          const customerId = cust.insertId;

          conn.query(
            `INSERT INTO receipts
             (receipt_number,zno,receipt_date,total_exclusive,vat,total_tax,
              total_inclusive,cash,change_amount,verification_code,customer_id)
             VALUES (?,?,NOW(),?,?,?,?,?,?,?,?)`,
            [
              receiptNumber,
              zno,
              totalExclusive,
              vat,
              vat,
              totalInclusive,
              cash,
              change,
              verificationCode,
              customerId
            ],
            (err, rec) => {
              if (err) return conn.rollback(() => res.status(500).json(err));

              const receiptId = rec.insertId;

              const itemQueries = items.map(i => {
                return new Promise((resolve, reject) => {
                  conn.query(
                    `INSERT INTO receipt_items 
                     (receipt_id,description,quantity,price)
                     VALUES (?,?,?,?)`,
                    [receiptId, i.description, i.quantity, i.price],
                    (err) => {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                });
              });

              Promise.all(itemQueries)
                .then(() => {
                  conn.commit(() => {
                    res.json({
                      receiptNumber,
                      zno,
                      verificationCode,
                      totalExclusive,
                      vat,
                      totalInclusive,
                      change
                    });
                  });
                })
                .catch(err => conn.rollback(() => res.status(500).json(err)));
            }
          );
        }
      );
    });
  });
};
