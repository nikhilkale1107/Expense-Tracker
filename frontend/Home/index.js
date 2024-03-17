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

      let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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
    }

    // Delete expense
    window.deleteExpense = function (index) {
      let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      displayExpenses();
    };

    // Edit expense
    window.editExpense = function (index) {
      let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      const expense = expenses[index];

      // Fill the form with the selected expense details
      document.getElementById("amount").value = expense.amount;
      document.getElementById("description").value = expense.description;
      document.getElementById("category").value = expense.category;

      // Delete the selected expense from the list
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));

      // Display the updated expense list
      displayExpenses();
    };

    // Initial display
    displayExpenses();
  });