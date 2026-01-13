const db = require("../db");

exports.getAll = (req,res)=>{
  const {name,date} = req.query;

  let sql = `
   SELECT r.*, c.name 
   FROM receipts r 
   JOIN customers c ON r.customer_id=c.id
   WHERE 1=1
  `;

  let params = [];

  if(name){
    sql += " AND c.name LIKE ?";
    params.push("%"+name+"%");
  }
  if(date){
    sql += " AND DATE(r.receipt_date)=?";
    params.push(date);
  }

  db.query(sql,params,(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
};
