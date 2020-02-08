module.exports = (app) => {
    const expense = require('../controllers/expense.controller.js');

    // Create a new expense
    app.post('/expense', expense.create);

    // Retrieve all expense
    app.get('/expense', expense.findAll);

    // Retrieve a single expense with expenseId
    app.get('/expense/:expenseId', expense.findOne);

    // Update a expense with expenseId
    app.put('/expense/:expenseId', expense.update);

    // Delete a expense with expenseId
    app.delete('/expense/:expenseId', expense.delete);
}