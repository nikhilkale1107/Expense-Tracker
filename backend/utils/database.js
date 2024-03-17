const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense_tracker", "root", "Nikhil@1107", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;