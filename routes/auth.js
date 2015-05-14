var express = require('express');
var router = express.Router();
var User  = require('./../app/models/user');
var oauth = require('./../oauth');
var passport = require('passport');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
/**
 * handleAuth creates a session object, which we then store the username as a user
 * property under the req.session object
 */
function handleAuth(req, res, username, id) {
  req.session.regenerate(function() {
    req.session.user = username;
    req.session.user_id = id.toString();
    console.log("SESSION!!! " + req.session.user + "ID!!! " + req.session.user_id);
    res.end();
  });
};

function handleFBAuth(req, res, token, username, id) {
  req.session.regenerate(function() {
    req.session.user = username;
    req.session.user_id = id.toString();
    console.log("SESSION!!! " + req.session.user + "ID!!! " + req.session.user_id);
    res.send({ token: token, user: username });
    res.end();
  });
};

function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, oauth.ids.local.secret);
};

router.post('/facebook', function(req, res){
  console.log("got a facebook post request!");
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: oauth.ids.facebook.clientSecret,
    redirect_uri: req.body.redirectUri
  };
  console.log("requesting token...");
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
    console.log("requesting user data...");
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.headers.authorization) {
        new User({ facebookId: profile.id }).fetch()
        .then(function(model){
          if(!model){
            var user = new User({
              username: profile.name,
              email: profile.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              facebookId: profile.id,
              facebookToken: accessToken
            });
            user.save().then(function() {
              var token = createJWT(user);
              console.log("auth exists, user created. responding...");
              handleFBAuth(req, res, token, user.username, user.id);
            });
          }
        });
      } else {
        new User({ facebookId: profile.id }).fetch()
        .then(function(model){
          if(model) {
            var token = createJWT(model);
            console.log("Not authorized, but model exists. responding...");
            return handleFBAuth(req, res, token, model.attributes.username, model.attributes.id);
          }
          var user = new User({
            username: profile.name,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            facebookId: profile.id,
            facebookToken: accessToken
          });
          user.save().then(function() {
            var token = createJWT(user);
            console.log("Not authorized, user created. responding...");
            handleFBAuth(req, res, token, model.attributes.username, model.attributes.id);
          });
        });
      }
    });
  });
});

// Google OAuth Initiation
router.get('/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }), function(req, res){
});

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '#/signup' }), function(req, res) {
 res.redirect('#/signin');
});

// Local Auth Sign-in
router.post('/local', passport.authenticate('local', { failureRedirect: '#/signup' }), function(req, res) {
  var username = req.body.username;

  new User({username: username})
  .fetch()
  .then(function(model) {
    handleAuth(req, res, username, model.attributes.id);
  });
});

// Local Auth Sign-up
// TODO: move code to factories during code cleanup
router.post('/local-signup', function(req, res, next) {

  var username  = req.body.username;
  var password  = req.body.password;

  new User({username:username})
    .fetch()
    .then(function(model){
      if (model) {
        return next(null);
      } else {
        new User({username:username,password:password},{isNew:true}).save()
	        .then(function(model){
	          handleAuth(req, res, username, model.attributes.id);
	        });
        }
    });
});

/**
 * Logout... console logs are for checking the req.session object before and after it's
 * destroyed to ensure it's working.
 */

router.get('/logout', function(req, res, next) {
  console.log("Before destroy session... " + JSON.stringify(req.session));
  req.session.destroy(function() {
    console.log("Destroying express-session object for this session... " + req.session);
    res.redirect('..#/signin');
  });

});

module.exports = router;
