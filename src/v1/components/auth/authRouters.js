const express = require("express");
const router = express.Router();

const Controller = require('./authControllers');

router.post('/signup', Controller.addOne);
router.post('/signin', Controller.getOne);
router.post('/signout', Controller.closeOne);

module.exports = router;
