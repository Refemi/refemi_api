const express = require("express");
const router = express.Router();

const ThemesController = require("./themesController");

router.get("/", ThemesController.getAllThemes);
router.get("/:id", ThemesController.getOneTheme);
router.post("/", ThemesController.addOneTheme);
router.put("/:id", ThemesController.updateOneTheme);
router.delete("/:id", ThemesController.deleteOneTheme);

module.exports = router;
