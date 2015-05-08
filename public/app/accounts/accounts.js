angular.module('shortly.shorten', [])

.controller('AccountsController', function ($scope, $location, $http, Links) {

  // $scope.hasStripeConnectAccount = function() {

  //   var currentUser = sessionStorage.getItem('user');
  //   console.log('user',currentUser);

  // };

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
    });
  };

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
