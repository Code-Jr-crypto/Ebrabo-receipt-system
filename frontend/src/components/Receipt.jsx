import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { formatTZS, numberToWords } from "../utils/money";

export default function Receipt({ id, onBack }) {


const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 0"
};

const label = {
  fontSize: "11px",
  color: "#555",
  fontWeight: "600",
  textTransform: "uppercase"
};

const amount = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#111"
};




  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/receipts/full/${id}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [id]);

  if (!data) return <p>Loading…</p>;

  const r = data.receipt;
  const qrValue = `http://172.20.10.2:5000/verify/${r.receipt_code}`;

  const print = () => {
    const content = document.getElementById("receipt-print").innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`<html><body>${content}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <div
        id="receipt-print"
        style={{
          width: "302px",
          margin: "auto",
          padding: "11px",
          fontFamily: "monospace",
          background: "#fff"
        }}
      >
        <center>
          <b>*** START OF LEGAL RECEIPT ***</b>
        </center>

        <br />

        <center>
          <b>EBRABO COMPANY LIMITED</b><br />
          P.O. BOX 5059 MOROGORO<br />
          KOLAB WADADA WADOGO MOROGORO<br />
          TEL: 0767139045 / 0769507130<br />
          TIN: 134918152<br />
          VRN: 40025993I<br />
          SERIAL NO: 0217229263<br />
          UIN01DP25-10927293011690149302172229273<br />
          TAX OFFICE: Tax Office Morogoro
        </center>

        <hr />

        CUSTOMER NAME: {r.name}<br />
        CUSTOMER ID: {r.customer_id || "-"}<br />
        CUSTOMER MOBILE: {r.phone || "-"}<br />

        <hr />

        RECEIPT NO: {r.receipt_number}<br />
        RECEIPT DATE: {new Date(r.receipt_date).toLocaleDateString()}<br />
        RECEIPT TIME: {new Date(r.receipt_date).toLocaleTimeString()}<br />

        <hr />

        <b>Purchased Items</b><br />
        {data.items.map(i => (
          <div key={i.id} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{i.description} x {i.quantity}</span>
            <span>{formatTZS(i.total)}</span>
          </div>
        ))}

        <hr />


 <div style={row}>
    <span style={label}>TOTAL EXCL OF TAX</span>
    <span style={amount}>{formatTZS(r.subtotal)}</span>
  </div>

  {/* VAT */}
  <div style={row}>
    <span style={label}>TAX RATE A (18%)</span>
    <span style={amount}>{formatTZS(r.vat)}</span>
  </div>

    {/* VAT */}
  <div style={row}>
    <span style={label}>TOTAL TAX (18%)</span>
    <span style={amount}>{formatTZS(r.vat)}</span>
  </div>

  <hr />

  {/* Total */}
  <div style={row}>
    <span style={{ ...label, fontSize: "12px" }}>TOTAL INCL OF TAX</span>
    <span style={{ ...amount, fontSize: "20px", fontWeight: "bold" }}>
      {formatTZS(r.total)}
    </span>
  </div>




        <i>{numberToWords(r.total)} Tanzania Shillings Only</i>

        <hr />

        <center>
          RECEIPT VERIFICATION CODE<br />
          <b>{r.receipt_code}</b><br /><br />
          <QRCodeCanvas value={qrValue} size={76} level="H" />
        </center>

        <br />
        <center>*** END OF LEGAL RECEIPT ***</center>
      </div>

      <center>
        <button onClick={print} style={{ marginTop: 10 }}>Print</button>
      </center>
    </div>
  );
}
