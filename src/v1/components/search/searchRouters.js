const express = require("express");
const router = express.Router();
const { getAllSearch } = require("../controller/searchController");

router.get("/", getAllSearch);

module.exports = router;
