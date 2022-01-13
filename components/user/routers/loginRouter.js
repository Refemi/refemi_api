const express = require("express");
const router = express.Router();
const {checkUser} =require("../controller/userControllers");



router.post("/",checkUser);




module.exports = router;
