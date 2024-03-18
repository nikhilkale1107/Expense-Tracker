const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    User.findOne({ where: { id: user.id } })
      .then((result) => {
        if (result) {
          req.user = result.dataValues;
          next();
        } else {
          res.send({
            message: "No Expense Found!",
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

module.exports = Authenticate;