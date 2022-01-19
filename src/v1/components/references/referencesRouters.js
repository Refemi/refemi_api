const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRights");
const verifyToken = require("../../middlewares/authJwt");

const ReferencesController = require("./referencesController");

router.get("/", verifyToken, isAdmin, ReferencesController.getAllReferences);
router.get("/section/:id", ReferencesController.getAllReferencesBySection);
router.get("/theme/:id", ReferencesController.getAllReferencesByTheme);
router.get("/:id", ReferencesController.getOneReference);
// TODO: add permission middleware
router.post("/", verifyToken, ReferencesController.addOneReference);
router.put("/:id", verifyToken, ReferencesController.updateOneReference);
router.delete("/:id", verifyToken, isAdmin, ReferencesController.deleteOneReference);

module.exports = router;
