const express = require("express");
const router = express.Router();

const ContactController = require("./contactController");

router.post("/", ContactController.sendMessage);

module.exports = router;
