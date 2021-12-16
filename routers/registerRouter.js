const express = require("express");
const router = express.Router();
const {newUser}=require("../controllers/userControllers");


router.post("/",newUser);



module.exports = router;