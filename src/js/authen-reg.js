//Register

const regForm = document.getElementById("reg-form");

regForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    // Collect the data from the input elements
    let username = regForm.querySelector("[name=name]").value;
    let email = regForm.querySelector("[name=email]").value;
    let pwd = regForm.querySelector("[name=password]").value;

    // Collect the message element
    let messages = document.querySelector(".messages");

    // Get input container div
    let getDiv = regForm.querySelectorAll(".inp");

    let input = regForm.querySelectorAll("input");

    let postBod = "name=" + username + "&email=" + email + "&password=" + pwd;

    let spinner = regForm.querySelector(".button");

    spinner.innerHTML = '<span class="loading"></span>';

    if (password.value != password2.value) {
      getDiv.forEach(function (element) {
        element.style.borderColor = "salmon";
        spinner.innerHTML = "Register";
        messages.innerHTML = "Passwords Should match";
        // setTimeout(function() {
        //   messages.innerHTML = '';
        // }, 2000);

        //console.log('Passwords Dont Match');
      });
      return;
    }

    if (username.length == 0 || email.length == 0 || pwd.length == 0) {
      //console.log(input);
      input.forEach(function (element) {
        element.style.borderColor = "salmon";
        //element.style.color = 'white';
        spinner.innerHTML = "Register";
        messages.innerHTML = "Please complete the fields";
        //console.log(email + 'is an eror');
        // setTimeout(function() {
        //   messages.innerHTML = '';
        // }, 2000);
      });
      return;
    }

    // Send a POST request with this data to the users api
    fetch("/api/users", {
      method: "POST",
      body: postBod,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log("Server request was successful " + res);

        window.location.href = "/html/settings.html";
      })
      .catch((err) => {
        err.then((errorData) => {
          console.dir(errorData);
          window.location.href = "login.html";
          console.log(
            "There was en error on the server side: " + errorData.error
          );
        });
      });

    // react on the success and error cases of the request
  },
  false
);

regForm.querySelector("[name=password]").addEventListener("input", function () {
  let x = regForm.querySelector("[name=password]");

  let y = regForm.querySelector(".pass-reveal-first");

  if (x.value.length == 0) {
    let i = "";
    y.innerHTML = i;
  } else {
    let i = '<i class="far fa-eye-slash"></i>';
    y.innerHTML = i;
  }
});

regForm
  .querySelector("[name=password2]")
  .addEventListener("input", function () {
    let x = regForm.querySelector("[name=password2]");

    let y = regForm.querySelector(".pass-reveal-second");

    if (x.value.length == 0) {
      let i = "";
      y.innerHTML = i;
    } else {
      let i = '<i class="far fa-eye-slash"></i>';
      y.innerHTML = i;
    }
  });

regForm
  .querySelector(".pass-reveal-first")
  .addEventListener("click", function () {
    let x = regForm.querySelector("[name=password]");

    let y = regForm.querySelector(".pass-reveal-first");

    if (x.type === "password") {
      x.type = "text";
      let i = '<i class="far fa-eye"></i>';
      y.innerHTML = i;
    } else {
      x.type = "password";
      let i = '<i class="far fa-eye-slash"></i>';
      y.innerHTML = i;
    }
  });

regForm
  .querySelector(".pass-reveal-second")
  .addEventListener("click", function () {
    let x = regForm.querySelector("[name=password2]");

    let y = regForm.querySelector(".pass-reveal-second");

    if (x.type === "password") {
      x.type = "text";
      let i = '<i class="far fa-eye"></i>';
      y.innerHTML = i;
    } else {
      x.type = "password";
      let i = '<i class="far fa-eye-slash"></i>';
      y.innerHTML = i;
    }
  });

// function ValidateEmail(mail) {
//   if (
//     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(regForm.email.value)
//   ) {
//     return true;
//   }
//   alert('You have entered an invalid email address!');
//   return false;
// }

// function valForm() {
//   if (password.value != password2.value) {
//     alert('Passwords do not match. Please try again.');
//   } else {
//     registerForm.submit();
//   }
// }
