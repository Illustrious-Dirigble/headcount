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
 
    //   }
    // })
    // .catch(function(error){
    //   console.log('Error saving Stripe Connect account details on bookshelf model',error);
    // });

});

/**
 * Receives token from client-side that was created by sending card details to Stripe API. 
 * Turns card into Stripe customer object associated with platform account, then saves Stripe customer ID to user who submitted card.
 * Currently only allows for one card to be stored per user.
 */
router.post('/stripe/debit-token', function(req, res) {
  var username = req.body.username;
  var cardToken = req.body.cardToken;
  var response;

    new User({username:username})
      .fetch()
      .then(function(user){
        if(!user) {
          response = 'User does not exist';
          console.log(response);
          res.send(response);
        } else if (user.attributes.stripeCustomerId) {
          response = 'User already has a customer ID!';
          console.log(response);
          res.send(response);
        } else {
         
          stripe.createPlatformCustomer(cardToken, function(customer) {
            user.save({ stripeCustomerId: customer.id })
              .then(function() {
                response = 'Stripe customer ID saved to user';
                console.log(response);
                res.send(response);
              });
           });
        }
      })
      .catch(function(error){
        console.log('Error saving customer ID on user instance',error);
      });
});

/**
 * Redirects user to Stripe API endpoint to signup for Stripe Connect account and grant Headcount charge/payment permissions. 
 * Stripe page will redirect user to '/oauth/callback' when done.
 */
router.post('/authorize', function(req, res) {


  var redirect_uri = !process.env.DATABASE_URL ? 'http://localhost:5000/oauth/callback' : 
  'http://headcount26.herokuapp.com/oauth/callback';

  var redirect = AUTHORIZE_URI + '?' + qs.stringify({
    response_type: 'code',
    scope: 'read_write',
    client_id: CLIENT_ID,
    redirect_uri: redirect_uri
  });

  res.send(redirect);
});

/**
 * TODO: track user who is originally redireced to Stripe Connect account signup page!!
 * 
 * Captures redirect from Stripe Connect signup page. 
 * Receives Stripe user ID, access token, refresh token and publishable key in body of response. 
 * Save Stripe Connect account info to user to later receive payments from other users.
 */
router.get('/oauth/callback', function(req, res) {
  
  // FIX: track user!!
  var username = '?????????'
  var code = req.query.code;
 
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
    } else {

      new User({username:username})
        .fetch()
        .then(function(user){
          if(!user) {
            console.log('User does not exist');
          } else if (user.attributes.stripeUserId) {
            console.log('User already has a customer ID!');
          } else {
           
            user.save({ 
              stripeUserId: body.stripe_user_id,
              stripeAccessToken: body.access_token,
              stripeRefreshToken: body.refresh_token,
              stripePublishKey: body.stripe_publishable_key
            })
              .then(function() {
                console.log('Stripe Connect Account saved to user');
              });
           }
        })
        .catch(function(error){
          console.log('Error saving connect account on user instance',error);
        });
    }

    console.log(JSON.parse(body));
    res.redirect('/#/accounts'); 
  });
});


module.exports = router;
