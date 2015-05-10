angular.module('headcount.events', [])

.controller('EventsController', function ($scope, Links, $http, $window) {

  // Stores all events that were created by you or that you were invited to
  $scope.events = [];

  /* userList currently populates with all users of Headcount. invitedUsers
   * gets pushed with any users you invite.
   */

  $scope.userList = [];
  $scope.invitedUsers = [];

  $scope.hasStripe = false;
  $scope.needInfo = false;
  $scope.clickedEvent = {};
  $scope.display = false;

  // Event object that's populated via creation form and then posted for creation

  $scope.newEvent = {
    title: 'Title goes here', 
    description: 'Description goes here', 
    expiration: 5, 
    thresholdPeople: 10,
    thresholdMoney: 100
  };


  /* addInvite pushes a user to the invitedUsers array, then removes one from userList
   * and vice versa for removeInvite.
   */

  $scope.addInvite = function(user) {
    var index = $scope.userList.indexOf(user);
    $scope.invitedUsers.push($scope.userList.splice(index, 1)[0]);
  };

  $scope.removeInvite = function(user) {
    var index = $scope.invitedUsers.indexOf(user);
    $scope.userList.push($scope.invitedUsers.splice(index, 1)[0]);
  };

  // Fetch events that were created by you.

  $scope.fetchEvents = function () {
    return $http({
      method: 'GET', 
      url: '/events-fetch'
    })
    .then(function(resp) {
      if (resp.data.length >= 1) {
        $scope.events = resp.data;
      } else {
        console.log("THERE ARE NO EVENTS TO FETCH!!!");
      }
    });
  };

  /* Fetches invited events. We're using two methods, one to fetch invite IDs, which are
   * then fed to another method which actually fetches the events.
   */


  $scope.fetchInviteIDs = function () {
    return $http({
      method: 'GET', 
      url: '/invite-events-fetch'
    })
    .then(function(resp) {
      console.log("RESP DATA!!!" + resp.data);
      $scope.fetchInviteEvents(resp.data);
    });
  };

  $scope.fetchInviteEvents = function (ids) {
    return $http({
      method: 'POST', 
      url: '/invite-events-fetch',
      data: {ids: ids}
    })
    .then(function(resp) {
        for (var i = 0; i < resp.data.length; i++) {
          $scope.events.push(resp.data[i]);
        }
    });
  };
  
  $scope.fetchInviteIDs();
  $scope.fetchEvents();
  
  // Fetches users from the database that are not current user
  
  $scope.fetchUsers = function () {
    return $http({
      method: 'GET', 
      url: '/users-fetch'
    })
    .then(function(resp) {
      $scope.userList = resp.data;
      console.log("USER LIST!!!" + $scope.userList);
    });
  };

  // Creates an event with $scope.newEvent data

  $scope.createEvent = function() {
    $scope.newEvent.invited = $scope.invitedUsers;
    return $http({
      method: 'POST',
      url: '/events-create',
      data: $scope.newEvent
    })
    .then(function(resp) {
      console.log("EVENT CREATED!!! " + $scope.newEvent);
      $window.location.href = "/";
    });
  };

  $scope.checkStripe = function($event){
    var currentUser = sessionStorage.getItem('user');
    return $http({
      method: 'POST',
      url : '/users/checkUser',
      data : {'username': currentUser}
    })
    .then(function(resp){
      $scope.lastEvent = $event.title;
      $scope.owner = $event.owner;
      console.log('resp',resp);
      console.log('resp',$event);
      if (resp.data.hasStripeId === true){
        $scope.hasStripe = true;
      } else {
        $scope.needInfo = true;
      }
    });
  };


  $scope.showDetails = function(){
    if ($scope.showCreate === true){
      $scope.showCreate = false;
    } else {
      $scope.showCreate = true;
    }
  };

  $scope.confirm = function($event){
    console.log($event);
  };

});
