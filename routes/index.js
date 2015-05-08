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

router.post('/stripe/debit-token', function(req, res) {
  
  console.log(req.body.username);
  console.log(req.body.cardToken);
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
