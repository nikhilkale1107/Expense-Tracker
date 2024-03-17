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
          window.location.replace("http://127.0.0.1:5500/index.html");
        } else {
          const errorMessage = result.message;
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