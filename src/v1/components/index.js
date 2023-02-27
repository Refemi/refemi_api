const express = require("express");
const router = express.Router();

const routers = require("./routers");

router.use("/", routers);

module.exports = router;
