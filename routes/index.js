var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');
var stripe = require('./../utils/stripe.js')
var User = require('./../app/models/user.js')

var CLIENT_ID = 'ca_6BLN2Dqh096NdvoCiYRV9LNmJTuMssEB';
var API_KEY = 'sk_test_OBXX3FRuomYskOfEP62qbgMz';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

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
    //     user.set('stripeUserId', info.stripe_user_id);
    //     user.set('stripeAccessToken', info.access_token);
    //     user.set('stripeRefreshToken', info.refresh_token);
    //     user.set('stripePublishKey', info.stripe_publishable_key);
    //     console.log('Saved stripe Connect Account to ', username);
    //   }
    // })
    // .catch(function(error){
    //   console.log('Error saving Stripe Connect account details on bookshelf model',error);
    // });

});

/**
 * Receives token from client-side that was created by sending card details to Stripe API. Turns card into Stripe customer object associated with platform account, then saves Stripe customer ID to user who submitted card.
 * Currently only allows for one card to be stored per user.
 */
router.post('/stripe/debit-token', function(req, res) {
  var username = req.body.username;
  var cardToken = req.body.cardToken;

  stripe.createPlatformCustomer(cardToken, function(customer) {
      
    console.log(customer);
    new User({username:username})
      .fetch()
      .then(function(user){
        if(!user) {
          console.log('User does not exist');
        } else if (user.attributes.stripeCustomerId) {
          console.log('User already has a customer ID!');
        } else {
          user.save({ stripeCustomerId: customer.id })
            .then(function() {
              console.log('Stripe customer ID saved to user');
            });
        }
      })
      .catch(function(error){
        console.log('Error saving customer ID on bookshelf model',error);
      });
  })
});

router.get('/authorize', function(req, res) {
  // Redirect to Stripe /oauth/authorize endpoint
  res.redirect(AUTHORIZE_URI + '?' + qs.stringify({
    response_type: 'code',
    scope: 'read_write',
    client_id: CLIENT_ID
  }));
});

router.get('/oauth/callback', function(req, res) {
  console.log('redirected successfully!');
  console.log(req.query);
  var code = req.query.code;
 
  // Make /oauth/token endpoint POST request
  request.post({
    url: TOKEN_URI,
    form: {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code: code,
      client_secret: API_KEY
    }
  }, function(err, r, body) {
    if (err) {
      console.log(err);
    }

    console.log(JSON.parse(body));
    res.redirect('/'); 
  });
});


module.exports = router;
