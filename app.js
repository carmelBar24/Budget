// Import required modules
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// Import routes and database models
const loginRouter = require('./src/routes/login');
const registerRouter = require('./src/routes/register');
const updateCostRouter = require('./src/routes/updateCost');
const budgetRouter = require('./src/routes/budget');
const addCostRouter = require('./src/routes/addCost');
const removeCostRouter = require('./src/routes/removeCost');
const { authenticateToken } = require('./src/middlewares/middleware');

var app = express();

// Configure view engine and middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use the login router
app.use('/login',loginRouter)

// Use the register router
app.use('/register',registerRouter)

// Use the budget router
app.use('/budget',authenticateToken, budgetRouter)

// Use the addCost router
app.use('/addCost',authenticateToken,addCostRouter)

// Use the removeCost router
app.use('/removeCost',authenticateToken,removeCostRouter)

// Use the updateCost router
app.use('/updateCost',authenticateToken,updateCostRouter)


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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
