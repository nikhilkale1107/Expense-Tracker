document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded");
  });

  function register() {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    axios
      .post("http://localhost:8001/api/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          displaySuccess("Logged In");
        } else {
          //i have to show error in the form
          const errorMessage = result.data.message; // Adjust based on your API's response
          displayError(errorMessage);
        }
      })
      .catch((err) => console.log(err));
  }

  function displayError(message) {
    const errorContainer = document.querySelector(".error-container");
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
  }

  function displaySuccess(message) {
    const successContainer = document.querySelector(".success-container");
    successContainer.textContent = message;
    successContainer.classList.remove("hidden");
  }