import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function ReceiptViewer({id, close}) {
  const [data,setData] = useState(null);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/receipts/full/${id}`)
      .then(res=>setData(res.data));
  },[id]);

  if(!data) return null;

  const { receipt, items } = data;

  return(
    <div style={{background:"white",padding:"20px",width:"380px"}}>
      <h3 style={{textAlign:"center"}}>TANZANIA REVENUE AUTHORITY</h3>
      <hr/>

      <p>Receipt No: {receipt.receipt_number}</p>
      <p>Date: {new Date(receipt.receipt_date).toLocaleString()}</p>

      <p>Customer: {receipt.name}</p>
      <p>ID: {receipt.id_type} {receipt.id_number}</p>
      <p>Mobile: {receipt.mobile}</p>

      <hr/>

      {items.map((i)=>(
        <div key={i.id}>
          {i.description} {i.quantity} x {i.unit_price} = {i.total}
        </div>
      ))}

      <hr/>
      <p>TOTAL EXCL OF TAX: {receipt.subtotal}</p>
      <p>VAT 18%: {receipt.vat}</p>
      <h3>TOTAL INCL OF TAX: {receipt.total}</h3>

      <QRCodeCanvas value={`http://172.20.10.2:5000/verify/${receipt.receipt_code}`} size={120}/>

      <button onClick={close}>Close</button>
      <button onClick={()=>window.print()}>Print</button>
      <button onClick={()=>{
  html2canvas(document.body).then(canvas=>{
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"),"PNG",0,0,210,297);
    pdf.save(receipt.receipt_number+".pdf");
  });
}}>Download PDF</button>

    </div>
  );
}
