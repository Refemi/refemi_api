const express = require("express");
const router = express.Router();

const SectionsController = require("./sectionsController");

router.get("/", SectionsController.getAllSections);

module.exports = router;
