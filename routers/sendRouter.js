const express = require("express");
const router = express.Router();
// const nodemailer = require("nodemailer");
const { getAllSend } = require("../controllers/sendControllers");

router.post("/send", getAllSend);

module.exports = router;
