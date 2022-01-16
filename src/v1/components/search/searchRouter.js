const express = require("express");
const router = express.Router();
const { getAllSearch } = require ("../controller/searchControllers");


router.get("/", getAllSearch)






module.exports = router