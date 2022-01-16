const express = require("express");
const router = express.Router();

const Controller = require("./sectionsControllers");


router.get("/", Controller.getAll);
router.get("/:section_name", Controller.getOne);
router.post('/', Controller.addOne)
router.put('/:section_name', Controller.updateOne);
router.delete('/:section_name', Controller.deleteOne);


module.exports = router;
