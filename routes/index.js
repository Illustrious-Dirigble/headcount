var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');

var venmo = require('./../utils/payments.js');
var createInvites = require('./../utils/invites.js');
var User = require('./../app/models/user.js');
var Event = require('./../app/models/event.js');
var Invite = require('./../app/models/invite.js');

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

// Fetches all events from database with query where user_id matches current session user

router.get('/events-fetch', function(req, res, next) {
  
  new Event()
    .query({ where: {user_id: req.session.user_id} })
    .fetchAll()
    .then(function(collection) {
      if (!collection) {
        console.log("NO EVENTS FOR USER FOUND!!!");
      } else {
        console.log("EVENTS BELONGING TO USER" + JSON.stringify(collection));
        res.json(collection);
      }
    });
});

// Fetches invite ID based on session user_id

router.get('/invite-events-fetch', function(req, res, next) {
    
  var invites = [];
    
  new Invite()
    .query({ where: {user_id: req.session.user_id} })
    .fetchAll()
    .then(function(collection) {
      console.log("INVITE EVENTS BELONGING TO USER" + JSON.stringify(collection));
      for (var i = 0; i < collection.length; i++) {
        invites.push(parseInt(collection.at(i).attributes.event_id));
      }
      res.json(invites);
    });
});

// Callback for responding with invited events to front-end

function returnEvents(req, res, events) {
  console.log("RETURNING THIS " + events);
  res.json(events);
}

// Fetches events based on invite IDs

router.post('/invite-events-fetch', function(req, res, next) {

  var ids = req.body.ids;
  var events = [];
  
  function anon(ids, callback) {
    new Event({id: ids})
      .fetch()
      .then(function(model) {
        if (callback !== undefined) {
          model.attributes.invite_id = ids;
          console.log("MODEL W/ INVITE_ID FOR CALLBACK!!!" + JSON.stringify(model));
          events.push(model);
          callback(req, res, events);
        } else {
          model.attributes.invite_id = ids;
          console.log("MODEL W/ INVITE_ID!!!" + JSON.stringify(model));
          events.push(model);
          console.log("NO CALLBACK, PUSH TO EVENTS ARRAY" + events);
        }
      });
  }
  
  for (var i = 0; i < ids.length; i++) {
    if (i === ids.length - 1) {
      anon(ids[i], returnEvents);
    } else {
      anon(ids[i]);
    }
  }
});

// A simple get request for showing all the events in the database for dev purposes

router.get('/events-all', function(req, res, next) {
  new Event({})
  .fetchAll()
  .then(function(collection) { 
    res.json(collection);
  });
});

// Fetches users from the database except current session user, used for inviting people

router.get('/users-fetch', function(req, res, next) {
  new User()
    .fetchAll()
    .then(function(collection) {
      console.log("COLLECTION" + collection.at(0).attributes.username + " " + collection.at(0).attributes.id);
      var users = [];
      for (var i = 0; i < collection.length; i++) {
        if (collection.at(i).attributes.username === req.session.user) {
          continue;
        }
        var temp = [];
        temp[0] = collection.at(i).attributes.username;
        temp[1] = collection.at(i).attributes.id;
        users.push(temp);
      }
      res.json(users);
    });
});

/**
 * TODO: redirect used to created event page!!
 * 
 * Catches event creation post request from client. 
 * Receives event info and an users who need associated invites.
 * Creates new event and saves it to the database, then creates the required invite for each user and saves it to the database.
 * Logs out the created invites when done. 
 */
router.post('/events-create', function(req, res) {

  var eventData = req.body;
  var inviteNum = eventData.invited.length;
  var inviteeIds = [];
  console.log("EVENT DATA!!!" + JSON.stringify(eventData.invited));

  for (var i = 0; i < inviteNum; i++) {
    inviteeIds.push(eventData.invited[i][1]);
    console.log(eventData.invited[i][1]);
  }

  new Event({
    title: eventData.title,
    description: eventData.description,
    expiration: eventData.expiration,
    thresholdPeople: eventData.thresholdPeople,
    thresholdMoney: eventData.thresholdMoney,
    user_id: req.session.user_id,
    image: eventData.image
  }).save()
    .then(function(model){

      createInvites(model.id, inviteeIds, function(invites) {
        console.log('Invites created!');
        console.log(invites);
      });
      res.end();
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
