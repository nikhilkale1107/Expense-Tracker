document.getElementById("buy-button").onclick = async function (e) {
  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("token")).token;
  const result = await axios.post(
    "http://localhost:8001/payment/createOrder",
    null,
    {
      headers: { Authorization: token },
    }
  );

  var options = {
    key: result.data.key_id,
    order_id: result.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:8001/payment/updateOrder",
        {
          order_id: result.data.order.id,
          payment_id: response.razorpay_payment_id,
          status: "SUCCESS",
        },
        {
          headers: { Authorization: token },
        }
      );

      showPremiumUser();
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: JSON.parse(localStorage.getItem("token")).token,
          ispremium: true,
        })
      );
      alert("You are premium User Now");
    },
  };

  var razorpayObject = new Razorpay(options);
  razorpayObject.on("payment.failed", async function (response) {
    await axios.post(
      "http://localhost:8001/payment/updateOrder",
      {
        order_id: result.data.order.id,
        payment_id: response.razorpay_payment_id,
        status: "FAILED",
      },
      {
        headers: { Authorization: token },
      }
    );
    alert("This step of Payment Failed");
  });
  razorpayObject.open();
};

function showPremiumUser() {
  const premiumUser = document.getElementById("premiumUser");
  const buyButton = document.getElementById("buy-button");
  const buyContainer = document.getElementsByClassName("buy-container")[0];
  premiumUser.style.display = "block";
  buyButton.style.display = "none";

  var button = document.createElement("button");
  button.textContent = "Show Leaderboard";
  button.className = "btnShowLeaderboard";
  buyContainer.appendChild(button);
  button.addEventListener("click", () => {
    axios
      .post("http://localhost:8001/premium/show-leaderboard", null, {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")).token,
        },
      })
      .then(function (response) {
        const premiumList = document.getElementsByClassName("list-premium")[0];
        response.data.forEach((data) => {
          const li = document.createElement("li");
          li.innerHTML = `Name ${data.name} : Total Expense ${data.total_cost}`;
          premiumList.appendChild(li);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const expensesList = document.getElementById("expenses");
    const storedData = JSON.parse(localStorage.getItem("token"));

  if (storedData.ispremium) {
    showPremiumUser();
  }

    expenseForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const amount = document.getElementById("amount").value;
      const description = document.getElementById("description").value;
      const category = document.getElementById("category").value;

      if (amount && description && category) {
        const expense = {
          amount: amount,
          description: description,
          category: category,
        };

        // Save expense to local storage
        axios
              .post("http://localhost:8001/expense", expense, {
                headers: {Authorization: storedData.token},
              })
              .then(function (response) {
                displayExpenses();
              })
              .catch(function (error) {
                console.log(error);
              });

        // Clear form fields
        expenseForm.reset();

        // Display expenses
        displayExpenses();
      } else {
        alert("Please fill in all fields.");
      }
    });

    // Display expenses from local storage
    function displayExpenses() {
      expensesList.innerHTML = "";
      axios
      .get("http://localhost:8001/expense", {
        headers: { Authorization: storedData.token },
    })
      .then(function (response) {
        let expenses = response.data;
        expenses.forEach(function (expense, index) {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerHTML = `
            <span>${expense.amount} - ${expense.description} (${expense.category})</span>
            <button type="button" class="btn btn-danger btn-sm float-right" onclick="deleteExpense(${index})">Delete</button>
            <button type="button" class="btn btn-primary btn-sm float-right mr-2" onclick="editExpense(${index})">Edit</button>
          `;
          expensesList.appendChild(li);
        });
      })
      .catch(function (error) {
        console.log(error);
      });  
    }

    // Delete expense
    window.deleteExpense = function (index) {
      axios
            .get("http://localhost:8001/expense",{
              headers: { Authorization: storedData.token },
            })
            .then(function (response) {
              let expense = response.data[index];
              return axios.delete(
                "http://localhost:8001/expense/" + expense.id, {
                  headers: { Authorization: storedData.token } ,
            });
            })
            .then((response) => {
              displayExpenses();
            })
            .catch(function (error) {
              console.log(error);
            });
    };

    // Edit expense
    window.editExpense = function (index) {
      axios
      .get("http://localhost:8001/expense", {
        headers: { Authorization: storedData.token },
      })
      .then(function (response) {
        let expense = response.data[index];
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value =
          expense.description;
        document.getElementById("category").value = expense.category;

        return axios.delete(
          "http://localhost:8001/expense/" + expense.id, {
            headers: { Authorization: storedData.token },
          }
        );
      })
      .then((response) => {
        console.log("DELETED");
      })
      .catch(function (error) {
        console.log(error);
      });
    };

    // Initial display
    displayExpenses();
  });