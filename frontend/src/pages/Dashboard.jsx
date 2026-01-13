import { useState } from "react";
import ReceiptForm from "../components/ReceiptForm";
import Receipts from "../components/Receipts";
import { FaFileInvoice, FaList, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  const [tab, setTab] = useState("create");

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div style={{display:"flex", height:"100vh", background:"#f4f4f4"}}>
      
      <div style={{width:"230px", background:"#000", color:"#ffd600", padding:"20px"}}>
        <h2 style={{color:"#ffd600"}}>TRA RECEIPTS</h2>

        <div className="menu" onClick={()=>setTab("create")}>
          <FaFileInvoice /> Create Receipt
        </div>

        <div className="menu" onClick={()=>setTab("list")}>
          <FaList /> Receipts
        </div>

        <div className="menu" onClick={logout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>

      <div style={{flex:1, padding:"20px", overflowY:"auto"}}>
        {tab==="create" && <ReceiptForm />}
        {tab==="list" && <Receipts />}
      </div>
    </div>
  );
}
