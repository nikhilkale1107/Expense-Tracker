const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = 10;

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password,salt);
  User.create({ name, email, password: hashedPassword})
    .then((result) => {
        return res.send(result);
    })
    .catch((err) => res.send(err));
};

function generateToken(id, name, premium) {
  return jwt.sign({ id, name, premium }, process.env.TOKEN_SECRET);
  }

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  User.findOne({ where: { email: email } })
    .then((result) => {
        if (result == null) {
            return res.status(404).send({
              message: "User not found",
            });
          }
        if (!bcryptjs.compareSync(password, result.dataValues.password)) {
          return res.status(401).send({
            message: "Password is incorrect",
          });
      }
      return res.status(200).send({
        success: true,
        message: "Login Success",
        data: result,
        token: generateToken(result.dataValues.id, result.dataValues.name, result.dataValues.premium),
      });
    })
    .catch((err) => res.send(err));
};