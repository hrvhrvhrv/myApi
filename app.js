var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose'); //  mongoose library has been included
var passport = require('passport'); //  mongoose passport has been included
var config = require('./config/database'); //  config file is set

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');  //  api route added



//  try catch statement to check if the database connection is working otherwise log the error
try{
  mongoose.connect(config.database);
}
catch (err){
  console.log(err.message);
};


var app = express();

app.use(function (req,res,next) {
   res.header("Access-Control-Allow-Origin","*"); //  * means that access is allowed from all areas, can be restricted to specific URL
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type-Accept");
});
app.use(passport.initialize()); //  telling app to use passport


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
// app.use('/users', users);
app.use('/api',api);
app.get('/', function (req,res) {
    res.send('<h1>Site under construction</h1>')
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
