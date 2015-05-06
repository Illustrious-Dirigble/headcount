// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('shortly.auth', [])

.controller('AuthController', function ($scope, $window, $location, $http) {
  $scope.user = {};

  $scope.signin = function () {
    console.log('hit auth service');
    return $http({
      method: 'POST',
      url: '/auth/local',
      data: $scope.user
    })
    .then(function (resp) {
      
    });
    // Auth.signin($scope.user)
    //   .then(function (token) {
    //     $window.localStorage.setItem('com.shortly', token);
    //     $location.path('/links');
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
  };

  $scope.signup = function () {
    return $http({
      method: 'POST',
      url: '/auth/local-signup',
      data: $scope.user
    })
    .then(function (resp) {
      console.log('gets to then of signup in client')
      $location.path('/links');
    });
    // Auth.signup($scope.user)
    //   .then(function (token) {
    //     $window.localStorage.setItem('com.shortly', token);
    //     $location.path('/links');
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
  };
});
