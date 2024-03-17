const express = require("express");
const sequelize = require("./utils/database");
const ExpenseController = require("./controllers/expense");
const UserController = require("./controllers/user");

var app = express();

const PORT = 8001;
let cors = require("cors");
app.use(cors());

app.use(express.json());

app.post("/api/register", UserController.registerUser);

app.post("/api/login", UserController.loginUser);

app.post("/api/expense", ExpenseController.postExpense);

app.get("/api/expense", ExpenseController.getExpense);

app.delete("/api/expense/:id", ExpenseController.deleteExpense);

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((errr) => console.log(errr));