require("dotenv").config(); // Sets up dotenv as soon as our application starts
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/users.model.js");
const UserMeta = require("./models/usersMeta.model.js");

//const Store = require("connect-mongo")(session);
// const flash = require('express-flash-notification');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
const logger = require("morgan");
// const bodyParser = require("body-parser");

const app = express();
// app.use(cookieParser());
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))
// app.use(flash(app));
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require("../config/database.config")[environment];

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "dog",
    saveUninitialized: false,
    resave: false,
    maxAge: 60 * 60 * 1000,
    //store: new Store({ mongooseConnection: mongoose.connection }),
  })
);

if (environment !== "production") {
  app.use(logger("dev"));
}
const connUri = process.env.ATLAS_CONN_URL;

app.get("/api/budget", (req, res) => {
  mongoose.connect(
    connUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      console.log("ERROR upon connecting?");
      console.error(err);
      User.findOne({ _id: mongoose.Types.ObjectId(req.session.user._id) })
        .populate({ path: "usermeta", model: UserMeta })
        .exec((err, user) => {
          console.log("ERROR when finding the user in the db?");
          console.error(err);
          res.end(user.usermeta.amount.toString());
        });
    }
  );
});

const routes = require("./routes/users/index.users.routes.js");

app.use("/api", routes(router));

const routes2 = require("./routes/expenses/index.globalExpense.routes.js");

app.use("/api", routes2(router));

const routes3 = require("./routes/usersMeta/index.usersMeta.routes.js");

app.use("/api", routes3(router));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
