const User = require("../models/user");

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  User.create({ name, email, password })
    .then((result) => {
      console.log(result);
      return res.send(result);
    })
    .catch((err) => res.send(err));
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((result) => {
      if (result.dataValues.password == password) {
        console.log("Logged In");
        return res.status(200).send(result);
      }
      return res.send({
        message: "Password is incorrect",
      });
    })
    .catch((err) => res.send(err));
};