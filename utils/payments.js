var qs = require('querystring');
var request = require('request');

var venmoEndpoint = 'https://api.venmo.com/v1/payments'

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

var payOutEvent = function(payingUserIds, receivingUserVenmoId, callback) {
  var payments = [];

  var inner = function() {

    if (payingUserIds[0]) {
      new User({
        id: payingUserIds[0]
      }).fetch().then(function(user) {

        var accessToken = user.get('venmoAccessToken');
        payEventCreator(accessToken, receivingUserVenmoId, function(payment) {
          payments.push(payment);
          inner();
        })
      })
    } else {
      callback(payments);
    }

  }

  inner();

};


