const express = require("express");

const router = express.Router();

//Controllers
const premiumController = require("../controllers/premium");

//Middleware
const Authenticate = require("../middleware/auth");

router.post(
  "/show-leaderboard",
  Authenticate,
  premiumController.showLeaderboard
);

module.exports = router;