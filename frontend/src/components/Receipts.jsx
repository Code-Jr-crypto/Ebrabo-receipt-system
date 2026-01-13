import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { formatTZS, numberToWords } from "../utils/money";



export default function Receipts() {


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




  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- LOAD RECEIPTS ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/receipts");
        setReceipts(res.data);
      } catch {
        setError("Failed to load receipts");
      }
    };
    load();
  }, []);

  /* ---------------- OPEN RECEIPT ---------------- */
  const openReceipt = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/receipts/full/${id}`
      );
      setSelected(res.data);
    } catch {
      alert("Failed to load receipt");
    }
  };

  const closeReceipt = () => setSelected(null);

  /* ---------------- PRINT (QR SAFE) ---------------- */
  const printReceipt = () => {
  const receipt = document.getElementById("receipt-print");

  // Grab QR canvas and convert to image
  const qrCanvas = document.getElementById("receipt-qr");
  let qrImg = "";

  if (qrCanvas) {
    qrImg = `<img src="${qrCanvas.toDataURL("image/png")}" style="width:95px;height:95px" />`;
  }

  // Clone receipt HTML
  let html = receipt.innerHTML;

  // Replace canvas with image
  html = html.replace(
    /<canvas[^>]*id="receipt-qr"[^>]*>.*?<\/canvas>/,
    qrImg
  );

  const win = window.open("", "_blank", "width=400,height=600");
  win.document.write(`
    <html>
      <head>
        <title>TRA Receipt</title>
        <style>
          body {
            font-family: monospace;
            margin: 0;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
};


  /* ---------------- FILTER ---------------- */
  const filtered = receipts.filter((r) =>
    `${r.receipt_number} ${r.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Receipts</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Search receipt or customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, width: 300, marginBottom: 15 }}
      />

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Receipt</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.receipt_number}</td>
              <td>{r.name}</td>
              <td>{formatTZS(r.total)}</td>
              <td>{new Date(r.receipt_date).toLocaleString()}</td>
              <td>
                <button onClick={() => openReceipt(r.id)}>Open</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- RECEIPT MODAL ---------------- */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 15,
              borderRadius: 6,
              maxHeight: "90vh",
              overflow: "auto",
              width: 360
            }}
          >
            <button
              onClick={closeReceipt}
              style={{
                float: "right",
                background: "red",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <div
              id="receipt-print"
              style={{
                width: "302px",
                margin: "auto",
                padding: "11px",
                fontFamily: "monospace"
              }}
            >
              <h4 style={{ textAlign: "center" }}>
                *** START OF LEGAL RECEIPT ***
              </h4>

              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                EBRABO COMPANY LIMITED
              </p>
              <p style={{ textAlign: "center" }}>
                P.O. BOX 5059 MOROGORO<br />
                TEL: 0767139045 / 0769507130<br />
                TIN: 134918152<br />
                VRN: 40025993I<br />
                SERIAL NO: 0217229263<br />
                UIN01DP25-10927293011690149302172229273<br />
                TAX OFFICE: Tax Office Morogoro

              </p>

              <hr />

              <p>Customer: {selected.receipt.name}</p>
              <p>ID Type: {selected.receipt.id_type}</p>
              <p>ID Number: {selected.receipt.id_number}</p>
              <p>Address: {selected.receipt.address}</p>
              <p>Mobile: {selected.receipt.mobile}</p>
              <p>VRN: {selected.receipt.vrn || "-"}</p>

              <p>Receipt: {selected.receipt.receipt_number}</p>
              <p>Date: {new Date(selected.receipt.receipt_date).toLocaleString()}</p>

              <hr />

              {selected.items.map((i) => (
                <div
                  key={i.id}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{i.description} x {i.quantity}</span>
                  <span>{formatTZS(i.total)}</span>
                </div>
              ))}

              <hr />

              
  <div style={row}>
    <span style={label}>TOTAL EXCL OF TAX</span>
    <span style={amount}>{formatTZS(selected.receipt.subtotal)}</span>
  </div>

  {/* VAT */}
  <div style={row}>
    <span style={label}>TAX RATE A (18%)</span>
    <span style={amount}>{formatTZS(selected.receipt.vat)}</span>
  </div>

    {/* VAT */}
  <div style={row}>
    <span style={label}>TOTAL TAX (18%)</span>
    <span style={amount}>{formatTZS(selected.receipt.vat)}</span>
  </div>

  <hr />

  {/* Total */}
  <div style={row}>
    <span style={{ ...label, fontSize: "12px" }}>TOTAL INCL OF TAX</span>
    <span style={{ ...amount, fontSize: "20px", fontWeight: "bold" }}>
      {formatTZS(selected.receipt.total)}
    </span>
  </div>


              <p style={{ fontStyle: "italic", fontSize: 12 }}>
                {numberToWords(selected.receipt.total)} Tanzania Shillings Only
              </p>

              <div style={{ textAlign: "center", marginTop: 10 }}>
                <QRCodeCanvas
                id="receipt-qr"
                  value={`http://172.20.10.2:5000/verify/${selected.receipt.receipt_code}`}
                  size={95}
                />
                <p>Scan to verify</p>
              </div>
            </div>

            <h5 style={{ textAlign: "center"}}>
                *** END OF LEGAL RECEIPT ***
              </h5>

            <button
              onClick={printReceipt}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 10,
                background: "#ffc107",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer"
              }}

            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
