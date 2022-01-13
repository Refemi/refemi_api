const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", (req, res) => {
  const contactEmail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to send");
    }
  });

  const username = req.body.username;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: username,
    to: process.env.EMAIL,
    subject: "Formulaire de contact",
    html: `<p>Nom: ${username}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message envoyé !" });
    }
  });
});

module.exports = router;
