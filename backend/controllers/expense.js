const Expense = require("../models/expense");
const User = require("../models/user");

exports.postExpense = async  (req, res) => {
  const { amount, description, category } = req.body;
  try {
    const expenseAmount = parseFloat(amount);

    const expense = await req.user.createExpense({
      amount: expenseAmount,
      description,
      category,
    });

    await req.user.update({
      total_expense:
        parseFloat(req.user.dataValues.total_expense) + expenseAmount,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.log(error);
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    res.status(201).json(expenses);
  } catch (error) {
    console.log(error);
  }
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