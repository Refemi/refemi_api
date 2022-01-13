const express = require("express");
const router = express.Router();

const {
  getHomeCounters,
  getDashboardUser,
  getDashboardAdmin,
} = require("../controllers/counterController");

router.get("/homecounter", getHomeCounters);
router.get("/dashboard/contributor", getDashboardUser);
router.get("/dashboard/admin", getDashboardAdmin);

module.exports = router;
