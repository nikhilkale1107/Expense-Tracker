const express = require("express");

const router = express.Router();

const exprenseController = require("../controllers/expense");

//middlewares
const Authenticate = require("../middleware/auth");

router.get("/", Authenticate, exprenseController.getExpense);
router.post("/", Authenticate, exprenseController.postExpense);
router.delete("/:id", exprenseController.deleteExpense);

module.exports = router;