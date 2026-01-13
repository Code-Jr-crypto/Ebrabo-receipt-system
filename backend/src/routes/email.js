const express = require("express");
const router = express.Router();
const { sendReceipt } = require("../services/emailService");

router.post("/send", async (req,res)=>{
  const { email, pdf } = req.body;
  const buffer = Buffer.from(pdf, "base64");

  try{
    await sendReceipt(email, buffer);
    res.json({success:true});
  }catch(e){
    res.status(500).json(e);
  }
});

module.exports = router;
