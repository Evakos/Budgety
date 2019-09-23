// Expense Constructor essential but still not sure why.

function Expense(type, amount) {
  this.type = type;
  this.amount = amount;
}

// Create and Update Totals

function updateTotals() {
  let rows = document.querySelectorAll('table tr td:last-child');
  let sum = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    sum += Number(rows[i].textContent);
  }
  document.getElementById('sum').textContent = sum;
}

// UI Constructor

function UI() {}

// Add Expense To List:

UI.prototype.addExpenseToList = function(expense) {
  const list = document.getElementById('expense-list');

  const row = document.createElement('tr');

  row.innerHTML = `
    
    <td>${expense.type}</td>

    <td>${expense.amount}</td>

    `;

  list.appendChild(row);
};

// let rows = document.querySelectorAll('table tr td:last-child');
// let sum = 0;

// for (let i = 0; i < rows.length - 1; i++) {
//   sum += Number(rows[i].textContent);
// }

// document.getElementById('sum').textContent = sum;

// console.log(sum);

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

  console.log(current);

  current.remove();
};

// Event Listener for add expense
document.getElementById('expense-form').addEventListener('submit', function(e) {
  // Get form values, don't need to repeat the const.
  const type = document.getElementById('type').value,
    amount = document.getElementById('amount').value;

  // Instantiate expense this is from the expense object in line 1
  const expense = new Expense(type, amount);

  // console.log(expense);

  // Instantiate UI
  const ui = new UI();

  // Validate
  console.log('The type is: ' + type);

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

    // Show Totals

    updateTotals();
  }

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

  updateTotals();

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
