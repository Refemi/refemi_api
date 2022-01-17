const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRight");
const verifyToken = require("../../middlewares/authJwt");

const Controller = require('./referencesController');


router.get('/', Controller.getAll);
router.get("/section/:id", Controller.getAllBySection);
router.get("/theme/:id", Controller.getAllByTheme)
router.get("/:id", Controller.getOne);
// TODO: add permission middleware
router.post("/", verifyToken, Controller.addOne);
router.put("/:id", verifyToken, Controller.updateOne);
router.delete("/:id", verifyToken, isAdmin, Controller.deleteOne);


module.exports = router;
