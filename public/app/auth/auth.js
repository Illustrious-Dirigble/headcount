angular.module('headcount.auth', [])

.controller('AuthController', function ($scope, $window, $location, $http, Auth) {

  /**
   * $scope.user holds onto any input on the signin.html and signup.html input
   * fields.
   */

  $scope.user = {};

  /**
   * $scope.signin & $scope.signup both make a POST request to the routes/auth.js file
   * with the attempted login information from $scope.user. On successful authentication,
   * it sets the session item 'user' to the username, so that we can render the content
   * specifically to the user that's currently signed in.
   */

  $scope.signin = function () {

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

  /**
  * $scope.signout calls Auth.signout on the 'Auth' factory, under the services.js
  * file. It destroys the session item 'user', and then resets the view to the sign-in
  * page. It also makes a GET request to routes/auth.js's logout route, which will also
  * destroy the express-session token on the backend, then alerts the user on a
  * successful request.
  */

  $scope.signout = function(){

    Auth.signout();
    return $http({
      method: 'GET',
      url: '/auth/logout'
    })
    .then(function(resp) {
      $window.alert("You've signed out!");
    });
  };

});
