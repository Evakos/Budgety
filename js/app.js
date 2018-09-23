//Expense Constructor

function Expense (type, amount) {

    this.type = type;
    this.amount = amount;
}


//UI Constructor

function UI() {}


//Add Expense To List

UI.prototype.addExpenseToList = function (expense) {

    const list = document.getElementById('expense-list');

    console.log (expense);
}


//Event Listener


document.getElementById('expense-form').addEventListener('submit',

    function (e) {
        //Form Values
        const type  = document.getElementById('type').value,

        amount = document.getElementById('amount').value

        console.log (type, amount)

//I Expense
const expense = new Expense (type, amount);

console.log (expense);

//I UI

const ui = new UI();

console.log(ui);

ui.addExpenseToList(expense);

        e.preventDefault();
    }
);
