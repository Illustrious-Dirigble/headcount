angular.module('shortly.shorten', [])

.controller('AccountsController', function ($scope, $location, $http, Links) {
  // Your code here

  $scope.hasStripeConnectAccount = function() {

    var currentUser = sessionStorage.getItem('user');
    console.log('user',currentUser);

  };

  $scope.stripeCallback = function (code, result) {
      var currentUser = sessionStorage.getItem('user');

      if (result.error) {
          console.log('it failed! error: ' + result.error.message);
      } else {
        
        console.log('success!');
        console.dir(result);

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
