var qs = require('querystring');
var request = require('request');
var User = require('./../app/models/user.js');

var venmoEndpoint;

/**
 * Subordinate function- only used in 'payOutEvent'.
 * Takes access token of of user who created event, user id of paying user, note (required, but can be any string), and amount (in dollars --> 1.50).
 * Returns payment information.
 */
var payEventCreator = function(payingAccessToken, receivingUserId, note, amount, callback) {

  var payAuthorizedUserUrl = venmoEndpoint + '?' + qs.stringify({
    access_token: payingAccessToken,
    user_id: receivingUserId,
    note: note,
    amount: amount
  });

  request.post(payAuthorizedUserUrl, function (error, response, body) {
    if (error) {
      callback(error);
    } else {
      callback(body);
    }
  })

};

/**
 * Takens array of user IDs of paying users, the event creator's Venmo Id, auto-generated note, the amount each user is paying, boolean for testing purposes, and callback.
 * If isTestBool is true, changes venmo endpoint sandbox url. Only works if correct payOutEvent function is uncommented in routes/index.js (the second one).
 * Uses failsafeCounter to try to eliminate unwanted payments. User should not be able to commit to an event client-side without authorizing their Venmo account, but the 
 * 'accessToken' conditional should prevent failed calls to Venmo API regardless. Calls calback on record of payments.
 */
var payOutEvent = function(payingUserIds, receivingUserVenmoId, note, amount, isTestBool, callback) {
  if (isTestBool) {
    console.log('Test payout!');
    venmoEndpoint = 'https://sandbox-api.venmo.com/v1/payments';
  } else {
    venmoEndpoint = 'https://api.venmo.com/v1/payments';
    console.log('Real payout!');
  }

  var payments = [];
  var failsafeCounter = 0;

  var inner = function() {

    if (payingUserIds[0] && failsafeCounter < payingUserIds.length) {
      new User({
        id: payingUserIds.shift()
      }).fetch().then(function(user) {

        var accessToken = user.get('venmoAccessToken');
        if (accessToken) {
          payEventCreator(accessToken, receivingUserVenmoId, note, amount, function(payment) {
            payments.push(payment);
            failsafeCounter++;
            inner();
          });
        } else {
          failsafeCounter++;
          inner();
        }
      })
    } else {
      callback(payments);
    }

  }

  inner();

};

module.exports = payOutEvent;
