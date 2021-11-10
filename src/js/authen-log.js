const logForm = document.getElementById("login-form");

logForm.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    // Collect the data from the input elements
    // let name = logForm.querySelector("[name=name]").value;
    let email = logForm.querySelector("[name=email]").value;
    let pwd = logForm.querySelector("[name=password]").value;

    let postBody = "&email=" + email + "&password=" + pwd;

    console.log(postBody);

    let spinner = logForm.querySelector(".button");

    spinner.innerHTML = '<span class="loading"></span>';

    // Send a POST request with this data to the login api
    fetch("/api/login", {
      method: "POST",
      body: postBody,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((data) => {
        switch (data.status) {
          case 200:
            return data.json();
            break;
          default:
            throw data.json();

            //alert("An error has occurred: User doesn't exist");
            break;
        }
      })
      .then((jsonData) => {
        console.dir(jsonData.result.name);
        // First save the token to localStorage
        window.localStorage.setItem("token", jsonData.token);

        //console.log("Here " + jsonData);

        // Second: Forward to dashboard page
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        err.then((err) => {
          //console.dir(errorData);

          let error = logForm.querySelector(".messages-wrapper");

          error.innerHTML = '<span class="error">Error! No User</span>';

          spinner.innerHTML = "Login";

          //console.log("There was en error on the server side: " + err);
        });
      });

    // react on the success and error cases of the request
  },
  false
);
