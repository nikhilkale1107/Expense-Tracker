const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/payment");

router.post("/createPayment", paymentController.createPayment);

module.exports = router;