const elFor = document.querySelector(".form");
const elBtn = document.querySelector(".submit");
const API = `https://fakestoreapi.com/auth/login`;

elFor.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = elFor["username"].value.trim();
  const password = elFor["password"].value.trim();

  if (!username || !password) {
    Toastify({
      text: "Invalid username or password",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #8c092c, #600c0f)"
      },
      onClick: function () {}
    }).showToast();
    return;
  }

  const user = {
    username: username,
    password: password
  };

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "welcome.html";
      }
    })
    .catch((error) => {
      Toastify({
        text: "Invalid username or password",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #8c092c, #600c0f)"
        },
        onClick: function () {}
      }).showToast();
      console.error(error);
    });
});
