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
      console.log('Successfully signed in, your token is... ',resp.config.data.username);
      $window.sessionStorage.setItem('user', resp.config.data.username);
      $window.location.href = "/";
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
      
      console.log('Successfully signed up, your token is... ',resp.config.data.username);
      $window.sessionStorage.setItem('user', resp.config.data.username);
      $window.location.href = "/";
    });
  };

  $scope.signout = function(){

    console.log('$scope.signout method on AuthController');
    Auth.signout();
    $scope.auth = Auth.isAuth();
    return $http({
      method: 'GET',
      url: '/auth/logout'
    });
  };

});
