const express = require("express");
const router = express.Router();

const ThemesController = require("./themesController");

router.get("/", ThemesController.getAllThemes);

module.exports = router;
