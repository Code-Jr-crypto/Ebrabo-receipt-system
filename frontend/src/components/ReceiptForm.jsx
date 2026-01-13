import { useState } from "react";
import axios from "axios";
import { formatTZS, addCommas, removeCommas } from "../utils/money";

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb"
};

const input = {
  width: "90%",
  padding: "10px",
  marginBottom: "8px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const btn = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};


export default function ReceiptForm() {
  const [customer, setCustomer] = useState({
    name: "",
    id_type: "",
    id_number: "",
    mobile: "",
    address: "",
    vrn: "",
  });

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


  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: "" },
  ]);

  const [success, setSuccess] = useState("");

  /* ------------------ ITEMS ------------------ */
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: "" }]);
  };

  const updateItem = (i, field, value) => {
    const newItems = [...items];

    if (field === "unit_price") {
      newItems[i][field] = addCommas(value);
    } else {
      newItems[i][field] = value;
    }

    setItems(newItems);
  };

  const removeItem = (i) => {
    setItems(items.filter((_, index) => index !== i));
  };

  /* ------------------ TOTALS ------------------ */
  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * removeCommas(i.unit_price),
    0
  );
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  /* ------------------ SUBMIT ------------------ */
  const submit = async () => {
    try {
      await axios.post("http://localhost:5000/api/receipts", {
        customer,
        items: items.map((i) => ({
          description: i.description,
          quantity: Number(i.quantity),
          unit_price: removeCommas(i.unit_price),
        })),
      });

      setSuccess("✅ Receipt created successfully");
      setCustomer({
        name: "",
        id_type: "",
        id_number: "",
        mobile: "",
        address: "",
        vrn: "",
      });
      setItems([{ description: "", quantity: 1, unit_price: "" }]);
    } catch (e) {
  console.error("Create receipt error:", e.response?.data || e.message);
  alert("Failed to create receipt");
}

  };

  /* ------------------ UI ------------------ */
  return (
    <div style={{ padding: 20 }}>
      <h2>Create Receipt</h2>
      {success && <div style={{ color: "green", marginBottom: 10 }}>{success}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        
        {/* CUSTOMER */}
        <div style={card}>

          <h4>Customer</h4>
          <input
          style={input} placeholder="Name" value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <input 
          style={input} placeholder="ID Type" value={customer.id_type}
            onChange={(e) => setCustomer({ ...customer, id_type: e.target.value })} />
          <input 
          style={input}
          placeholder="ID Number" value={customer.id_number}
            onChange={(e) => setCustomer({ ...customer, id_number: e.target.value })} />
          <input 
          style={input} placeholder="Mobile" value={customer.mobile}
            onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })} />
          <input 
          style={input} placeholder="Address" value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
          <input
          style={input} placeholder="VRN" value={customer.vrn}
            onChange={(e) => setCustomer({ ...customer, vrn: e.target.value })} />
        </div>

        {/* ITEMS */}
        <div style={card}>

          <h4>Items</h4>
          {items.map((i, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <input 
              style={input}placeholder="Description"
                value={i.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)} />
              <input
              style={input} type="number" placeholder="Qty"
                value={i.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)} />
              <input
              style={input} placeholder="Unit Price"
                value={i.unit_price}
                onChange={(e) => updateItem(idx, "unit_price", e.target.value)} />
              <button onClick={() => removeItem(idx)}>X</button>
            </div>
          ))}
          <button
  className="pos-btn"
  onClick={addItem}
  style={{ ...btn, background: "#2563eb", color: "white", width: "100%" }}
>
  + Add Item
</button>


        </div>

        {/* PAYMENT */}
        <div style={card}>

          <h4>Payment</h4>
          <div style={{ marginTop: 10 }}>

  {/* Subtotal */}
  <div style={row}>
    <span style={label}>TOTAL EXCL OF TAX</span>
    <span style={amount}>{formatTZS(subtotal)}</span>
  </div>

  {/* VAT */}
  <div style={row}>
    <span style={label}>TAX RATE A (18%)</span>
    <span style={amount}>{formatTZS(vat)}</span>
  </div>

    {/* VAT */}
  <div style={row}>
    <span style={label}>TOTAL TAX (18%)</span>
    <span style={amount}>{formatTZS(vat)}</span>
  </div>

  <hr />

  {/* Total */}
  <div style={row}>
    <span style={{ ...label, fontSize: "12px" }}>TOTAL INCL OF TAX</span>
    <span style={{ ...amount, fontSize: "20px", fontWeight: "bold" }}>
      {formatTZS(total)}
    </span>
  </div>
</div>


          <button
  className="pos-btn"
  onClick={submit}
  style={{
    ...btn,
    background: "#16a34a",
    color: "white",
    width: "100%",
    marginTop: 10,
    fontSize: "16px"
  }}
>
  Create Receipt
</button>


        </div>

      </div>
    </div>
  );
}
