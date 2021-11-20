//import Chart from "chart.js";

import { listenerCount } from "events";

// const notificationDropdown = document.getElementById('notifications-dropdown');

// const notificationBell = document.getElementById('notifications-bell');

// notificationBell.addEventListener("mouseover", function() {
//   // highlight the mouseover target
//   notificationDropdown.style.display = "flex";

// });

// notificationBell.addEventListener("mouseout", function() {
//   // highlight the mouseover target
//   notificationDropdown.style.display = "none";

// });

const darkMode = document.getElementById("dark-mode");

darkMode.addEventListener("click", function (event) {
  let primary = "/src/img/moon.svg";
  let secondary = "/src/img/sun.svg";

  let imageSourceAttribute = event.target.getAttribute("src");

  //console.log(imageSourceAttribute);

  if (imageSourceAttribute.match(primary)) {
    darkMode.setAttribute("src", secondary);
  } else {
    darkMode.setAttribute("src", primary);
  }

  //console.log("dark mode clicked");
});

// Fetch the API into to create the link token
fetch("/api/create_link_token")
  .then((resp) => resp.json())
  .then(function (data) {
    const linkHandler = Plaid.create({
      token: data.link_token,
      onSuccess: (public_token, metadata) => {
        fetch("/api/set_access_token", {
          method: "POST",
          body: JSON.stringify({
            publicToken: public_token,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      },
      onLoad: () => {},
      onExit: (err, metadata) => {},
      onEvent: (eventName, metadata) => {},
      receivedRedirectUri: null,
    });

    document
      .getElementById("link-account")
      .addEventListener("click", function () {
        linkHandler.open();
        console.log("Link Handler");
      });

    // console.log(`This is the body: ${publicToken}`);

    document.getElementById("logout").addEventListener("click", function () {
      linkHandler.exit({ force: true });
      console.log("Logged out");
      alert("Logged Out");
    });
  })
  .catch((err) => {
    err.then((err) => {
      console.log(`This is the error: ${err}`);
    });
  });

fetch("/api/accounts")
  .then((resp) => resp.json())
  .then(function (data) {
    console.log("Something from accounts: " + JSON.stringify(data));

    // Get the app element
    const accounts = document.getElementById("#accounts-holder");

    // Create markup
    accounts.innerHTML =
      "<ul>" +
      data.accounts
        .map(function (dat) {
          return "<li>" + dat + "</li>";
        })
        .join("") +
      "</ul>";
  });

fetch("/api/user")
  .then((resp) => resp.json())
  .then(function (data) {
    document.querySelector(".user-name").textContent = data.name;

    //console.log(data);
  });

fetch("/api/confirm/:email/:token")
  .then((resp) => resp.json())

  // console.log(resp);

  .then((data) => {
    //Get the Cookie
    function getCookie(cName) {
      const name = cName + "=";
      const cDecoded = decodeURIComponent(document.cookie); //to be careful
      const cArr = cDecoded.split("; ");
      let res;
      cArr.forEach((val) => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
      });
      return res;
    }

    const initialCookie = getCookie("verifynotice");

    //console.log(initialCookie);

    if (data.status == 400 && initialCookie == null) {
      //console.log("400");
      //Get the message wrapper div
      const getMessageWrapper = document.querySelector(".message-wrapper");

      //Create the first span for the verification error
      const createFirstSpan = document.createElement("span");

      //Add a class to the verification error span
      createFirstSpan.classList.add("verify-error");

      // Add the verification span to the message wrapper
      getMessageWrapper.appendChild(createFirstSpan);

      //Insert message from confirmation API.
      createFirstSpan.innerText = data.msg;

      // Create Second Span
      setTimeout(function () {
        const createSecondSpan = document.createElement("span");

        createSecondSpan.classList.add("close-verification");

        const getErrorDiv = document.querySelector(".verify-error");

        //console.log(getErrorDiv);

        getErrorDiv.appendChild(createSecondSpan);

        createSecondSpan.innerHTML = '<i class="fas fa-times"></i>';
      }, 1);

      //Set name of the the cookie
      let verifynotice = "verifynotice";

      // Set a Cookie
      function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
      }

      setTimeout(function () {
        const getVerificationNotice = document.querySelector(
          ".close-verification"
        );

        getVerificationNotice.addEventListener("click", function () {
          setCookie(verifynotice, "true", 1);

          getMessageWrapper.style.opacity = "0";

          setTimeout(function () {
            getMessageWrapper.remove();
          }, 500);
          // getMessageWrapper.addEventListener("transitionend", () =>

          // );
        });
      }, 1);
    } else {
      console.log("200");
    }
  });

fetch("/api/expense")
  .then((resp) => resp.json())

  .then(function (data) {
    const expenses = data;

    //console.log("This is the: " + expenses);

    expenses.forEach(function (element) {
      //console.log("This is the: " + element.title);

      let d = document.querySelector(".expense-tags");

      let s = document.createElement("span");

      s.setAttribute("class", "tag");

      d.appendChild(s);

      let f = document.createTextNode(element.title);

      s.appendChild(f);

      // tags.push({
      //     tagTitle: element.title,
      //     enabled: false
      // })
    });
  })

  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    //console.log("Got the Expenses Object");
  });

