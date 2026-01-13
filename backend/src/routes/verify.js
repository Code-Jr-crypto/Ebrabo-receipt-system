router.get("/verify/:code", async (req, res) => {
  const code = req.params.code;

  const r = await db.query(`
    SELECT r.*, c.*
    FROM receipts r
    JOIN customers c ON r.customer_id = c.id
    WHERE r.receipt_code = $1
  `, [code]);

  if (!r.rows.length) {
    return res.send("<h2>Invalid or Unknown Receipt</h2>");
  }

  const receipt = r.rows[0];

  const date = new Date(receipt.receipt_date);
  const receiptDate = date.toLocaleDateString();
  const receiptTime = date.toLocaleTimeString();

  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TRA Receipt Verification</title>

<style>
body {
  margin:0;
  font-family: Arial, Helvetica, sans-serif;
  background:#f4f4f4;
}

.topbar {
  background:#f2c400;
  padding:14px;
  text-align:center;
  font-weight:bold;
  font-size:16px;
}

.card {
  max-width:380px;
  margin:12px auto;
  background:white;
  padding:14px;
  border-radius:4px;
}

.center {
  text-align:center;
}

.hr {
  border-top:1px solid #ccc;
  margin:12px 0;
}

.label {
  font-weight:bold;
  color:#333;
}

.value {
  float:right;
}

.row {
  clear:both;
  padding:4px 0;
}

.small {
  font-size:13px;
  color:#333;
}
</style>
</head>

<body>

<div class="topbar">
  TAXPAYER RECEIPT VERIFICATION PORTAL
</div>

<div class="card">

  <div class="center">
    <b>*** START OF LEGAL RECEIPT ***</b>
  </div>

  <div class="center" style="margin:12px 0">
    <img src="/tra-logo.png" style="width:80px;" />
  </div>

  <div class="center small">
    <b>EBRABO COMPANY LIMITED</b><br>
    P.O. BOX 5059 MOROGORO<br>
    KOLAB WADADA WADOGO MOROGORO<br>
    TEL: 0767139045 / 0769507130<br>
    TIN: 134918152<br>
    VRN: 40025993I<br>
    SERIAL NO: 0217229263<br>
    UIN01DP25-10927293011690149302172229273<br>
    TAX OFFICE: Tax Office Morogoro
  </div>

  <div class="hr"></div>

  <div class="row"><span class="label">CUSTOMER NAME</span><span class="value">${receipt.name}</span></div>
  <div class="row"><span class="label">CUSTOMER ID TYPE</span><span class="value">${receipt.id_type}</span></div>
  <div class="row"><span class="label">CUSTOMER ID</span><span class="value">${receipt.id_number}</span></div>
  <div class="row"><span class="label">MOBILE</span><span class="value">${receipt.mobile || "N/A"}</span></div>

  <div class="hr"></div>

  <div class="row"><span class="label">RECEIPT NO</span><span class="value">${receipt.receipt_number}</span></div>
  <div class="row"><span class="label">RECEIPT DATE</span><span class="value">${receiptDate}</span></div>
  <div class="row"><span class="label">RECEIPT TIME</span><span class="value">${receiptTime}</span></div>

  <div class="hr"></div>

  <div class="row"><span class="label">TOTAL EXCL OF TAX</span><span class="value">${receipt.subtotal}</span></div>
  <div class="row"><span class="label">TAX RATE A (18%)</span><span class="value">${receipt.vat}</span></div>
  <div class="row"><span class="label">TOTAL TAX</span><span class="value">${receipt.vat}</span></div>
  <div class="row"><span class="label">TOTAL INCL OF TAX</span><span class="value">${receipt.total}</span></div>

  <div class="hr"></div>

  <div class="center">
    <b>RECEIPT VERIFICATION CODE</b><br>
    ${receipt.receipt_code}
  </div>

  <div class="hr"></div>

  <div class="center">
    <b>*** END OF LEGAL RECEIPT ***</b>
  </div>

</div>

</body>
</html>
`);
});
