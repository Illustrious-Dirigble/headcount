// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('headcount.auth', [])

.controller('AuthController', function ($scope, $window, $location, $http, Auth) {

  $scope.user = {};
  $scope.auth = Auth.isAuth();

  $scope.signin = function () {

    console.log('$scope.signin method on AuthController');
    return $http({
      method: 'POST',
      url: '/auth/local',
      data: $scope.user
    })
    .then(function (resp) {
      $window.sessionStorage.setItem('user', resp.config.data.username);
      $window.location.href = "/";
    })
    .catch(function(error) {
      $window.alert("Incorrect login, please try again!")
    });
  };

  $scope.signup = function () {

    console.log('$scope.signup method on AuthController');
    return $http({
      method: 'POST',
      url: '/auth/local-signup',
      data: $scope.user
    })
    .then(function (resp) {
        $window.sessionStorage.setItem('user', resp.config.data.username);
        $window.location.href = "/";
    })
    .catch(function(error) {
      $window.alert("Username already exists, please try again!");
    });
  };

  $scope.signout = function(){

    console.log('$scope.signout method on AuthController');
    Auth.signout();
    $scope.auth = Auth.isAuth();
    return $http({
      method: 'GET',
      url: '/auth/logout'
    })
    .then(function(resp) {
      $window.alert("You've signed out!");
    });
  };

});
