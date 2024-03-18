const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_K0whNMrJwMKo5j",
  key_secret: "OxPDN5P8YvsPKUCoMqd9MVHz",
});

exports.createPayment = (req, res, next) => {
  const amountInRupees = 25000;

  razorpayInstance.orders.create(
    { amount: amountInRupees, currency: "INR"},
    (err, order) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      // Create Order in the table;

      Order.create({
        orderid: order.id,
        status: "PENDING",
        userId: req.user.dataValues.id,
      })
        .then((response) => {
          console.log("Order created in the table", response);
          return res
            .status(201)
            .json({ order, key_id: razorpayInstance.key_id });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
};

exports.updatePayment = (req, res, next) => {
  const { order_id, payment_id, status } = req.body;
  console.log(order_id, payment_id, status);
  Order.findOne({ where: { orderid: order_id } })
    .then((Order) => {
      if (!Order) return res.json({ message: "Order Not Found!" });
      switch (status) {
        case "SUCCESS":
          Order.update({ paymentid: payment_id, status: status })
            .then((result) => {
              req.user.update({ ispremium: true }).then((user) => {
                return res.status(201).send({
                  success: true,
                  messege: "You are a premium user now!",
                });
              });
            })
            .catch((err) => console.log(err));
          break; // Add break statement here
        case "FAILED":
          Order.update({ paymentid: payment_id, status: status })
            .then((order) => {
              return res.status(401).send({
                success: false,
                message: "Your Payment has Failed!",
              });
            })
            .catch((err) => console.log(err));
          break; // Add break statement here
      }
    })
    .catch((err) => console.log(err));
};