require('dotenv').config(); // Sets up dotenv as soon as our application starts
const express = require('express');
// const flash = require('express-flash-notification');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');

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
const stage = require('./config/database.config')[environment];

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

if (environment !== 'production') {
  app.use(logger('dev'));
}

const routes = require('./routes/users/index.users.routes.js');

app.use('/api', routes(router));

const routes2 = require('./routes/expenses/index.expense.routes.js');

app.use('/api', routes2(router));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
