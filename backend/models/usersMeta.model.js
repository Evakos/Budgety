const mongoose = require("mongoose");

const usersMetaSchema = mongoose.Schema(
  {
    period: String,
    amount: Number,
    currency: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UsersMeta", usersMetaSchema);
