var express = require('express');
var router = express.Router();
var qs = require('querystring');
var request = require('request');
var oauth = require('./../oauth');

var payOutEvent = require('./../utils/payments.js');
var attendance = require('./../utils/invites.js');
var User = require('./../app/models/user.js');
var Event = require('./../app/models/event.js');
var Invite = require('./../app/models/invite.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * Fetches all events from database with query where user_id matches current session user
 */
router.get('/events-fetch', function(req, res, next) {

  new Event()
    .query({ where: {user_id: req.session.user_id} })
    .fetchAll()
    .then(function(collection) {
      if (!collection) {
        console.log("NO EVENTS FOR USER FOUND!!!");
      } else {
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
      for (var i = 0; i < collection.length; i++) {
        invites.push(parseInt(collection.at(i).attributes.event_id));
      }
      res.json(invites);
    });
});

// Callback for responding with invited events to front-end
function returnEvents(req, res, events) {
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
          events.push(model);
          callback(req, res, events);
        } else {
          events.push(model);
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

/**
 * A simple get request for showing all the events in the database for dev purposes
 */
router.get('/events-all', function(req, res, next) {
  new Event({})
  .fetchAll()
  .then(function(collection) {
    res.json(collection);
  });
});

/**
 * Fetches users from the database except current session user, used for inviting people
 */
router.get('/users-fetch', function(req, res, next) {
  new User()
    .fetchAll()
    .then(function(collection) {
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
 * FIXME: uncomment and only use one 'payOutEvent' invocation in route to activate event payouts - first invocation is actual payout, second invocation will payout to Venmo
 * sandbox account - no actual funds are charged.
 *
 * Receives a request whenever a user accepts or declines an event invitation, and updates/saves the corresponding invite in utils/invites.js.
 * If the invite is accepted, it fetches the related event. If increasing the 'committedPeople' count by one will satisfy the 'thresholdPeople' field,
 * it triggers paying the event creator (see utils/payments.js) from the accounts of the users who committed to the event (the 'paid' field and conditional makes sure it hasn't already been paid out).
 *
 */
router.post('/invite-response', function(req, res) {
  var userId = req.session.user_id;
  var eventId = req.body.eventId;
  var inviteAcceptedBool = req.body.accepted;
  console.log('invite status', inviteAcceptedBool);

  attendance.updateInvite(userId, eventId, inviteAcceptedBool, function(updatedInvite) {
    if (inviteAcceptedBool) {

      new Event({ id: eventId }).fetch({
        withRelated: ['invites', 'user']
      }).then(function(event) {

          var thresholdPeople = event.get('thresholdPeople');
          var committedPeople = event.get('committedPeople');
          var totalMoney = event.get('thresholdMoney');
          var title = event.get('title');
          var paid = event.get('paid');
          var receivingUserId = event.get('user_id');
          var inviteModels = event.related('invites').models;
          var eventCreatorsVenmoId = event.related('user').attributes.venmoUserId;

          if (paid) {
            console.log('This event has already been paid out!');
          } else {

            // If true, will trigger event payout!
            if (committedPeople + 1 === thresholdPeople) {
              var payingUserIds = [];
              var amountPerCommittedUser = (totalMoney / thresholdPeople);
              var note = 'Headcount charge for ' + title;

              // Test info
              var testUserId = '145434160922624933';
              var testNote = 'paid with Headcount!';
              var testAmount = '0.10';

              console.log('pay event creator!');
              event.set('paid', true);

              for (var i = 0; i < inviteModels.length; i++) {
                var payingUserId = inviteModels[i].attributes.user_id;

                if (payingUserId) {
                  payingUserIds.push(payingUserId);
                }
              }

              // FIXME: If uncommented, will active actual Venmo payout upon event's 'committedPeople' equaling 'thresholdPeople'.
              //  -- note: must only invoke 'payOutEvent' once.
              //
              // payOutEvent(payingUserIds, eventCreatorsVenmoId, note, amountPerCommittedUser, false, function(payments) {
              //   console.log('Event creator paid!')
              //   console.log('Payments:', payments);
              // });

              // FIXME: If uncommented, will attempt to pay Venmo development sandbox account - no funds will actually be charged.
              // -- note: must only invoke 'payOutEvent' once.
              //
              // payOutEvent(payingUserIds, testUserId, testNote, testAmount, true, function(payments) {
              //   console.log('Test bot creator paid!');
              //   console.log('Payments:', payments);
              // });

            } else {
              console.log('increasing num of committed people');
              event.set('committedPeople', committedPeople + 1);
            }
          }

        event.save().then(function(updatedEvent) {
          console.log('Event updated!');
          console.log(updatedEvent);
          eventInfo = updatedEvent.attributes;
          res.json({eventInfo: eventInfo});

        });
      });

    } else {
      console.log('Invite declined, do not need to check event');
    }


  });

});

/**
 * Catches event creation post request from client.
 * Receives event info and an users who need associated invites.
 * Creates new event and saves it to the database, then creates the required invite for each user and saves it to the database.
 * Logs out the created invites when done.
 */
router.post('/events-create', function(req, res) {
  console.log('incoming event', req.body);
  var eventData = req.body;
  var inviteNum = eventData.invited.length;
  var inviteeIds = [];
  console.log("EVENT DATA!!!" + JSON.stringify(eventData.invited));



  for (var i = 0; i < inviteNum; i++) {
    inviteeIds.push(eventData.invited[i]);
  }

  new Event({
    title: eventData.title,
    description: eventData.description,
    expiration: eventData.expiration,
    thresholdPeople: eventData.thresholdPeople,
    thresholdMoney: eventData.thresholdMoney,
    committedPeople: 0,
    committedMoney: 0,
    paid: false,
    user_id: req.session.user_id,
    image: eventData.image
  }).save()
    .then(function(model){

      attendance.createInvites(model.id, inviteeIds, function(invites) {
        console.log('Invites created!');
        res.end();
      });
    });
});

/**
 * Redirects user to Venmo API endpoint to grant Headcount charge/payment permissions on their account.
 * Venmo page will redirect user to '/oauth' when done.
 */
router.post('/authorize', function(req, res) {

  var username = req.body.username;
  var clientId = process.env.venmoClientID;
  var scopes = 'make_payments%20access_feed%20access_profile%20access_email%20access_phoneaccess_balance%20access_friends';

  var redirect_uri = !process.env.DATABASE_URL ? 'http://localhost:5000/oauth' :
  //'http://headcount26.herokuapp.com/oauth';
  'http://www.theheadcount.com/oauth';

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
  var clientId = process.env.venmoClientID;
  var clientSecret = process.env.venmoClientSecret
  var username = req.query.state;
  var code = req.query.code;



    request.post({
        url: venmoTokenUri,
        form: {
          client_id: clientId,
          code: code,
          client_secret: clientSecret
        }
      }, function(err, r, body) {

          body = JSON.parse(body);

          //not DRY, this was used somewhere else.  Make a function for this
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
                    console.log('Venmo account authorized');
                    res.redirect('/#/accounts');
                  });
               }
            })
            .catch(function(error){
              console.log('Error saving connect account on user instance',error);
            });
      });
});

module.exports = router;
