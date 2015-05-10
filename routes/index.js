var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');

var venmo = require('./../utils/payments.js')
var createInvites = require('./../utils/invites.js')
var User = require('./../app/models/user.js')
var Event = require('./../app/models/event.js')


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



// router.get('/events-fetch', function(req, res, next) {
//   var username = req.headers['x-access-token'];
//   var eventData = req.body

// });
// 



router.get('/users-fetch', function(req, res, next) {
  new User()
    .fetchAll()
    .then(function(collection) {
      console.log("COLLECTION" + collection.at(0).attributes.username + " " + collection.at(0).attributes.id);
      var users = [];
      for (var i = 0; i < collection.length; i++) {
        var temp = [];
        temp[0] = collection.at(i).attributes.username;
        temp[1] = collection.at(i).attributes.id;
        users.push(temp);
      }
      console.log(users);
      res.json(users);
    });
});

/**
 *
 * TODO: 
 * 
 * Catches event creation post request from client. 
 * Receives event info and an users who need associated invites.
 * Creates new event and saves it to the database, then creates the required invite for each user and saves it to the database.
 * Logs out the created invites when done. 
 */
router.post('/events-create', function(req, res) {
  var username = req.session.user;
  console.log('User', username);
  var eventData = req.body;
  var inviteNum = eventData.invited.length;
  var inviteeIds = [];

  for (var i = 0; i < inviteNum; i++) {
    inviteeIds.push(eventData.invited[i][0][1]);
  }
  
  new User({username:username})
    .fetch()
    .then(function(user){

      console.log('Db user', user)

      new Event({
        title: eventData.title,
        description: eventData.description,
        expiration: null,
        user_id: user.attributes.id,
        thresholdPeople: eventData.thresholdPeople,
        thresholdMoney: eventData.thresholdMoney
      }).save()
        .then(function(model){

          createInvites(model.id, inviteeIds, function(invites) {
            console.log('Invites created!');
            console.log(invites);

            res.send('Success');
          });
        });
    }) 
    .then(function() {
      console.log('Event and invites saved to db');
    })
   
    .catch(function(error){
      console.log('Error saving connect account on user instance',error);
    });



});

router.post('/events/join', function(req, res, next) {
  new Invite().fetch({
      withRelated: ['event']
    }).then(function(collection) {
      console.log(collection.toJSON());
    });
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
