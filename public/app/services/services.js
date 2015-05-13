angular.module('headcount.services', [])

.factory('Auth', function ($http, $location, $window) {

  //Signin/Signup not being used.  We can move code from routes/auth.js to use these later
  var signin = function (user) {
    console.log('hit auth service');
    return $http({
      method: 'POST',
      url: '/auth/local',
      data: user
    })
    .then(function (resp) {
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.sessionStorage.getItem('user') || !!$window.sessionStorage.getItem('FBid');
  };

  var signout = function () {
    $window.sessionStorage.removeItem('user');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
