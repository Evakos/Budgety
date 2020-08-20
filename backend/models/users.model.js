const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const environment = process.env.NODE_ENV;
const stage = require("../config/database.config.js")[environment];

// Schema maps to a db collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: "String",
    required: true,
    trim: true,
  },
  email: {
    type: "String",
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: "String",
    required: true,
    trim: true,
  },
});

// userSchema.path('email').validate = function (email) {
//     return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
// };

// userSchema.statics.updateUser = function(user, cb) {
//   UserModel.find({name : user.name}).exec(function(err, docs) {
//     if (docs.length){
//       cb('Name exists already', null);
//     } else {
//       user.save(function(err) {
//         cb(err,user);
//       }
//     }
//   });
// }

// Encrypting PW before it's saved
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified || !user.isNew) {
    // don't rehash if it's an old user
    next();
  } else {
    bcrypt.hash(user.password, stage.salt, function (err, hash) {
      if (err) {
        console.log("Error hashing password for user", user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

module.exports = mongoose.model("User", userSchema);
