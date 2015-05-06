// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('shortly.auth', [])

.controller('AuthController', function ($scope, $window, $location, $http) {
  $scope.user = {};

  $scope.signin = function () {
    console.log('auth.js $scope signin');
    return $http({
      method: 'POST',
      url: '/auth/local',
      data: $scope.user
    })
    .then(function () {
      $location.path('#/links');
    });
  };

  $scope.signup = function () {
    console.log('auth.js $scope signup');
    return $http({
      method: 'POST',
      url: '/auth/local-signup',
      data: $scope.user
    })
    .then(function () {
      console.log('gets to then of signup in client');
      $location.path('#/links');
    });
  };
});
