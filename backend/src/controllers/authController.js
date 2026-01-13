exports.login = (req,res)=>{
  const {username,password}=req.body;

  db.query(
    "SELECT id,username,role FROM users WHERE username=? AND password=?",
    [username,password],
    (err,result)=>{
      if(err) return res.status(500).json(err);
      if(result.length===0) return res.status(401).json({error:"Invalid login"});
      res.json(result[0]);   // includes role
    }
  );
};
