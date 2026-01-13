import { useEffect, useState } from "react";
import axios from "axios";

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/receipts")
      .then(res => setReceipts(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Saved Receipts</h2>

      {receipts.map(r => (
        <div key={r.id} style={{
          background: "#fff",
          margin: 10,
          padding: 15,
          borderRadius: 8
        }}>
          <b>{r.customer_name}</b> – {r.total} TZS  
          <br/>
          <img src={r.qr_code} width="80" />
          <br/>
          <a href={`http://localhost:5000/api/receipts/pdf/${r.id}`} target="_blank">
            Print PDF
          </a>
        </div>
      ))}
    </div>
  );
}
