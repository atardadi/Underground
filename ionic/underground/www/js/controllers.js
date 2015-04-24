angular.module('underground.controllers', ['uiGmapgoogle-maps','underground.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PartiesCtrl', ['$scope','parties',function($scope,parties) {
  
  $scope.getAllParties = function(forceRefresh) {
    parties.getParties()
    .then(function(data) {
      $scope.parties = data;  
    })
    .catch(function(data) {
      console.error(data);
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getAllParties(false);
  
}])

.controller('PartyCtrl', ['$scope','$rootScope','$stateParams','parties','$ionicPopup',
                  function($scope, $rootScope, $stateParams,parties,$ionicPopup) {
  $scope.togglePublish = function() {
    if ($scope.party.published)
    {
      var confirm = $ionicPopup.confirm({
        title: 'Publish',
        template: 'Are you sure you want to publish?'
      });
      confirm.then(function(res) {
        if (!res) //confirmed 
        {
          $scope.party.published = !$scope.party.published;

        }
      });
    }
  };

  $scope.partyId = Number($stateParams.partyId);
  parties.getById($scope.partyId)
  .then(function(data) {
    $rootScope.party = data;

  });

  
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('LocationCtrl', ['$scope', '$rootScope', function($scope,$rootScope){
  //$scope.locationId = Number($stateParams.id);
  
  $scope.map = {
    center : $rootScope.party.location.coordinates,
    zoom: 12
  };

  $scope.marker = {
    longitude: $rootScope.party.location.coordinates.longitude,
    latitude : $rootScope.party.location.coordinates.latitude,
    title: $rootScope.party.name + '<br/>Tap for directions',
    showWindow : true
  };

  $scope.locationClicked = function(marker) {
    
  };
}])
.controller('dialogsCtrl', ['$scope', '$cordovaDialogs', function($scope, $cordovaDialogs){
  
  $scope.alertMe = function() {
    $cordovaDialogs.alert('Wow!', alertClosed, 'Alert Title', 'Dismiss');
    var alertClosed = function() {

    };
  }
  
}]);
