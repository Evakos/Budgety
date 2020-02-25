const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const Expense = require('../models/expense.model');

const connUri = process.env.ATLAS_CONN_URL;

module.exports = {
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, err => {
      // Validate request
      if (!req.body.description) {
        return res.status(400).send({
          message: 'Expense description can not be empty'
        });
      }

      // Create an expense
      const expense = new Expense({
        title: req.body.title || 'Untitled Expense',
        description: req.body.description
      });

      // Save expense in the database
      expense
        .save()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || 'An error occured while trying to save the expense'
          });
        });
    });
  },

  // Retrieve and return all expenses from the database.
  findAll: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, err => {
      Expense.find()
        .then(expenses => {
          res.send(expenses);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || 'An Error occurred while retrieving the expenses.'
          });
        });
    });
  }
};
// // Find a single expense
// : findOne = (req, res) => {

//         };

// // Update an expense identified by the noteId in the request
// : update = (req, res) => {

//         };

// // Delete a note with the specified noteId in the request
// : delete = (req, res) => {

//         };

//     }
