const express = require("express");

const Authenticate = require("../middleware/auth");

const router = express.Router();

const paymentController = require("../controllers/payment");

router.post("/createOrder", Authenticate, paymentController.createPayment);
router.post("/updateOrder", Authenticate, paymentController.updatePayment);

module.exports = router;