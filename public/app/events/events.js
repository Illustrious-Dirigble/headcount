angular.module('headcount.events', [])

.controller('EventsController', function ($scope, Links, $http, $window, $timeout, $q, EventsFactory) {

  // Stores all events that were created by you or that you were invited to
$scope.user = {
      title: '',
      email: '',
      firstName: '',
      lastName: '' ,
      company: '' ,
      address: '' ,
      city: '' ,
      state: '' ,
      description: '',
      postalCode : ''
    };
  $scope.events = [];
  $scope.event = EventsFactory.currentEvent;
  $scope.hasNotAuthorizedVenmo = EventsFactory.hasNotAuthorizedVenmo;
  $scope.showEvent = false;
  $scope.showNewEvent = true;

  /* userList currently populates with all users of Headcount. invitedUsers
   * gets pushed with any users you invite.
   */

  $scope.userList = [];
  $scope.invitedUsers = [];

  $scope.hasStripe = false;
  $scope.needInfo = false;
  $scope.hasNotAuthorizedVenmo = true;

  $scope.display = false;

  $scope.displayNewEvent = function() {
    console.log('displayNewEvent');
    $scope.showNewEvent = true;
  };

  $scope.saveEvent = function(link) {
    $scope.showEvent = true;
    EventsFactory.currentEvent = link;
    console.log('saveEvent ', $scope.event, "link ", link, "EventsFactory", EventsFactory.currentEvent);
  };

  // Event object that's populated via creation form and then posted for creation
  $scope.newEvent = {
    title: 'Title goes here',
    description: 'Description goes here',
    expiration: new Date(new Date().setDate(new Date().getDate() + 20)),
    thresholdPeople: 10,
    thresholdMoney: 100
  };

  // Checks to see if there's currently a clicked event, if not, it sends them back to the events list

  $scope.checkEventClick = function() {
    if ($scope.event.image === undefined) {
      $window.location.href = "#/events";
    }
    else {
      return true;
    }
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

  var self = this;
  $scope.fetchUsers = function () {
    return $http({
      method: 'GET',
      url: '/users-fetch'
    })
    .then(function(resp) {
      $scope.userList = resp.data;
      console.log("USER LIST!!!" + $scope.userList);

      self.querySearch = querySearch;
      self.allContacts = loadContacts();
      self.contacts = [self.allContacts[0]];
      self.filterSelected = true;
      /**
       * Search for contacts.
       */
      function querySearch (query) {
        var results = query ?
            self.allContacts.filter(createFilterFor(query)) : [];
        return results;
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        console.log('filtering');
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(contact) {
          return (contact._lowername.indexOf(lowercaseQuery) != -1);;
        };
      }
      function loadContacts() {
        var contacts = [];
        for (var i = 0; i < $scope.userList.length; i++){
          contacts.push([$scope.userList[i][0],$scope.userList[i][1] ]);
        }
        // var contacts = [
        //   'Marina Augustine',
        //   'Oddr Sarno',
        //   'Nick Giannopoulos',
        //   'Narayana Garner',
        //   'Anita Gros',
        //   'Megan Smith',
        //   'Tsvetko Metzger',
        //   'Hector Šimek',
        //   'Some-guy withalongalastaname'
        // ];
        // console.log(contacts.map(function (c, index) {
        //   var cParts = c.split(' ');
        //   var contact = {
        //     name: c,
        //   };
        //   return contact;
        // }));
        return contacts.map(function (c, index) {
          var cParts = c[0].split(' ');
          var contact = {
            name: c[0],
            id: c[1],
            image: 'http://lorempixel.com/50/50/people?' + index
          };
          contact._lowername = contact.name.toLowerCase();
          return contact;
        });
      }
    });
  };
  $scope.fetchUsers();

  // Creates an event with $scope.newEvent data

  $scope.createEvent = function() {
    //console.log('invited',$scope.invitedUsers);
    //console.log($('.selected .compact'));
    var inv = [];
    var list = $('.selected .compact');
    for (var i = 0; i < list.length; i++){
      inv.push(list[i].children[0].innerText);
    }
    console.log('inv',inv);
    $scope.invitedUsers = inv;

    $scope.newEvent.invited = $scope.invitedUsers;
    console.log('Event details', $scope.newEvent);
    return $http({
      method: 'POST',
      url: '/events-create',
      data: $scope.newEvent
    })
    .then(function(resp) {
      $window.location.href = "/";
    });
  };

  $scope.acceptOrDeclineInvite = function(acceptOrDeclineBoolean, $event) {
    console.log('accepting invite?', acceptOrDeclineBoolean);

    var eventId = this.event.id;
    return $http({
      method: 'POST',
      url: '/invite-response',
      data: {
        eventId: eventId,
        accepted: acceptOrDeclineBoolean
      }
    })
    .then(function(resp) {

     console.log('invite response');
     console.log(resp);

     $scope.updateEventInfo(resp, $event);



     // $event.thresholdMoney

     // if ($event.thresholdPeople > 1){
     //   $event.thresholdMoney -= $event.thresholdMoney/$event.thresholdPeople;
     //   $event.thresholdPeople --;
     // } else if ($event.thresholdPeople === 1){
     //   // threshold reached! trigger funding
     //   $scope.triggerFunding = true;
     //   $event.thresholdMoney -= $event.thresholdMoney/$event.thresholdPeople;
     //   $event.thresholdPeople --;
     // }

    });
  };

  $scope.updateEventInfo = function(resp, $event) {
    console.log(resp);

    var numNeeded = Number(resp.data.eventInfo.thresholdPeople);
    var cashNeeded = Number(resp.data.eventInfo.thresholdMoney);
    var cashPerPerson = cashNeeded / numNeeded;
    var numCommitted = Number(resp.data.eventInfo.committedPeople);

    console.log('num needed', numNeeded);
    console.log('cash needed', cashNeeded);
    console.log('num committed', numCommitted);

    $event.thresholdPeople = numNeeded - numCommitted;
    $event.thresholdMoney = cashNeeded - (cashPerPerson * numCommitted);
  };

  $scope.checkVenmoDetails = function(){
    console.log('the event!')

    var currentUser = sessionStorage.getItem('user');
    return $http({
      method: 'POST',
      url : '/users/checkUser',
      data : {'username': currentUser}
    })
    .then(function(resp){
      console.log(resp.data);
      var hasVenmoInfo = resp.data.hasVenmoInfo;

      if (!hasVenmoInfo) {
        console.log('You have not authorized your Venmo account yet!');
      } else {
        console.log('venmo authorized');
      }

      EventsFactory.hasNotAuthorizedVenmo = !hasVenmoInfo;
      $scope.hasNotAuthorizedVenmo = !hasVenmoInfo;
    });
  };

  $scope.checkVenmoDetails();
  $scope.showDetails = function(){
    if ($scope.showCreate === true){
      $scope.showCreate = false;
    } else {
      $scope.showCreate = true;
    }
  };

  $scope.checkVenmoDetails();
  // $scope.updateEventInfo();

});

