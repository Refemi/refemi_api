const express = require("express");
const router = express.Router();
const {newUser}=require("../controller/userControllers");


router.post("/",newUser);



module.exports = router;