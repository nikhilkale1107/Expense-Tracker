const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../utils/database");

exports.showLeaderboard = async (req, res) => {
  console.log("Controller");
  try {
    const users = await User.findAll({
        attributes: ["name", "total_expense"],
        order: [["total_expense", "DESC"]],
      });
    res.status(201).json(users);
  } catch (error) {
    console.log(error);
  }
};