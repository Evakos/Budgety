// Expense Constructor essential but still not sure why.

let idcounter = 0;
function Expense(type, amount) {
  this.type = type;
  this.amount = amount;
  this.id = idcounter++;
}

//Global Array

let storeAmounts = [];

/// Nedd this exaplining still
function add(accumulator, a) {
  return accumulator + a.amount;
}

//Chart Constructor
//function Chart() {}

const ctx = document.getElementById('chart');

const expenseChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Percent of Budget', 'Budget'],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1']
      }
    ]
  },
  options: {
    legend: {
      display: false
    }
  }
});

console.log(expenseChart);

// UI Constructor

function UI() {}

// Add Expense To List:

UI.prototype.addExpenseToList = function(expense) {
  const list = document.getElementById('expense-list');

  const row = document.createElement('tr');

  //Where is the id being added though. Not physically.
  row.expenseid = expense.id;

  row.innerHTML = `
    
    <td>${expense.type}</td>

    <td>${expense.amount}</td>

    <td>${expense.id}</td>

    `;

  list.appendChild(row);
};

// Show Alert
UI.prototype.showAlert = function(message, className) {
  const div = document.createElement('div');

  document.querySelector('.messages').appendChild(div);

  div.appendChild(document.createTextNode(message));

  // Add classes
  div.className = `alert ${className}`;

  // Timeout after 3 sec
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 2500);
};

// Clear Fields

UI.prototype.clearFields = function() {
  document.getElementById('type').value = '';
  document.getElementById('amount').value = '';
};

// Delete Entry

UI.prototype.deleteExpense = function(target) {
  let current = target;
  while (current.tagName != 'TR') {
    current = current.parentElement;
  }

  console.log(current.expenseid);

  for (let i = storeAmounts.length - 1; i >= 0; i--) {
    let el = storeAmounts[i];
    if (el.id == current.expenseid) {
      storeAmounts.splice(i, 1);
    }
  }
  const sum = storeAmounts.reduce(add, 0); //Initalise

  document.getElementById('sum').textContent = sum;

  current.remove();
};

// Event Listener for add expense
document.getElementById('expense-form').addEventListener('submit', function(e) {
  // Get form values, don't need to repeat the const.
  const type = document.getElementById('type').value,
    amount = document.getElementById('amount').value;

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

  console.log(storeAmounts);

  e.preventDefault();
});

// Output Total

// Event Listener for delete
document.getElementById('expense-list').addEventListener('click', function(e) {
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
  .then(function(response) {
    if (response.status !== 200) {
      console.warn(
        'Looks like there was a problem. Status Code: ' + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function(data) {
      let option;

      for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.text = data[i].type;
        option.value = data[i].type;
        dropdown.add(option);
      }
    });
  })
  .catch(function(err) {
    console.error('Fetch Error -', err);
  });
