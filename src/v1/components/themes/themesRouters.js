const express = require("express");
const router = express.Router();

const ThemesController = require("./themesController");

router.get(
  "/",
  (_, response) =>
    response
      .status(200)
      .json({ coucou: "coucou" }) /*ThemesController.getAllThemes*/
);

module.exports = router;
