const express = require("express");
const router = express.Router();

const AuthController = require("./authController");

router.post("/signUp", AuthController.addOneUser);
router.post("/signIn", AuthController.logIn);

module.exports = router;
