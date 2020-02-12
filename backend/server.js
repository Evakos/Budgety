const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config');


mongoose.Promise = global.Promise;


//This doesnt work
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

// Require Notes routes
require('./routes/expense.routes')(app);

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
