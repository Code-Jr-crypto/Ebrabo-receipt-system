const express = require("express");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

const router = express.Router();

/* ================================
   CREATE RECEIPT
================================ */
router.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ error: "Missing customer or items" });
    }

    /* Create customer */
    const cust = await db.query(
      `INSERT INTO customers (name,id_type,id_number,mobile,address,vrn)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        customer.name,
        customer.id_type,
        customer.id_number,
        customer.mobile,
        customer.address,
        customer.vrn,
      ]
    );

    const customer_id = cust.rows[0].id;

    /* Calculate totals */
    let subtotal = 0;
    items.forEach((i) => {
      subtotal += Number(i.quantity) * Number(i.unit_price);
    });

    const vat = subtotal * 0.18;
    const total = subtotal + vat;

    const receipt_number = "RCPT-" + Date.now();
    const receipt_code = uuidv4();

    /* Create receipt */
    const receipt = await db.query(
      `INSERT INTO receipts
       (receipt_number, customer_id, receipt_code, subtotal, vat, total)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [receipt_number, customer_id, receipt_code, subtotal, vat, total]
    );

    const receipt_id = receipt.rows[0].id;

    /* Create items */
    for (const i of items) {
      await db.query(
        `INSERT INTO receipt_items
         (receipt_id, description, quantity, unit_price, total)
         VALUES ($1,$2,$3,$4,$5)`,
        [
          receipt_id,
          i.description,
          i.quantity,
          i.unit_price,
          i.quantity * i.unit_price,
        ]
      );
    }

    /* Generate QR */
    const qr = await QRCode.toDataURL(
      `http://172.20.10.2:5000/api/receipts/verify/${receipt_code}`,
      { width: 300, margin: 1 }
    );

    res.json({
      receipt_id,
      receipt_number,
      receipt_code,
      qr,
    });
  } catch (err) {
    console.error("CREATE RECEIPT ERROR:", err);
    res.status(500).json({ error: "Failed to create receipt" });
  }
});

/* ================================
   LIST RECEIPTS (TABLE)
   ⚠ FIXED: sends "name"
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await db.query(`
      SELECT 
        r.id,
        r.receipt_number,
        r.receipt_date,
        r.total,
        c.name -- IMPORTANT: frontend reads r.name
      FROM receipts r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.receipt_date DESC
    `);

    res.json(data.rows);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load receipts" });
  }
});

/* ================================
   FULL RECEIPT (APP VIEW)
================================ */
router.get("/full/:id", async (req, res) => {
  try {
    const receipt = await db.query(
      `
      SELECT r.*, c.*
      FROM receipts r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.id = $1
      `,
      [req.params.id]
    );

    if (!receipt.rows.length) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const items = await db.query(
      `SELECT * FROM receipt_items WHERE receipt_id = $1`,
      [req.params.id]
    );

    res.json({ receipt: receipt.rows[0], items: items.rows });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: "Failed to load receipt" });
  }
});

/* ================================
   QR VERIFICATION PORTAL
================================ */
router.get("/verify/:code", async (req, res) => {
  try {
    const receipt = await db.query(
      `
      SELECT r.*, c.*
      FROM receipts r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.receipt_code = $1
      `,
      [req.params.code]
    );

    if (!receipt.rows.length) {
      return res.status(404).json({ error: "Invalid receipt" });
    }

    const items = await db.query(
      `SELECT * FROM receipt_items WHERE receipt_id = $1`,
      [receipt.rows[0].id]
    );

    res.json({ receipt: receipt.rows[0], items: items.rows });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
