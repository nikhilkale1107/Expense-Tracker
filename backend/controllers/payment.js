const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_K0whNMrJwMKo5j",
  key_secret: "OxPDN5P8YvsPKUCoMqd9MVHz",
});

exports.createPayment = (req, res, next) => {
  const { amount, currency, receipt, notes } = req.body;

  console.log(amount, currency, receipt, notes);
  razorpayInstance.orders.create(
    { amount, currency, receipt, notes },
    (err, order) => {
      if (!err) res.json(order);
      else res.send(err);
    }
  );
};