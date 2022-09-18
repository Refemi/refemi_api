const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/authJwt");

const CounterController = require("./countersController");

router.get("/home", CounterController.getHomeCounters);
router.get(
  "/dashboard/contributor",
  verifyToken,
  CounterController.getDashboardUserCounters
);
router.get("/dashboard/admin", CounterController.getDashboardAdminCounters);

module.exports = router;
