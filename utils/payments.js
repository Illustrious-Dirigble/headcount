var qs = require('querystring');
var request = require('request');
var User = require('./../app/models/user.js');

// var venmoEndpoint = 'https://api.venmo.com/v1/payments'
var venmoEndpoint = 'https://sandbox-api.venmo.com/v1/payments';

/**
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
      console.log('Error:', error)
    } else {
      callback(body);
    }
  })

};

var payOutEvent = function(payingUserIds, receivingUserVenmoId, note, amount, callback) {
  var payments = [];
  var failsafeCounter = 0;

  var inner = function() {

    if (payingUserIds[0] && failsafeCounter < payingUserIds.length) {
      new User({
        id: payingUserIds.shift()
      }).fetch().then(function(user) {

        var accessToken = user.get('venmoAccessToken');
        payEventCreator(accessToken, receivingUserVenmoId, note, amount, function(payment) {
          payments.push(payment);
          failsafeCounter++;
          inner();
        })
      })
    } else {
      callback(payments);
    }

  }

  inner();

};

module.exports = payOutEvent;
