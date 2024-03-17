const Expense = require("../models/expense");

exports.postExpense = (req, res) => {
  console.log(req.body);
  const { amount, description, category } = req.body;
  Expense.create({
    amount,
    description,
    category,
  })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => console.log(err));
};

exports.getExpense = (req, res) => {
  Expense.findAll()
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