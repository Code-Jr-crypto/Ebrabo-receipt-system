exports.verify = (req, res) => {
  const code = req.params.code;

  db.query(
    `
    SELECT 
      r.*, 
      c.name, c.id_number, c.address, c.vrn,
      i.description,i.quantity,i.price
    FROM receipts r
    JOIN customers c ON r.customer_id=c.id
    JOIN receipt_items i ON i.receipt_id=r.id
    WHERE r.verification_code=?
    `,
    [code],
    (err, rows) => {
      if(err) return res.status(500).json(err);
      if(rows.length===0) return res.status(404).json({error:"Invalid receipt"});
      res.json(rows);
    }
  );
};
