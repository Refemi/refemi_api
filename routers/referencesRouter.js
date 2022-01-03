const express = require("express");
const router = express.Router();

const{ checkRights } = require("../middlewares/checkRight")

const {

  getReferences,
  getAllReferences,
  getReferenceById,
  postReferences,
  putReferences,
  deleteReferences,
  getReferenceByTheme,

} = require("../controllers/referencesController");

router.get("/category/:category", getReferences);
router.get("/theme/:theme", getReferenceByTheme)
router.get("/:id", getReferenceById);
router.get("/all/references", getAllReferences);
router.post("/", postReferences);
router.put("/:id", putReferences);
router.delete("/:id", deleteReferences);



module.exports = router;
