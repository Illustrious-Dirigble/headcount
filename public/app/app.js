angular.module('headcount', [
  'headcount.services',
  'headcount.events',
  'headcount.accounts',
  'headcount.auth',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/event', {
      templateUrl: 'app/events/event.html',
      controller: 'EventsController',
      authenticate: true,
    })
    .when('/events', {
      templateUrl: 'app/events/eventslist.html',
      controller: 'EventsController',
      authenticate: true,
    })
    .when('/newevent', {
      templateUrl: 'app/events/newevent.html',
      controller: 'EventsController',
      authenticate: true,
    })
    .when('/accounts', {
      templateUrl: 'app/accounts/accounts.html',
      controller: 'AccountsController',
      authenticate: true,
    })
    .when('/search', {
      templateUrl: 'app/events/search.html',
      controller: 'SearchController',
      authenticate: false,
    })
    .otherwise({
      redirectTo: '/events'
    });


    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.controller('DemoCtrl', function($scope) {

})
.factory('EventsFactory', function ($rootScope) {
  var eventServices = {};

  eventServices.shouldNotBeCreatable = false;
  eventServices.shouldNotBeClickable = false;

  eventServices.currentEvent = {};
  return eventServices;
})
.factory('AttachTokens', function ($window, $location) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  // TODO: Make this more secure, use passport or bcrypt.
  var attach = {
    request: function (object) {
      var username = $window.sessionStorage.getItem('user');
      if (username) {
        object.headers['x-access-token'] = username;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
