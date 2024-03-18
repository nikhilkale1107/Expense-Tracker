document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded");
  });

  function register() {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
      .post("http://localhost:8001/user/register", {
        name: name,
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => console.log(err));
  }