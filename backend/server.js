require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require('./config/database.config')[environment];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

const routes = require('./routes/users/index.users.routes.js');

app.use('/api/v1', routes(router));


app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;









// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const expenseRouter = require('./routes/expense.routes');
// const userRouter = require('./routes/authenticate.routes');

// // create express app
// const app = express();

// app.use(userRouter, expenseRouter)

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

// // parse requests of content-type - application/json
// app.use(bodyParser.json())

// // Configuring the database
// const dbConfig = require('./config/database.config');


// mongoose.Promise = global.Promise;


// //This doesnt work
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });



// // Connecting to the database
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true, useUnifiedTopology: true
// }).then(() => {
//   console.log("Successfully connected to the database");
// }).catch(err => {
//   console.log('Could not connect to the database. Exiting now...', err);
//   process.exit();
// });




// // // include routes
// // var routes = require('./routes/router');
// // app.use('/', routes);

// // // catch 404 and forward to error handler
// // app.use(function (req, res, next) {
// //   var err = new Error('File Not Found');
// //   err.status = 404;
// //   next(err);
// // });

// // // error handler
// // // define as the last app.use callback
// // app.use(function (err, req, res, next) {
// //   res.status(err.status || 500);
// //   res.send(err.message);
// // });

// // listen for requests
// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });
