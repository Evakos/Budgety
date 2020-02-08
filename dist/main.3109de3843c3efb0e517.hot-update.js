webpackHotUpdate("main",{

/***/ "./src/js/dashboard.js":
/*!*****************************!*\
  !*** ./src/js/dashboard.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chart.js */ "./node_modules/chart.js/dist/Chart.js");
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chart_js__WEBPACK_IMPORTED_MODULE_0__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 //import axios from 'axios';
// fetch.get('localhost:3000/expense')
//     .then(function (response) {
//         // handle success
//         console.log(response);
//     })
//     .catch(function (error) {
//         // handle error
//         console.log(error);
//     })
//     .then(function () {
//         // always executed
//     });
//Make a request for the expense from the DB.

fetch('/expense').then(function (response) {
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' + response.status);
    return;
  } // Examine the text in the response


  response.json().then(function (data) {
    console.log(data);
  });
})["catch"](function (err) {
  console.log('Fetch Error :-S', err);
}); // fetch('/expenses')
//     .then(function (res) {
//         const expenses = res.json;
//         console.log(expenses)
//         let dropdown = document.getElementById('type');
//         let defaultOption = document.createElement('option');
//         defaultOption.text = 'Enter Expense Type';
//         defaultOption.value = '';
//         dropdown.add(defaultOption);
//         expenses.forEach(function (element) {
//             dropdown.options[dropdown.options.length] = new Option(element.content);
//         });
//     })
//     .catch(function (error) {
//         console.log(error);
//     })
//     .finally(function () {
//         console.log('Got the Expenses Object:');
//     });

var idcounter = 0; // Expense Constructor to be reusable.

function Expense(type, amount) {
  // type variable will contain "Groceries"
  // amount variable will contain 9.99
  this.type = type;
  this.amount = amount;
  this.id = idcounter++;
} // Expense.prototype.show = function () {
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


var storeAmounts = [];
var budget = 1600; //We will get this on input in the UI.

var budgetPercent = budget / budget * 100; //Return as a percent don't really need this.
/// Need this exaplining still

function add(accumulator, a) {
  return accumulator + a.amount;
}

var ctx = document.getElementById('chart');
var expenseChart = new chart_js__WEBPACK_IMPORTED_MODULE_0___default.a(ctx, {
  type: 'doughnut',
  data: {
    datasets: [{
      backgroundColor: ['rgba(0, 0, 0, .05)', 'rgba(0, 0, 0, .05)'],
      data: [100, 100]
    }],
    borderColor: ['rgba(233, 255, 255, 1)']
  },
  options: _defineProperty({
    animation: {
      duration: 1000,
      easing: 'linear'
    },
    responsive: false,
    maintainAspectRatio: false,
    aspectRatio: 1
  }, "animation", {
    animateRotate: true,
    render: false
  })
}); //Empty UI Constructor

function UI() {} // Add Expense To List:


UI.prototype.addExpenseToList = function (expense) {
  var list = document.getElementById('expense-list');
  var row = document.createElement('tr');
  row.expenseid = expense.id; // Where is the id being added though. Not physically.

  row.innerHTML = "\n    \n    <td>".concat(expense.type, "</td>\n\n    <td>").concat(expense.amount, "</td>\n\n    ");
  list.appendChild(row);
}; // Show Alert


UI.prototype.showAlert = function (message, className) {
  var div = document.createElement('div');
  document.querySelector('.messages').appendChild(div);
  div.appendChild(document.createTextNode(message));
  div.className = "alert ".concat(className); // Add classes

  setTimeout(function () {
    // Timeout after 3 sec
    document.querySelector('.alert').remove();
  }, 2500);
}; // Clear Fields


UI.prototype.clearFields = function () {
  document.getElementById('type').value = '';
  document.getElementById('amount').value = '';
}; // Delete Entry


UI.prototype.deleteExpense = function (target) {
  var current = target;

  while (current.tagName != 'TR') {
    current = current.parentElement;
  } //console.log(current.expenseid);


  for (var i = storeAmounts.length - 1; i >= 0; i--) {
    var el = storeAmounts[i];

    if (el.id == current.expenseid) {
      storeAmounts.splice(i, 1);
    }
  }

  var sum = storeAmounts.reduce(add, 0); //Initalise

  document.getElementById('sum').textContent = sum;
  current.remove();
  var sum1 = sum / budget * 100; //Expenense as a percentage of the budget

  var sum2 = budgetPercent + sum1;
  expenseChart.data.datasets[0].data = [sum1, sum2];
  expenseChart.data.datasets[0].backgroundColor = ['rgba(255, 102, 153, 1)'];
  expenseChart.update();
}; // Event Listener for add expense


document.querySelector('.button').addEventListener('click', function (e) {
  //console.log('clikced');
  // Get form values, don't need to repeat the const.
  var typeValue = document.getElementById('type').value,
      amountValue = document.getElementById('amount').value; // Instantiate expense this is from the expense object in line 1
  // by using the new keyword, the Expense (constructor) function will be called like every other function, but all the variables declaredas this.variablename will be attached
  // to the new Expense object (called expense) so you can later access those variables as expense.variablename as properties of the expense object
  // example: Let' say we selected "Groceries" for typeValue and 9.99 for the amount

  var expense = new Expense(typeValue, amountValue); // console.log(expense);

  var amountNo = parseInt(amountValue);
  var expenseObj = {
    amount: amountNo,
    id: expense.id
  };
  storeAmounts.push(expenseObj); //Initalise

  var sum = storeAmounts.reduce(add, 0);
  document.getElementById('sum').textContent = sum; // Update Chart

  var sum1 = sum / budget * 100; //Expenense as a percentage of the budget

  var sum2 = budgetPercent - sum1;
  expenseChart.data.datasets[0].data = [sum1, sum2];
  expenseChart.data.datasets[0].backgroundColor = ['rgba(255, 102, 153, 1)'];
  expenseChart.update(); // Instantiate UI

  var ui = new UI(); // Validate

  if (amountValue === '' || typeValue === '') {
    document.querySelector('.messages').style.backgroundColor = 'salmon'; // Error alert

    ui.showAlert(' Please fill in all fields', 'error');
  } else {
    // Add expense to list
    ui.addExpenseToList(expense); // Show success

    document.querySelector('.messages').style.backgroundColor = '#c5e2d9';
    ui.showAlert(' Expense Added', 'success'); // Clear fields

    ui.clearFields();
  } //console.log(storeAmounts);


  e.preventDefault();
}); // Event Listener for delete

document.getElementById('expense-list').addEventListener('click', function (e) {
  // Instantiate UI
  var ui = new UI(); // Delete Expense

  ui.deleteExpense(e.target); // Show message

  ui.showAlert(' Expense Removed', 'success'); // Show Totals
  //updateTotals();

  e.preventDefault();
}); //Populate Drop Down
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

/***/ })

})
//# sourceMappingURL=main.3109de3843c3efb0e517.hot-update.js.map