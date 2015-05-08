var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');
var stripe = require('./../utils/stripe.js')
var User = require('./../app/models/user.js')

var CLIENT_ID = 'ca_6BLN2Dqh096NdvoCiYRV9LNmJTuMssEB';
var API_KEY = 'sk_test_OBXX3FRuomYskOfEP62qbgMz';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://api.venmo.com/v1/oauth/authorize';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

router.post('/createevent', function(req, res, next) {
  var username = req.headers['x-access-token'];
  var eventData = req.body

  // var event = new Event({
  //   title: eventData.title,
  //   description: eventData.description,
  //   expiration: eventData.expiration,
  //   thresholdPeople: eventData.thresholdPeople
  // });
 
    //   }
    // })
    // .catch(function(error){
    //   console.log('Error saving Stripe Connect account details on bookshelf model',error);
    // });

});


/**
 * Redirects user to Venmo API endpoint to grant Headcount charge/payment permissions on their account. 
 * Venmo page will redirect user to '/oauth' when done.
 */
router.post('/authorize', function(req, res) {

  var username = req.body.username;

  var clientId = '2612';
  var scopes = 'make_payments%20access_feed%20access_profile%20access_email%20access_phoneaccess_balance%20access_friends';
  var redirect_uri = !process.env.DATABASE_URL ? 'http://localhost:5000/oauth' : 
  'http://headcount26.herokuapp.com/oauth';

  var authorize = 'https://api.venmo.com/v1/oauth/authorize?client_id=' + clientId + '&scope=' + scopes + '&response_type=code' + '&state=' + username + '&redirect_uri=' + redirect_uri;

  res.send(authorize);
});

/**
 * Captures redirect from Venmo account authorization page. 
 * Receives Venmo user ID, username, display name, access token, refresh token, and profile picture url in body of response. 
 * Save info in users's db entry to later pay other users with
 */
router.get('/oauth', function(req, res) {
  var venmoTokenUri = 'https://api.venmo.com/v1/oauth/access_token';
  var clientId = '2612';
  var clientSecret = 'eUv3N6JDsM3YCGkzmF8Lg8kH9WtV6kuf'
  var username = req.query.state;
  var code = req.query.code;

  res.redirect('/#/accounts'); 

    request.post({
        url: venmoTokenUri,
        form: {
          client_id: clientId,
          code: code,
          client_secret: clientSecret
        }
      }, function(err, r, body) {
        
          body = JSON.parse(body)

          new User({username:username})
            .fetch()
            .then(function(user){
              if(!user) {
                console.log('User does not exist');
              } else if (user.attributes.venmoUserId) {
                console.log('User has already authorized their venmo account!');
              } else {
               
                user.save({ 
                  venmoUserId: body.user.id,
                  venmoUsername: body.user.username,
                  venmoDisplayName: body.user.display_name,
                  venmoAccessToken: body.access_token,
                  venmoRefreshToken: body.refresh_token,
                  venmoPicture: body.user.profile_picture_url
                })
                  .then(function() {
                    console.log('Stripe Connect Account saved to user');
                  });
               }
            })
            .catch(function(error){
              console.log('Error saving connect account on user instance',error);
            });
      });
});

module.exports = router;
