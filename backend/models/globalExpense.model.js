const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
