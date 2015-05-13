angular.module('headcount.auth', ['satellizer'])

.config(function($authProvider){
  $authProvider.facebook({
    clientId: '654569731343865'
  });
})

.controller('AuthController', function ($scope, $window, $location, $http, Auth, $auth) {

  $scope.user = {};
  $scope.auth = Auth.isAuth();

  $scope.OAuthLogin = function (provider) {
    $auth.authenticate(provider).then(function(res){
      $window.localStorage.currentUser = JSON.stringify(res.data.user);
      $location.path('/');
    });
  };

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
      $window.alert("Incorrect login, please try again!");
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
    $auth.logout();
    $scope.auth = Auth.isAuth();
    return $http({
      method: 'GET',
      url: '/auth/logout'
    })
    .then(function(resp) {
      $window.alert("You've signed out!");
    });
  };

  $scope.isAuth = function () {
    return !!$window.sessionStorage.getItem('user') || $auth.isAuthenticated();
  };

});
