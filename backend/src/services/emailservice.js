const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourcompanyemail@gmail.com",
    pass: "yourAppPassword"
  }
});

exports.sendReceipt = async (to, pdfBuffer) => {
  await transporter.sendMail({
    from: "EBRABO <yourcompanyemail@gmail.com>",
    to,
    subject: "EBRABO Official Receipt",
    text: "Please find your receipt attached.",
    attachments: [
      {
        filename: "receipt.pdf",
        content: pdfBuffer
      }
    ]
  });
};
