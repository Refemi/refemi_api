const express = require("express");
const router = express.Router();

const { isAdmin } = require("../../middlewares/checkRight");

const Controller = require("./categoriesController");


router.get("/", Controller.getAll);
router.get('/sections/:section_id', Controller.getAllBySection)
router.get("/:id", Controller.getOne);
router.post("/", Controller.addOne);
router.put("/:id", Controller.updateOne);
router.delete("/:id", isAdmin, Controller.deleteOne);


module.exports = router;
