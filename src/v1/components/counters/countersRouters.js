const express = require("express");
const router = express.Router();

const CounterController = require("./countersController");

router.get("/home", CounterController.getHomeCounters);
router.get("/dashboard/contributor", CounterController.getDashboardUser);
router.get("/dashboard/admin", CounterController.getDashboardAdmin);

module.exports = router;
