const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { pool } = require("pg");
const { EMAIL, PASSWORD, MAIN_URL } = require("../config.env");
const { response } = require("express");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const mailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "nodemailer",
    link: MAIN_URL,
  },
});
const signup = (req, res) => {
  const { userEmail, name } = req.body;
  let response = {
    body: {
      neme,
      intro: "",
    },
  };
  let mail = mailGenerator.generate(response);
  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "signup successful",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .json({ msg: "you shouid receive an email from us" });
    })
    .catch((error) => console.error(error));
};
module.exports = { signup };
// const mailOptions ={
//     from:"email",
//     to:"to",
//     subject:"subject",
//     Text:"message"
// };
// stmpTransport.sendMail(mailOptions,function(error,reponse){
//     if(error){
//         console.log(error);
//     }
//     else{
//         console.log("email sented")
//     }
// })

// module.exports = send;
