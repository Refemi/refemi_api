const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRights");
const verifyToken = require("../../middlewares/authJwt");

const ReferencesController = require("./referencesController");

router.get("/section/:id", ReferencesController.getAllReferencesBySection);
router.get("/theme/:id", ReferencesController.getAllReferencesByTheme);
//  < verifyToken > middleware used to get user info  from the token in this case user id
router.get("/user", verifyToken, ReferencesController.getAllReferencesByUser);
router.get("/:id", ReferencesController.getOneReference);

{/* < verifyToken and isAdmin> middleware used to match admin info from the token 
in this case admin id and  only admin can access this route */}
router.get("/", verifyToken, isAdmin, ReferencesController.getAllReferences);
router.post("/", verifyToken, ReferencesController.addOneReference);
router.put("/:id", verifyToken,isAdmin, ReferencesController.updateOneReference);
{/* < verifyToken and isAdmin> middleware used to get admin info  from the token 
in this case admin id and  only admin can delete any Reference */}
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  ReferencesController.deleteOneReference
);

module.exports = router;
