const express = require("express");
const router = express.Router();

const CategoriesController = require("./categoriesController");

router.get("/", CategoriesController.getAllCategories);
router.get(
  "/sections/:section_id",
  CategoriesController.getAllCategoriesBySection
);

module.exports = router;
