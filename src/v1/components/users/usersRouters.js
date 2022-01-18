const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/authJwt");
const { isAdmin } = require("../../middlewares/checkRights");

const UsersController = require("./usersController");

router.get("/", verifyToken, isAdmin, UsersController.getAllUsers);
router.get("/me", verifyToken, UsersController.getOwn);
router.get("/:id", verifyToken, UsersController.getOneUserById);

module.exports = router;
