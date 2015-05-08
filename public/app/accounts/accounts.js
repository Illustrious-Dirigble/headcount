angular.module('shortly.shorten', [])

.controller('AccountsController', function ($scope, $window, $location, $http, Links) {

  /**
   * Handles Stripe 'Connect' button submit. 
   * Gets Connect account creation redirect url from server and manually sets href.
   */
  $scope.authorize = function() {
    var currentUser = sessionStorage.getItem('user');

    return $http({
      method: 'POST',
      url: '/authorize',
      data: {
        username: currentUser,
      }
    })
    .then(function (resp) {
      console.log(resp);
      $window.location.href = resp.data;
    });
  };

  /**
   * On form submit, card info is sent to Stripe for processing. 
   * Stripe returns a one time use token to stripeCallback, which passes it to server for customerId creation and saving.
   */
  $scope.stripeCallback = function (code, result) {
    var currentUser = sessionStorage.getItem('user');

    if (result.error) {
        console.log('it failed! error: ' + result.error.message);
    } else {

      return $http({
        method: 'POST',
        url: '/stripe/debit-token',
        data: {
          username: currentUser,
          cardToken: result.id
        }
      })
      .then(function (resp) {
        console.log(resp);
      });
       
    }
  };
});
