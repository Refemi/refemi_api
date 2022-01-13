const express = require("express");
const router = express.Router();


const {

    getTheme,
    getAllThemes,
    postTheme,
    putTheme,
    deleteTheme

} = require("../controller/themeController");


router.get("/", getAllThemes)
router.get("/:name", getTheme)
router.post("/", postTheme)
router.put("/:name", putTheme)
router.delete("/:name", deleteTheme)

module.exports = router;