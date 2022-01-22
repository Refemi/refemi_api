const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRights");
const verifyToken = require("../../middlewares/authJwt");

const ReferencesController = require("./referencesController");

router.get("/section/:id", ReferencesController.getAllReferencesBySection);
router.get("/theme/:id", ReferencesController.getAllReferencesByTheme);
router.get("/user", verifyToken, ReferencesController.getAllReferencesByUser);
router.get("/:id", ReferencesController.getOneReference);
router.get("/", verifyToken, isAdmin, ReferencesController.getAllReferences);
router.post("/", verifyToken, ReferencesController.addOneReference);
router.put("/:id", verifyToken, ReferencesController.updateOneReference);
router.delete("/:id", verifyToken, isAdmin, ReferencesController.deleteOneReference);

module.exports = router;
