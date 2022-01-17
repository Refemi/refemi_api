const express = require("express");
const router = express.Router();

const Controller = require('./authControllers');


router.post('/signUp', Controller.addOne);
router.post('/signIn', Controller.getOne);


module.exports = router;
