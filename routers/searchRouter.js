const express = require("express");
const router = express.Router();
const {getAllSearch} = require ("../controllers/searchControllers");


router.get("/",getAllSearch)






module.exports = router