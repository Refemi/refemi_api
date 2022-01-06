const express = require("express");
const router = express.Router();
const {checkUser} =require("../controllers/userControllers");



router.post("/",checkUser);




module.exports = router;
