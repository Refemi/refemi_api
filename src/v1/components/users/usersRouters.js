const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/authJwt");
const { isAdmin } = require("../../middlewares/checkRights");

const UsersController = require("./usersController");
{/* < verifyToken and isAdmin> middleware used to match admin info  from the token 
in this case only admin can access this route */}
router.get("/", verifyToken, isAdmin, UsersController.getAllUsers);
//  < verifyToken > middleware used  to give user access in this route
router.get("/me", verifyToken, UsersController.getOwn);
router.get("/:id", verifyToken, UsersController.getOneUserById);

module.exports = router;
