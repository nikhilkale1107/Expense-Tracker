const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");

//middlewares
const Authenticate = require("../middleware/auth");

router.get("/", Authenticate, expenseController.getExpense);
router.post("/", Authenticate, expenseController.postExpense);
router.delete("/:id", Authenticate, expenseController.deleteExpense);
router.get("/download", Authenticate, expenseController.downloadExpense);

module.exports = router;