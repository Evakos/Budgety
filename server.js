require("dotenv").config(); // Sets up dotenv as soon as our application starts
const express = require("express");
const session = require("express-session");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const User = require("./backend/models/users.model.js");
const UserMeta = require("./backend/models/usersMeta.model.js");
const path = require("path");
const logger = require("morgan");

const app = express();

const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require("./config/database.config")[environment];

app.use(favicon(path.join(__dirname, "/", "favicon.ico")));

const connUri = process.env.ATLAS_CONN_URL;

//One Time DB Connection
mongoose.connect(connUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Connection to Atlas MongoDB established");
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "horatio",
    saveUninitialized: false,
    resave: false,
    maxAge: 60 * 60 * 1000,
    //store: new Store({ mongooseConnection: mongoose.connection }),
  })
);

if (environment !== "production") {
  app.use(logger("dev"));

  const staticPath = path.join(__dirname, ".", "src", "html");
  console.log("staticPath test:", staticPath);
  app.use(express.static(staticPath));

  // app.use(express.static(path.join(__dirname, "src")));

  // app.get("/", function (req, res) {
  //   res.sendFile(path.join(staticPath, "/index.html"));
  // });

  // app.get("/dashboard", function (req, res) {
  //   res.sendFile(path.join(staticPath, "/dashboard.html"));
  // });

  // app.get("/login", function (req, res) {
  //   res.sendFile(path.join(staticPath, "/login.html"));
  // });
}

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

const routes = require("./backend/routes/users/index.users.routes.js");

app.use("/api", routes(router));

const routes2 = require("./backend/routes/expenses/index.globalExpense.routes.js");

app.use("/api", routes2(router));

const routes3 = require("./backend/routes/usersMeta/index.usersMeta.routes.js");

app.use("/api", routes3(router));

const routes4 = require("./backend/routes/plaid/index.plaid.routes.js");

app.use("/api", routes4(router));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

app.get;

// app.get("/hello", (req, res) => {
//   res.status(500).send("Not found unfortunately");
// });

module.exports = app;
