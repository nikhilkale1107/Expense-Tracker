const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/password");

router.post("/forgotpassword", passwordController.sendOTP);
router.post("/resetpassword/:id", passwordController.resetPassword);

module.exports = router;