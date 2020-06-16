
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const hbshelpers = require('handlebars-helpers');
const multihelpers = hbshelpers();

var mongoose = require('mongoose');
var passport = require('passport');
var editorServer = require('datatables.net-editor-server');

var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var app = express();

var routes = require('./routes/index');


mongoose.connect('mongodb://localhost:27017/Erecruitment');
require('./config/passport');
require('./models/HRdetails');
require('./models/Post');
require('./models/Notification');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
    next();
});
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// //if condition for view candidate
// expressHbs.registerHelper('if_eq', function(a, b, opts) {
//     if (a == b) {
//         return opts.fn(this);
//     } else {
//         return opts.inverse(this);
//     }
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('user/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('user/error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