//Greeting

const getTime = document.querySelector(".greeting");

const hour = new Date().getHours();

getTime.innerHTML =
  "Good " +
  ((hour < 12 && "Morning") || (hour < 18 && "Afternoon") || "Evening");

//Tags

const getTags = document.querySelector(".expense-tags");

getTags.addEventListener("click", toggleClass, false);

function toggleClass(e) {
  let tagElements = document.querySelectorAll(".tag");

  for (let tagEl of tagElements) {
    tagEl.classList.remove("enabled");
  }

  e.target.classList.add("enabled");

  e.stopPropagation();
}

let idcounter = 0;

// Expense Constructor to be reusable.

function Expense(type, amount) {
  // type variable will contain "Groceries"
  // amount variable will contain 9.99

  this.type = type;

  this.amount = amount;

  this.id = idcounter++;
}

// Expense.prototype.show = function () {
//   console.log(this.amount);
// }

// let expense = new Expense("Children", "100");
// expense.show()
// let expense2 = new Expense("Groceries", "200");
// expense2.show();

// let expense = {
//    type: "",
//    amount: 0,
//    id: 0,
//    setProperties: function(type, amount) {
//      this.type = type;
//      this.amount = amount;
//      this.id = idcounter++;
//}
// }

//Global Vars

let storeAmounts = [];

let budget = 1600; //We will get this on input in the UI.

let budgetPercent = (budget / budget) * 100; //Return as a percent don't really need this.

/// Need this expalining still
function add(accumulator, a) {
  return accumulator + a.amount;
}

// const ctx = document.getElementById("chart");

// let expenseChart = new Chart(ctx, {
//   type: "doughnut",
//   data: {
//     datasets: [
//       {
//         label: "My First dataset",
//         fillColor: "rgba(220,220,220,0.5)",
//         backgroundColor: "rgb(254, 254, 254)",
//         borderColor: "rgba(255, 255, 255, .5)",
//         borderWidth: "0",
//         data: [100, 100],
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "linear",
//     },
//     responsive: false,
//     maintainAspectRatio: false,
//     aspectRatio: 1,

//     animation: {
//       animateRotate: false,
//       render: false,
//     },
//   },
// });

//Empty UI Constructor

function UI() {}

// Add Expense To List:

UI.prototype.addExpenseToList = function (expense) {
  const list = document.getElementById("expense-list");

  const row = document.createElement("tr");

  row.expenseid = expense.id; // Where is the id being added though. Not physically.

  row.innerHTML = `
    
    <td>${expense.type}</td>

    <td>${expense.amount}</td>

    `;

  list.appendChild(row);
};

// Show Alert

