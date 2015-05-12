angular.module('headcount.services', [])

.factory('Auth', function ($http, $location, $window) {

  var isAuth = function () {
    return !!$window.sessionStorage.getItem('user');
  };

  var signout = function () {
    $window.sessionStorage.removeItem('user');
    $location.path('/signin');
  };

  return {
    isAuth: isAuth,
    signout: signout
  };
});
