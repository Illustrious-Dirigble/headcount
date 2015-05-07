var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');

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



module.exports = router;
