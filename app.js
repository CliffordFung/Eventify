//npm i --save sequelize passport passport-local mysql2 mysql express express-session body-parser bcrypt-nodejs
// to install all the required npm packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
var bodyParser = require('body-parser');
const config = require('./config/config');
const passport = require('passport');
var flash = require('connect-flash')
var session = require('express-session')


// Eventify routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var eventRouter = require('./routes/events');
var resourceRouter = require('./routes/resources');
var categoryRouter = require('./routes/categories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

require('./config/passport')(passport);

app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));
//Connect-flash middleware
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
  //Passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/events', eventRouter);
app.use('/resources', resourceRouter);
app.use('/categories', categoryRouter);


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

module.exports = app;