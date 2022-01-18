const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/authJwt");
const { isAdmin } = require("../../middlewares/checkRight");

const Controller = require('./usersControllers');

router.get('/', verifyToken, isAdmin, Controller.getAll);
router.get('/me', verifyToken, Controller.getOwn);
router.get('/:id', verifyToken, Controller.getOneById);

module.exports = router;
