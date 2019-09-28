// Expense Constructor essential but still not sure why.

let idcounter = 0;

function Expense(type, amount) {

  this.type = type;

  this.amount = amount;

  this.id = idcounter++;

}

//Global Vars

let storeAmounts = [];

let budget = 1600; //We will get this on input in the UI.

let budgetPercent = (budget / budget) * 100; //Return as a percent dont really need this.

/// Need this exaplining still
function add(accumulator, a) {

  return accumulator + a.amount;

}

//function Chart() { }

const ctx = document.getElementById('chart');

let expenseChart = new Chart(ctx, {

  type: 'doughnut',
  data: {
    datasets: [
      {
        backgroundColor: ['rgba(0, 0, 0, .05)', 'rgba(0, 0, 0, .05)'],
        data: [100, 100]
      }
    ],

    borderColor: ['rgba(233, 255, 255, 1)']
  },
  options: {
    animation: {
      duration: 1000,
      easing: 'linear'
    }
  }
});

//Empty UI Constructor

function UI() { }

// Add Expense To List:

UI.prototype.addExpenseToList = function (expense) {

  const list = document.getElementById('expense-list');

  const row = document.createElement('tr');

  row.expenseid = expense.id;  // Where is the id being added though. Not physically.

  row.innerHTML = `
    
    <td>${expense.type}</td>

    <td>${expense.amount}</td>

    `;

  list.appendChild(row);
};

// Show Alert

UI.prototype.showAlert = function (message, className) {

  const div = document.createElement('div');

  document.querySelector('.messages').appendChild(div);

  div.appendChild(document.createTextNode(message));

  div.className = `alert ${className}`;// Add classes

  setTimeout(function () { // Timeout after 3 sec

    document.querySelector('.alert').remove();

  }, 2500);

};

// Clear Fields

UI.prototype.clearFields = function () {

  document.getElementById('type').value = '';

  document.getElementById('amount').value = '';
};


// Delete Entry

UI.prototype.deleteExpense = function (target) {

  let current = target;

  while (current.tagName != 'TR') {

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

  document.getElementById('sum').textContent = sum;

  current.remove();




  let sum1 = (sum / budget) * 100; //Expenense as a percentage of the budget

  let sum2 = budgetPercent + sum1;

  expenseChart.data.datasets[0].data = [sum1, sum2];

  expenseChart.data.datasets[0].backgroundColor = ['rgba(255, 102, 153, 1)'];

  expenseChart.update();

};

// Event Listener for add expense

document.getElementById('expense-form').addEventListener('submit', function (e) {

  // Get form values, don't need to repeat the const.
  const type = document.getElementById('type').value, amount = document.getElementById('amount').value;

  // Instantiate expense this is from the expense object in line 1
  const expense = new Expense(type, amount);

  let amountNo = parseInt(amount);

  let expenseObj = {

    amount: amountNo,

    id: expense.id

  };

  storeAmounts.push(expenseObj);

  //Initalise

  const sum = storeAmounts.reduce(add, 0);

  document.getElementById('sum').textContent = sum;

  // Update Chart

  let sum1 = (sum / budget) * 100; //Expenense as a percentage of the budget

  let sum2 = budgetPercent - sum1;

  expenseChart.data.datasets[0].data = [sum1, sum2];

  expenseChart.data.datasets[0].backgroundColor = ['rgba(255, 102, 153, 1)'];

  expenseChart.update();

  // Instantiate UI

  const ui = new UI();

  // Validate

  if (amount === '' || type === '') {
    document.querySelector('.messages').style.backgroundColor = 'salmon';
    // Error alert
    ui.showAlert(' Please fill in all fields', 'error');

  } else {

    // Add expense to list
    ui.addExpenseToList(expense);

    // Show success
    document.querySelector('.messages').style.backgroundColor = '#c5e2d9';

    ui.showAlert(' Expense Added', 'success');

    // Clear fields
    ui.clearFields();
  }

  //console.log(storeAmounts);

  e.preventDefault();

});



// Event Listener for delete

document.getElementById('expense-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete Expense
  ui.deleteExpense(e.target);

  // Show message
  ui.showAlert(' Expense Removed', 'success');

  // Show Totals
  //updateTotals();

  e.preventDefault();
});


// Populate Drop Down

let dropdown = document.getElementById('type');

dropdown.length = 0;

let defaultOption = document.createElement('option');

defaultOption.text = 'Enter Expense Type';

defaultOption.value = '';

dropdown.add(defaultOption);

dropdown.selectedIndex = 0;

const url = 'json/json';

fetch(url)

  .then(function (response) {

    if (response.status !== 200) {

      console.warn(

        'Looks like there was a problem. Status Code: ' + response.status
      );

      return;

    }

    // Examine the text in the response

    response.json().then(function (data) {

      let option;

      for (let i = 0; i < data.length; i++) {

        option = document.createElement('option');

        option.text = data[i].type;

        option.value = data[i].type;

        dropdown.add(option);

      }

    });

  })
  .catch(function (err) {

    console.error('Fetch Error -', err);

  });
