// Expense Constructor

function Expense(type, amount) {
  this.type = type;
  this.amount = amount;
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
    <td><a href="#" class="delete"><i class="far fa-trash-alt"></i><a></td>
    
    `;

  list.appendChild(row);
};

// Show Alert
UI.prototype.showAlert = function(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.col-a');
  // Get form
  const form = document.querySelector('#expense-form');
  // Insert alert
  container.insertBefore(div, form);

  // Timeout after 3 sec
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 1000);
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
  // Get form values
  const type = document.getElementById('type').value,
    amount = document.getElementById('amount').value;

  // Instantiate expense
  const expense = new Expense(type, amount);

  // Instantiate UI
  const ui = new UI();

  // Validate
  console.log('The type is: ' + type);
  if (amount === '' || type === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addExpenseToList(expense);

    // Show success
    ui.showAlert('Expense Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById('expense-list').addEventListener('click', function(e) {
  // Instantiate UI
  const ui = new UI();

  // Delete Expense
  ui.deleteExpense(e.target);

  // Show message
  ui.showAlert('Expense Removed!', 'success');

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
