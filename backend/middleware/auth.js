const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  if (!token) {
    console.log("Authentication Failed!");
    return res.send({
      message: "Authentication failed",
    })
  }
  const user = jwt.verify(token, process.env.TOKEN_SECRET);
  User.findOne({ where: { id: user.id } })
    .then((result) => {
      if (result) {
        req.user = result;
        next();
      } else {
        console.log("Authentication Failed!");
        res.send({
          message: "Authentication failed",
        });
      }
    })
    .catch((err) => console.log(err));
};

module.exports = Authenticate;