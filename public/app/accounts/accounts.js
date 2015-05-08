angular.module('shortly.shorten', [])

.controller('AccountsController', function ($scope, $location, Links) {
  // Your code here

  $scope.hasStripeConnectAccount = function() {

    var currentUser = sessionStorage.getItem('user');
    console.log('user',currentUser);

  };

  $scope.stripeCallback = function (code, result) {
      if (result.error) {
          console.log('it failed! error: ' + result.error.message);
      } else {
          console.log('success!');
          console.dir(result);
      }
  };
});
