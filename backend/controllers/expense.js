const Expense = require("../models/expense");
const User = require("../models/user");

exports.postExpense = (req, res) => {
//   console.log(req.body);
  const { amount, description, category } = req.body;
  Expense.create({
    amount,
    description,
    category,
    userId: req.user.dataValues.id,
  })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.getExpense = (req, res) => {
  Expense.findAll({ where: { userId: req.user.dataValues.id } })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  Expense.destroy({ where: { id: id } })
    .then((result) => {
      console.log(result);
      return res.send(result);
    })
    .catch((err) => console.log(err));
};