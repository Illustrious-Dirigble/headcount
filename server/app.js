// Dependencies
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var session      = require('express-session');
var amazon       = require('./../utils/amazon_api.js')

// Routes
var routes       = require('./../routes/index');
var users        = require('./../routes/users');
var User        = require('../app/models/user');
var auth         = require('./../routes/auth');

// Authentication
var oauth        = require('./../oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Initiate passport and passport session
app.use(passport.initialize());
app.use(passport.session());

// Express-session settings
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// Routing
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.post('/search', function(req, res) {
  amazon.search(req, res);
})

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Passport will serialize and deserialize user instances to and from the session.
// Not using these right now, maybe later?
passport.serializeUser(function(user, done) {
  console.log('Serializing User!!!' + user);
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  console.log('Deserializing User!!!' + user);
  done(null, obj);
});

// Facebook Passport OAuth
passport.use(new FacebookStrategy({
  clientID: process.env.fbClientID,
  clientSecret: process.env.fbClientSecret,
  callbackURL: process.env.fbCallbackURL
},
function(accessToken, refreshToken, profile, done) {
  new User({ facebookId: profile.id })
  .fetch()
  .then(function(model){
    if(model){
      model.set('facebookToken', accessToken);
      model.save();
      return done(null, model);
    } else {
      var user = new User({ facebookId: profile.id, facebookToken: accessToken });
      user.save();
      return done(null, user);
    }
  });
}));

// Google Passport OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  callbackURL: process.env.googleCallbackURL
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));

// Local Auth
passport.use('local',new LocalStrategy(
  function(username, password, done) {
    new User({ username: username })
      .fetch()
      .then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.comparePassword(password,function(x){
        if (x === true){
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      })){
      }
    });
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

