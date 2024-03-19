const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");
const AWS = require("aws-sdk");

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
    const page = parseInt(req.query.page) || 1;
    const limit = 2;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      currentPage: page,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
      lastPage: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      totalCount: count,
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

function uploadToS3(data, fileName) {
  return new Promise(function (resolve, reject) {
    let s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    s3.upload(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: "public-read",
      },
      (err, response) => {
        if (err) {
          console.log("AWS Error: ", err);
          reject(err);
        } else {
          console.log("Success : ", response);
          resolve(response.Location);
        }
      }
    );
  });
}

exports.downloadExpense = async (req, res) => {
  //get Data
  const expenses = await req.user.getExpenses();
  console.log(expenses);
  const stringifiedExpenses = JSON.stringify(expenses);
  const userId = req.user.id;
  const fileName = `expenses-${userId}-${new Date()}.txt`;
  await uploadToS3(stringifiedExpenses, fileName)
    .then((loaction) => {
      res.status(200).json({
        success: true,
        loaction,
      });
    })
    .catch((err) => {
      res.status(401).json({
        success: true,
        err,
      });
    });
};