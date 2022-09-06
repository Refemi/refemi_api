const express = require("express");
const router = express.Router();

const verifyToken = require('../../middlewares/authJwt');

const CounterController = require("./countersController");

router.get("/home", CounterController.getHomeCounters);
//  < verifyToken > middleware used to get user info  from the token in this case user id
router.get("/dashboard/contributor", verifyToken, CounterController.getDashboardUserCounters);
router.get("/dashboard/admin", CounterController.getDashboardAdminCounters);

module.exports = router;
