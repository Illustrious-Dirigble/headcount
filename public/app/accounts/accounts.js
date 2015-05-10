angular.module('headcount.accounts', [])

.controller('AccountsController', function ($scope, $window, $location, $http, Links) {

  $scope.initialize = function() {
    var currentUser = sessionStorage.getItem('user');
    console.log(currentUser);
    return $http({
      method: 'POST',
      url: 'users/accountinfo',
      data: {
        username: currentUser,
      }
    })
    .then(function (resp) {
      user = resp.data;
      $scope.username = user.username || '';
      $scope.firstname = user.firstName || '';
      $scope.lastname = user.lastName || '';
      $scope.email = user.email || '';
      
      //$window.location.href = resp.data;
     
    });
  };
  $scope.initialize();
    
  $scope.accountUpdate = function() {
    console.log('updating account');
    var currentUser = sessionStorage.getItem('user');
    var data = {};
    data.username = $scope.username; 
    data.firstName = $scope.firstname;
    data.lastName = $scope.lastname;
    data.email = $scope.email;
    return $http({
      method: 'POST',
      url: 'users/accountupdate',
      data: data
    })
    .then(function (resp) {
      console.log('account updated');
    });
  };


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
  // No longer using
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