UI.prototype.showAlert = function (message, className) {
  const div = document.createElement("div");

  document.querySelector(".messages").appendChild(div);

  div.appendChild(document.createTextNode(message));

  div.className = `alert ${className}`; // Add classes

  setTimeout(function () {
    // Timeout after 3 sec

    document.querySelector(".alert").remove();
  }, 2500);
};

// Clear Fields

UI.prototype.clearFields = function () {
  document.querySelector(".tag.enabled").value = "";

  document.getElementById("amount").value = "";
};

// Delete Entry

UI.prototype.deleteExpense = function (target) {
  let current = target;

  while (current.tagName != "TR") {
    current = current.parentElement;
  }

  //console.log(current.expenseid);

  for (let i = storeAmounts.length - 1; i >= 0; i--) {
    let el = storeAmounts[i];

    if (el.id == current.expenseid) {
      storeAmounts.splice(i, 1);
    }
  }

  const sum = storeAmounts.reduce(add, 0); //Initalise

  document.getElementById("sum").textContent = sum;

  current.remove();

  let sum1 = (sum / budget) * 100; //Expenense as a percentage of the budget

  let sum2 = budgetPercent + sum1;

  expenseChart.data.datasets[0].data = [sum1, sum2];

  expenseChart.data.datasets[0].backgroundColor = ["rgba(255, 102, 153, 1)"];

  expenseChart.update();
};

// Event Listener for add expense
document.querySelector(".button").addEventListener("click", function (e) {
  //console.log('clikced');

  // Get form values, don't need to repeat the const.
  const typeValue = document.querySelector(".tag.enabled").innerText,
    amountValue = document.getElementById("amount").value;

  // Instantiate expense this is from the expense object in line 1
  // by using the new keyword, the Expense (constructor) function will be called like every other function, but all the variables declaredas this.variablename will be attached
  // to the new Expense object (called expense) so you can later access those variables as expense.variablename as properties of the expense object

  // example: Let' say we selected "Groceries" for typeValue and 9.99 for the amount
  const expense = new Expense(typeValue, amountValue);

  // console.log(expense);

  let amountNo = parseInt(amountValue);

  let expenseObj = {
    amount: amountNo,
    id: expense.id,
  };

  storeAmounts.push(expenseObj);

  //Initalise

  const sum = storeAmounts.reduce(add, 0);

  document.getElementById("expense-totals").textContent = sum;

  // Update Chart

  let sum1 = (sum / budget) * 100; //Expenense as a percentage of the budget

  let sum2 = budgetPercent - sum1;

  expenseChart.data.datasets[0].data = [sum1, sum2];

  expenseChart.data.datasets[0].backgroundColor = ["rgba(255, 102, 153, 1)"];

  expenseChart.update();

  // Instantiate UI

  const ui = new UI();

  // Validate

  if (amountValue === "" || typeValue === "") {
    document.querySelector(".messages").style.backgroundColor = "salmon";

    // Error alert
    ui.showAlert(" Please fill in all fields", "error");
  } else {
    // Add expense to list
    ui.addExpenseToList(expense);

    // Show success
    document.querySelector(".messages").style.backgroundColor = "#c5e2d9";

    ui.showAlert(" Expense Added", "success");

    // Clear fields
    ui.clearFields();
  }

  //console.log(storeAmounts);

  e.preventDefault();
});

// Event Listener for delete

document.getElementById("expense-list").addEventListener("click", function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete Expense
  ui.deleteExpense(e.target);

  // Show message
  ui.showAlert(" Expense Removed", "success");

  // Show Totals
  //updateTotals();

  e.preventDefault();
});

//Populate Drop Down

// let dropdown = document.getElementById('type');

// dropdown.length = 0;

// let defaultOption = document.createElement('option');

// defaultOption.text = 'Enter Expense Type';

// defaultOption.value = '';

// dropdown.add(defaultOption);

// dropdown.selectedIndex = 0;

// let option;

// for (let i = 0; i < expenses.length; i++) {

//     //console.log(response);

//     option = document.createElement('option');

//     option._id = expenses[i].type;

//     option.name = expenses[i].type;

//     dropdown.add(option);

// }
