angular.module('headcount.accounts', [])

.controller('AccountsController', function ($scope, $window, $location, $http) {

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
   * Checks if user has already authorized his/her Venmo account
   */
  $scope.checkVenmoDetails = function(){

    var currentUser = sessionStorage.getItem('user');
    return $http({
      method: 'POST',
      url : '/users/checkUser',
      data : {'username': currentUser}
    })
    .then(function(resp){
      console.log(resp.data);
      var hasVenmoInfo = resp.data.hasVenmoInfo;

      if (!hasVenmoInfo) {
        console.log('You have not authorized your Venmo account yet!');
      }

      $scope.shouldNotBeClickable = !hasVenmoInfo;
    });
  };

  $scope.checkVenmoDetails();

  /**
   * Handles Venmo button submittal.
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

});
