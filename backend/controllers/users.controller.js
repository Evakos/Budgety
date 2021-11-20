const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const User = require("../models/users.model.js");
const Token = require("../models/token.model.js");

const connUri = process.env.ATLAS_CONN_URL;

module.exports = {
  //Handle Add User
  add: (req, res) => {
    //console.dir(req.session.user);
    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        const { name, email, password } = req.body;

        if (!err) {
          let result = {};
          let status = 201;
          User.findOne({ email }, (err, user) => {
            if (!err && user) {
              result.status = status;
              result.result = user;

              return res.redirect("/login.html");
            } else if (!user) {
              res.error = err;

              const user = new User({ name, email, password }); // document = instance of a model
              // TODO: We can hash the password here before we insert instead of in the model. What the heck.
              user.save((err, user) => {
                if (!err) {
                  result.status = status;
                  result.result = user;
                  req.session.user = user;

                  // generate token and save
                  const token = new Token({
                    _userId: user._id,
                    token: crypto.randomBytes(16).toString("hex"),
                  });

                  token.save();

                  // Send email with Sendgrid API key store in .env.
                  const transport = nodemailer.createTransport(
                    nodemailerSendgrid({
                      apiKey: process.env.SENDGRID_API_KEY,
                    })
                  );

                  const mailOptions = {
                    from: "info@evakos.io",
                    to: user.email,
                    subject: "Account Verification Link",
                    text:
                      "Hello " +
                      req.body.name +
                      ",\n\n" +
                      "Please verify your account by clicking the link: \nhttp://" +
                      req.headers.host +
                      "/api/confirm/" +
                      user.email +
                      "/" +
                      token.token +
                      "\n\nThank You!\n",
                  };

                  transport.sendMail(mailOptions),
                    function (err) {
                      if (err) {
                        return res.status(500).send({
                          msg: "Technical Issue!, Please click on resend for verify your Email.",
                        });
                      }
                      return res
                        .status(200)
                        .send(
                          "A verification email has been sent to " +
                            user.email +
                            ". It will be expire after one day. If you not get verification Email click on resend token."
                        );
                    };
                }
              });

              return res.redirect("/dashboard.html");
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
    const { email, password } = req.body;

    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          //console.log("No error yet");

          User.findOne({ email }, (err, user) => {
            //console.log("Finding " + user);
            //return;

            if (!err && user) {
              console.log("User: " + user);
              //return;

              // We could compare passwords in our model instead of below as well
              bcrypt
                .compare(password, user.password)
                .then((match) => {
                  if (match) {
                    status = 200;
                    // Create a token
                    const payload = { user: user.name, id: user._id };
                    const options = {
                      expiresIn: "2d",
                      issuer: "https://budgety.io",
                    };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    result.token = token;
                    result.status = status;
                    result.result = user;

                    console.dir("User: " + user);

                    //req = user; // Add to req object

                    req.session.user = user._id;
                    req.session.name = user.name;

                    // req.currentUser = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = "Authentication";

                    console.log("Forgot Password");
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
              console.log("Here");
              status = 404;
              result.status = status;
              result.error = "No matching user found";
              res.status(status).send(result);
            }
          });
        } else {
          console.log("Server Error!");
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },

  // It is GET method, you have to write like that
  //    app.get('/confirm/:email/:token',confirm)

  confirm: (req, res) => {
    //console.log(req.session.user);
    // console.log("Here");
    Token.findOne({ token: req.params.token }, function (err, token) {
      // token is not found in the database i.e. token may have expired
      if (!token) {
        return res.status(400).send({
          msg: "Your account is not verified. Please click here to resend the verification link",
          status: 400,
        });
      }
      // if token is found then check valid user
      else {
        User.findOne(
          { _id: token._userId, email: req.params.email },
          function (err, user) {
            // not valid user
            if (!user) {
              return res.status(401).send({
                msg: "We were unable to find a user for this verification. Please SignUp!",
              });
            }
            // user is already verified
            else if (user.isVerified) {
              return res
                .status(200)
                .send("User has been already verified. Please Login");
            }
            // verify user
            else {
              // change isVerified to true
              user.isVerified = true;
              user.save(function (err) {
                // error occur
                if (err) {
                  return res.status(500).send({ msg: err.message });
                }
                // account successfully verified
                else {
                  return res
                    .status(200)
                    .send("Your account has been successfully verified");
                }
              });
            }
          }
        );
      }
    });
  },

  //Handle Logout

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  //Get Single User

  getUser: (req, res) => {
    let result = {};

    const user = req.session.user;
    const name = req.session.name;

    result.user = user;

    result.name = name;

    res.status(200).send(result);

    //return req.session.user;

    // return res.status(200).send(result);
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

          console.log(payload);
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
