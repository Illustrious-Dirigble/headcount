var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var routes       = require('./../routes/index');
var users        = require('./../routes/users');
var User        = require('../app/models/user');
var auth         = require('./../routes/auth');
var oauth        = require('./../oauth.js');
var passport     = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
//var routes       = require('./routes/index');
//var users        = require('./routes/users');

var app = express();


app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../public')));

// routing
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
var userRouter = express.Router();
// var userRoutes   = require('./users/userRoutes');
//app.use('/', routes);
//app.use('/users', users);
// app.use('/api/users/', userRouter);
// userRoutes(userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Passport authentication

// Passport will serialize and deserialize user instances to and from the session.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Facebook Passport OAuth
passport.use(new FacebookStrategy({
  clientID: oauth.ids.facebook.clientID,
  clientSecret: oauth.ids.facebook.clientSecret,
  callbackURL: oauth.ids.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

// Google Passport OAuth
passport.use(new GoogleStrategy({
  clientID: oauth.ids.google.clientID,
  clientSecret: oauth.ids.google.clientSecret,
  callbackURL: oauth.ids.google.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

// local Auth

passport.use('local',new LocalStrategy({
  // by default, it uses username and password
  // usernameField : 'email',
  // passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
  function(req, username, password, done) {
    console.log('passport local triggered',username);
    console.log(new User({username:username}));
    new User({ username: username })
      .fetch()
      .then(function(user) {
      console.log('user',user);
      if (!user) {
        console.log('incorrect username');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.comparePassword(password,function(x){
        // callback. x is the value of isMatch
        console.log('isMatch',x);
        if (x === true){
          // correct password
          console.log('DONE result looks like',done(null,user));
          return done(null, user);
        } else {
          // wrong password
          console.log('incorrect [password]');
          return done(null, false, { message: 'Incorrect password.' });
        }
      })){
        console.log("TRUUUUUE");
      }
      // if (err) { return done(err); }
    })
  }));

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Error:',err.message);
    res.end(err.message);
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.end(err.message);
});

module.exports = app;
