const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../utils/database");

exports.showLeaderboard = async (req, res) => {
  console.log("Controller");
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });
    console.log(users);
    res.status(201).json(users);
  } catch (error) {
    console.log(error);
  }
};