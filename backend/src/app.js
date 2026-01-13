const express = require("express");
const cors = require("cors");
const db = require("./db");
const https = require("https");
const fs = require("fs");
const auth = require("./routes/auth");
const receipts = require("./routes/receipts");


// 1️⃣ Create app FIRST
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/receipts", receipts);


// 2️⃣ QR verification route
app.get("/verify/:code", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT r.receipt_number, r.subtotal, r.vat, r.total,
             c.name, c.id_type, c.id_number, c.mobile, c.address, c.vrn
      FROM receipts r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.receipt_code = $1
    `,
      [req.params.code]
    );

    if (result.rows.length === 0) {
      return res.send("<h2 style='color:red'>INVALID RECEIPT</h2>");
    }

    const r = result.rows[0];

    res.send(`
      <html>
      <head>
        <title>TRA Receipt Verification</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          .bar { background:#f2c200; padding:10px; font-weight:bold; }
          table { width:100%; border-collapse:collapse; margin-top:15px; }
          td,th { border:1px solid #000; padding:8px; }
        </style>
      </head>
      <body>
        <div class="bar">TRA OFFICIAL RECEIPT VERIFICATION</div>

        <p><b>Receipt No:</b> ${r.receipt_number}</p>
        <p><b>Customer:</b> ${r.name}</p>
        <p><b>ID:</b> ${r.id_type} ${r.id_number}</p>
        <p><b>Mobile:</b> ${r.mobile}</p>
        <p><b>Address:</b> ${r.address}</p>
        <p><b>VRN:</b> ${r.vrn}</p>

        <table>
          <tr><th>Subtotal</th><th>VAT (18%)</th><th>Total</th></tr>
          <tr>
            <td>${r.subtotal}</td>
            <td>${r.vat}</td>
            <td><b>${r.total}</b></td>
          </tr>
        </table>

        <h3 style="color:green;margin-top:20px;">✔ VALID RECEIPT</h3>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// 3️⃣ HTTPS server (MUST be last)
const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://172.20.10.2:${PORT}`);
});





