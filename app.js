// Import required modules
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// Import routes and database models
var indexRouter = require('./routes/index');
const { handleBudgetRequest,handleAddCostRequest,handleRemoveCostRequest,handleUpdateCostRequest,handleRegisterRequest,handleLoginRequest} = require('./budgetRoutes');
const { authenticateToken } = require('./middleware');

var app = express();

// Configure view engine and middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use the index router
app.use('/', indexRouter);

// Handle user login
app.post('/login',handleLoginRequest)

// Handle user registration
app.post('/register',handleRegisterRequest)

// Handle budget retrieval
app.get('/budget',authenticateToken, handleBudgetRequest)

// Handle adding a cost entry
app.post('/addCost',authenticateToken,handleAddCostRequest)

// Handle removing a cost entry
app.delete('/removeCost',authenticateToken,handleRemoveCostRequest )

// Handle updating a cost entry
app.post('/updateCost',authenticateToken,handleUpdateCostRequest)


// Error handling for 404 and other errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handling middleware
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
