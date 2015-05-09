angular.module('headcount.events', [])

.controller('EventsController', function ($scope, Links, $http) {
  // Your code here


  //  populating data array with dummy event objects
  $scope.events = [{
    title: 'Khoa\'s House Party',
    description: 'House party. Beer. Etc.',
    expiration: '12/01/2016',
    thresholdPeople: 5,
    image: 'http://www.explara.com/magazine/wp-content/uploads/2013/07/lets-party.jpg'
  },{
    title: 'Pranav\'s Graduation',
    description: 'Finishing Hack Reactor. Beer. Etc.',
    expiration: '12/03/2016',
    thresholdPeople: 8,
    image: 'http://i.huffpost.com/gen/1153834/images/o-HIGH-SCHOOL-GRADS-facebook.jpg'
  },{
    title: 'Ansel\'s Bachelor Parade',
    description: 'Getting married. Beer. Etc.',
    expiration: '02/01/2016',
    thresholdPeople: 12,
    image: 'http://fiestaparadefloats.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-10-at-4.04.52-PM.png'
  },{
    title: 'Birthday Party for Matt',
    description: 'Turning 21. Beer. Etc.',
    expiration: '12/07/2016',
    thresholdPeople: 7,
    image: 'http://www.icelandlouisville.com/styled-5/files/birthday2-2.jpg'
  }];

  $scope.hasStripe = false;
  $scope.needInfo = false;
  $scope.newEvent = {title: 'Title goes here', description: 'Description goes here', expiration: "5 days", thresholdPeople: 10};
  $scope.userList = [];
  $scope.inviteList = [];

  $scope.$watchCollection('data.tags',function(val){
    console.log(val);
  });

  $scope.addInvite = function(user) {
    var index = $scope.userList.indexOf(user);
    console.log("INDEX!!! " + index);
    $scope.inviteList.push($scope.userList.splice(index, 1));
  };

  $scope.removeInvite = function(user) {
    var index = $scope.inviteList.indexOf(user);
    console.log("INDEX!!! " + index);
    $scope.userList.push($scope.inviteList.splice(index, 1));
  };

  $scope.fetchEvents = function () {
    return $http({
      method: 'POST', 
      url: '/events-fetch',
      data: {username: sessionStorage.getItem('user')}
    })
    .then(function(resp) {
      console.log('resp!!!' + resp);
      $scope.events.push(resp);
    });
  };

  $scope.fetchUsers = function () {
    console.log("FETCH USERS");
    return $http({
      method: 'GET', 
      url: '/users-fetch'
    })
    .then(function(resp) {
      console.log('resp!!!' + JSON.stringify(resp));
      $scope.userList = resp.data;
      console.log("$SCOPE.USERLIST" + $scope.userList);
    });
  };

  $scope.createEvent = function() {
    $scope.newEvent.invited = $scope.inviteList;
    console.log("NEW EVENT!!!" + JSON.stringify($scope.newEvent));
    // return $http({
    //   method: 'POST',
    //   url: '/events-create',
    //   data: $scope.newEvent
    // })
    // .then(function(resp) {

    // });
  };

  $scope.checkStripe = function(){
    var currentUser = sessionStorage.getItem('user');
    return $http({
      method: 'POST',
      url : '/users/checkUser',
      data : {'username': currentUser}
    })
    .then(function(resp){
      console.log('resp',resp);
      if (resp.data.hasStripeId === true){
        $scope.hasStripe = true;
      } else {
        $scope.needInfo = true;
      }
    });
  };

});
