const Expense = require('../models/expense.model.js');

// Create and Save a new expense
exports.create = (req, res) => {
    // Validate request
    if (!req.body.description) {
        return res.status(400).send({
            message: "Expense description can not be empty"
        });
    }

    // Create an expense
    const expense = new Expense({
        title: req.body.title || "Untitled Expense",
        description: req.body.description
    });

    // Save expense in the database
    expense.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the expense."
            });
        });
};



// Retrieve and return all expenses from the database.
exports.findAll = (req, res) => {
    Expense.find()
        .then(expenses => {
            res.send(expenses);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the expenses."
            });
        });
};


// Find a single note with a noteId
exports.findOne = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};
