const express = require("express");
const router = express.Router();

const FieldsController = require("./fieldsController");

router.get("/", FieldsController.getAllFields);

module.exports = router;
