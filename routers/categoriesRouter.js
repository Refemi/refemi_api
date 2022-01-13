const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getSubCategories,
} = require("../controllers/categoriesController");

router.get("/", getAllCategories);
router.get("/:category_name", getSubCategories);

module.exports = router;
