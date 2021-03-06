const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRights");

const CategoriesController = require("./categoriesController");

router.get("/", CategoriesController.getAllCategories);
router.get(
  "/sections/:section_id",
  CategoriesController.getAllCategoriesBySection
);
router.get("/:id", CategoriesController.getOneCategory);
router.post("/", CategoriesController.addOneCategory);
router.put("/:id", CategoriesController.updateOneCategory);
router.delete("/:id", isAdmin, CategoriesController.deleteOneCategory);

module.exports = router;
