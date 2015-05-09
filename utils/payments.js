var qs = require('querystring');
var request = require('request');

var venmoEndpoint = 'https://api.venmo.com/v1/payments'

/**
 * Takes access token of of user who created event, user id of paying user, note (required, but can be any string), and amount (in dollars --> 1.50).
 * Returns payment information.
 */
var payEventCreator = function(payingAccessToken, receivingUserId, note, amount) {

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
      console.log(body);
    }
  })

}


