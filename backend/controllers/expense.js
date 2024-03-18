const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.postExpense = async  (req, res) => {
  const { amount, description, category } = req.body;
  const t = await sequelize.transaction();

  try {
    const expenseAmount = parseFloat(amount);

    const expense = await req.user.createExpense({
      amount: expenseAmount,
      description,
      category,
    },
      { transaction: t }
      );

    await req.user.update({
      total_expense:
        parseFloat(req.user.dataValues.total_expense) + expenseAmount,
    },
    { transaction: t }
    )
    .catch(async (err) => {
      console.log(err);
      await t.rollback();
    });
  await t.commit();

    res.status(201).json(expense);
  } catch (error) {
    await t.rollback();
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

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { id } = req.params;
  try {
    const expense = await Expense.findOne(
      { where: { id } },
      { transaction: t }
    ).catch(async (err) => {
      console.log(err);
      await t.rollback();
    });
    const remainingExpense =
      Number(req.user.dataValues.total_expense) - expense.amount;
    await User.update(
      {
        total_expense: remainingExpense,
      },
      { where: { id: req.user.dataValues.id } },
      {
        transaction: t,
      }
    ).catch(async (err) => {
      console.log(err);
      await t.rollback();
    });
    await expense
      .destroy()
      .then(async (result) => {
        t.commit();
        res.status(201).json(result);
      })
      .catch(async (err) => {
        console.log(err);
        await t.rollback();
      });
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};