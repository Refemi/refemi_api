const express = require("express");
const router = express.Router();

const SectionsController = require("./sectionsController");

router.get("/", SectionsController.getAllSections);
router.get("/:id", SectionsController.getOneSection);
router.post("/", SectionsController.addOneSection);
router.put("/:id", SectionsController.updateOneSection);
router.delete("/:id", SectionsController.deleteOneSection);

module.exports = router;
