const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model.js");

const connUri = process.env.ATLAS_CONN_URL;

module.exports = {
  //Handle Add User
  add: (req, res) => {
    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;

        const { name, email, password } = req.body;

        if (!err) {
          User.findOne({ email, name }, (err, user) => {
            if (!err && user) {
              console.log("User Exists");
              result.status = status;
              result.result = user;
              console.log(user);
            } else if (!user) {
              //result.error = err;
              console.log("No user....Creating User ");
            }
          });

          const user = new User({ name, email, password }); // document = instance of a model
          // TODO: We can hash the password here before we insert instead of in the model
          user.save((err, user) => {
            if (!err) {
              result.status = status;
              result.result = user;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },

  //Handle Login

  login: (req, res) => {
    const { email, name, password } = req.body;
    console.log("Username: " + name);
    console.log("Email: " + email);
    console.log("Passord: " + password);

    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          User.findOne({ email, name }, (err, user) => {
            if (!err && user) {
              //console.dir("User: " + user);

              // We could compare passwords in our model instead of below as well
              bcrypt
                .compare(password, user.password)
                .then((match) => {
                  if (match) {
                    status = 200;
                    // Create a token
                    const payload = { user: user.name };
                    const options = {
                      expiresIn: "2d",
                      issuer: "https://budgety.io",
                    };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    console.log("TOKEN", token);
                    result.token = token;
                    result.status = status;
                    result.result = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication tyrtt`;
                  }
                  res.status(status).send(result);
                })
                .catch((err) => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                });
            } else {
              status = 404;
              result.status = status;
              result.error = "No matching user found";
              res.status(status).send(result);
            }
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },

  //Handle Logout

  logout: (req, res) => {
    res.redirect("/");
  },

  //Get All Users

  getAll: (req, res) => {
    mongoose.createConnection(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          const payload = req.decoded;
          // TODO: Log the payload here to verify that it's the same payload
          //  we used when we created the token
          // console.log('PAYLOAD', payload);
          if (payload && payload.user === "admin") {
            User.find({}, (err, users) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = users;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            });
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
          }
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },
};
