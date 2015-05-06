// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('shortly.auth', [])

.controller('AuthController', function ($scope, $window, $location, $http, Auth) {
  $scope.user = {};
  $scope.auth = Auth.isAuth();
  $scope.signin = function () {
    console.log('hit auth controller');
    return $http({
      method: 'POST',
      url: '/auth/local',
      data: $scope.user
    })
    .then(function (resp) {
      console.log('resp',resp.config.data.username);
      $window.sessionStorage.setItem('user', resp.config.data.username);
      $window.location.href = "/";
    });
  };

  $scope.signup = function () {
    return $http({
      method: 'POST',
      url: '/auth/local-signup',
      data: $scope.user
    })
    .then(function (resp) {
      console.log('gets to then of signup in client');
      $location.path('/events');
    });
  };

  $scope.signout = function(){
    Auth.signout();
    $scope.auth = Auth.isAuth();
  };
});
