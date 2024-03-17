document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const expensesList = document.getElementById("expenses");

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
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        axios
              .post("http://localhost:8001/api/expense", expense)
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
      .get("http://localhost:8001/api/expense")
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
            .get("http://localhost:8001/api/expense")
            .then(function (response) {
              let expense = response.data[index];
              return axios.delete(
                "http://localhost:8001/api/expense/" + expense.id
              );
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
      .get("http://localhost:8001/api/expense")
      .then(function (response) {
        let expense = response.data[index];
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value =
          expense.description;
        document.getElementById("category").value = expense.category;

        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        return axios.delete(
          "http://localhost:8001/api/expense/" + expense.id
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