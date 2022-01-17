const express = require("express");
const router = express.Router();

const Controller = require("./sectionsControllers");


router.get("/", Controller.getAll);
router.get("/:id", Controller.getOne);
router.post('/', Controller.addOne)
router.put('/:id', Controller.updateOne);
router.delete('/:id', Controller.deleteOne);


module.exports = router;
