require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

var indexRouter = require('./routes/index');
const {User,Budget}= require("./models/database");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.post('/login',async (req, res) => {
  const existUser = await User.findOne({id: req.body.id, username: req.body.username});
  if(existUser==null)
  {
    return res.status(401).json('Could not Login');
  }
  else{
    console.log(existUser);
    if(bcrypt.compareSync(req.body.password,existUser.password))
    {
      const user = {name: req.body.username,id:req.body.id};
      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      return res.json({access_token: access_token})
    }
    else{
      return res.json('Passwords are not match')
    }
  }
})

app.post('/register',async (req, res) => {

  let user_salt=bcrypt.genSaltSync(12);
  let hash_pass=bcrypt.hashSync(req.body.password,user_salt);
  const user=new User({
    id:req.body.id,
    username:req.body.username,
    password:hash_pass,
  });
  const newUser = await User.create(user);
  return res.json(`user ${req.body.username} added successfully, please login`)

})

app.get('/budget',authenticateToken,async (req, res) => {
  let resultComputed;
  let q = req.url.split('?'), result = {};
  splitUrl(q,result);
  if(req.user.id!=result.user_id)
  {
    return res.status(401).json('Id doesnt match the user');
  }
  if(result.category)
  {
    resultComputed=await Budget.find({user_id: result.user_id,category:result.category});
  }
  else{
    resultComputed=await Budget.find({user_id: result.user_id});
  }
  return resultComputed[0] === undefined ? res.json('this user does not have budget') : res.json(resultComputed);
})

app.post('/addCost',authenticateToken,async (req, res) => {

  if(req.user.id!=req.body.user_id)
  {
    return res.status(401).json('Id doesnt match the user');
  }
  try{
    const cost = new Budget({
      user_id: req.body.user_id,
      description: req.body.description,
      category: req.body.category,
      sum: req.body.sum
    });
    await Budget.create(cost);
    res.json('Successfully added cost');
  }
  catch (e) {
    res.json(e.message);
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function splitUrl(url,result) {
  if (url.length >= 2) {
    // Split the URL by '&' and add each parameter to the result object
    url[1].split('&').forEach(item => {
      try {
        result[item.split('=')[0]] = item.split('=')[1];
      } catch (e) {
        result[item.split('=')[0]] = '';
      }
    });
  }
}

function authenticateToken(req,res,next) {
  const authHeader=req.headers['authorization'];
  const token=authHeader.split(' ')[1];
  if(token==null)
  {
    //doesnt have token
    return res.sendStatus(401);
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err)
    {
      //token no longer valid
      return res.sendStatus(403);
    }
    //valid token
    req.user=user;
    //move on from the middleware
    next();
  });
}

module.exports = app;
