var options = {
  key: "rzp_test_K0whNMrJwMKo5j",
  amount: "49900",
  currency: "INR",
  name: "Optimiz",
  image:
    "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
  order_id: "order_Nb8YPR8s5GXutQ",
  handler: function (response) {
    console.log(response);
    alert("This step of Payment Succeeded");
  },
  prefill: {
    //Here we are prefilling random contact
    contact: "9876543210",
    //name and email id, so while checkout
    name: "Twinkle Sharma",
    email: "smtwinkle@gmail.com",
  },
  notes: {
    description: "Best Course for SDE placements",
    language:
      "Available in 4 major Languages JAVA, C/C++, Python, Javascript",
    access: "This course have Lifetime Access",
  },
  theme: {
    color: "#2300a3",
  },
};
var razorpayObject = new Razorpay(options);
console.log(razorpayObject);
razorpayObject.on("payment.failed", function (response) {
  console.log(response);
  alert("This step of Payment Failed");
});

// document.getElementById("buy-button").onclick = function (e) {
//   razorpayObject.open();
//   e.preventDefault();
// };


document.getElementById("buy-button").onclick = function (e) {
  axios
    .post("http://localhost:8001/payment/createPayment", {
      amount: 100,
      currency: "INR",
      receipt: "jqqoqhq",
      notes: {},
    })
    .then((result) => {
      console.log(result.data);
      var options = {
        key: "rzp_test_K0whNMrJwMKo5j",
        amount: result.data.amount,
        currency: result.data.currency,
        name: "Optimiz",
        image:
          "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
        order_id: result.data.id,
        handler: onPaymentSuccess,
        notes: {},
      };

      var razorpayObject = new Razorpay(options);
      razorpayObject.on("payment.failed", function (response) {
        console.log(response);
        alert("This step of Payment Failed");
      });
      razorpayObject.open();
      e.preventDefault();
    })
    .catch((err) => console.log(err));
};

function onPaymentSuccess(response) {
  console.log(response);
  alert("This step of Payment Succeeded");
}



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
        let token = localStorage.getItem("token");

        axios
              .post("http://localhost:8001/expense", expense)
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
      var token = localStorage.getItem("token");
      axios
      .get("http://localhost:8001/expense")
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
      let token = localStorage.getItem("token");
      axios
            .get("http://localhost:8001/expense")
            .then(function (response) {
              let expense = response.data[index];
              return axios.delete(
                "http://localhost:8001/expense/" + expense.id
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
      let token = localStorage.getItem("token");
      axios
      .get("http://localhost:8001/expense")
      .then(function (response) {
        let expense = response.data[index];
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value =
          expense.description;
        document.getElementById("category").value = expense.category;

        let token = localStorage.getItem("token");
        return axios.delete(
          "http://localhost:8001/expense/" + expense.id
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