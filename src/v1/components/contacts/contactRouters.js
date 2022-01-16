const express = require("express");
const router = express.Router();

const Controller = require("./contactControllers");

router.post("/", Controller.addOne);

module.exports = router;
