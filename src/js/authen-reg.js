//Register a New User

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
    // let getDiv = regForm.querySelectorAll(".inp");

    let input = regForm.querySelectorAll("input");

    //console.log("Input is" + input);

    let postBod = "name=" + username + "&email=" + email + "&password=" + pwd;

    let spinner = regForm.querySelector(".button");

    spinner.innerHTML = '<span class="loading"></span>';

    //return;

    // if (password.value != password2.value) {
    //   getDiv.forEach(function (element) {
    //     element.style.borderColor = "salmon";
    //     spinner.innerHTML = "Register";
    //     messages.innerHTML = "Passwords Should match";
    //     // setTimeout(function() {
    //     //   messages.innerHTML = '';
    //     // }, 2000);

    //     //console.log('Passwords Dont Match');
    //   });
    //   return;
    // }

    //Checking here if fields have content. Need to modify if one specific field is misising.
    if (username.length == 0 || email.length == 0 || pwd.length == 0) {
      input.forEach(function (element) {
        element.style.borderColor = "rgb(255, 182, 193)";
        element.style.borderWidth = "2px";
        element.style.borderStyle = "solid";

        spinner.innerHTML = "Register";

        messages.innerHTML = "Please complete the fields";
      });
      return;
    }

    // Send a POST request with this data to the users api
    fetch("/api/users", {
      method: "POST",
      body: postBod,
      // mode: "allow-origin", // no-cors, *cors, same-origin
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        const url = res.url;
        window.location.href = url;
      })
      .catch((err) => {
        err.then((errorData) => {
          console.dir(errorData);
          console.log(
            "There was en error on the server side: " + errorData.error
          );
        });
      });

    // react on the success and error cases of the request
  },
  false
);

//Handle apperaence of 'eye' icon on detection of input.
regForm.querySelector("[name=password]").addEventListener("input", function () {
  const formPassword = regForm.querySelector("[name=password]");

  let passwordReveal = regForm.querySelector(".password-reveal");

  if (formPassword.value.length == 0) {
    let i = "";
    passwordReveal.innerHTML = i;
  } else {
    let i = '<i class="far fa-eye-slash"></i>';
    passwordReveal.innerHTML = i;
  }
});

//Password Strength Meter

// Timeout before a callback is called

let timeout;

// Get the password field and div to output strength validation message.

let formPassword = regForm.querySelector("[name=password]");
let messages = document.querySelector(".messages");

// The strong and weak password Regex pattern checker

let strongPassword = new RegExp(
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
);
let mediumPassword = new RegExp(
  "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
);

//Pass in password to paramater
function passwordStrengthCheck(pwd) {
  // We then change the badge's color and text based on the password strength

  if (strongPassword.test(pwd)) {
    messages.style.color = "green";
    messages.textContent = "Your Password is Strong";
  } else if (mediumPassword.test(pwd)) {
    messages.style.color = "blue";
    messages.textContent = "Your Password is Medium";
  } else {
    messages.style.color = "red";
    messages.textContent = "Your Password is Weak";
  }
}

// Adding an input event listener when a user types to the  password input

formPassword.addEventListener("input", () => {
  //The badge is hidden by default, so we show it
  messages.style.display = "flex";

  clearTimeout(timeout);

  //We then call the StrengChecker function as a callback then pass the typed password to it

  timeout = setTimeout(() => passwordStrengthCheck(password.value), 500);

  //Hide badge if password field is emty

  if (password.value.length !== 0) {
    messages.style.display != "flex";
  } else {
    messages.style.display = "none";
  }
});

// regForm
//   .querySelector("[name=password2]")
//   .addEventListener("input", function () {
//     let x = regForm.querySelector("[name=password2]");

//     let y = regForm.querySelector(".pass-reveal-second");

//     if (x.value.length == 0) {
//       let i = "";
//       y.innerHTML = i;
//     } else {
//       let i = '<i class="far fa-eye-slash"></i>';
//       y.innerHTML = i;
//     }
//   });

regForm
  .querySelector(".password-reveal")
  .addEventListener("click", function () {
    let x = regForm.querySelector("[name=password]");

    let y = regForm.querySelector(".password-reveal");

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

// regForm
//   .querySelector(".pass-reveal-second")
//   .addEventListener("click", function () {
//     let x = regForm.querySelector("[name=password2]");

//     let y = regForm.querySelector(".pass-reveal-second");

//     if (x.type === "password") {
//       x.type = "text";
//       let i = '<i class="far fa-eye"></i>';
//       y.innerHTML = i;
//     } else {
//       x.type = "password";
//       let i = '<i class="far fa-eye-slash"></i>';
//       y.innerHTML = i;
//     }
//   });

// function ValidateEmail(mail) {
//   if (
//     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(regForm.email.value)
//   ) {
//     return true;
//   }
//   alert("You have entered an invalid email address!");
//   return false;
// }

// function valForm() {
//   if (password.value != password2.value) {
//     alert("Passwords do not match. Please try again.");
//   } else {
//     registerForm.submit();
//   }
// }
