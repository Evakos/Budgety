const mongoose = require("mongoose");

const usersMetaSchema = mongoose.Schema(
  {
    period: String,
    amount: Number,
    currency: Number,
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UsersMeta", usersMetaSchema);
