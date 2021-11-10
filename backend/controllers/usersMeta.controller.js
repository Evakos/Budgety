const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const UserMeta = require("../models/usersMeta.model.js");
const User = require("../models/users.model.js");

const connUri = process.env.ATLAS_CONN_URL;

module.exports = {
  //Handle Add User
  add: (req, res) => {
    console.log("Users Meta Controller: ", req.session.user);

    mongoose.connect(
      connUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },

      (err) => {
        let result = {};
        let status = 201;

        const { period, amount, currency } = req.body;

        if (!err) {
          const userMeta = new UserMeta({
            period,
            amount,
            currency,
            //user: user._id,
          });

          // console.log(userMeta);

          userMeta.save((err, userMeta) => {
            if (!err) {
              result.status = status;
              result.result = userMeta;
              User.findOne(
                { _id: new mongoose.Types.ObjectId(req.session.user._id) },
                (err, myUser) => {
                  myUser.usermeta = userMeta._id;
                  myUser.save();
                }
              );
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        }
      }
    );
  },
};
