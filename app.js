var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const UserModel = require('./routes/users');

var app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/pinterest")
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("MongoDB Connection Warning:", err.message));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash setup
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "pinterest_secret_key_12345",
}));

app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Global locals for views
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

