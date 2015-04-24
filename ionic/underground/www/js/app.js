// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('underground', ['ionic', 'ngCordova','underground.controllers','angular-cache'])

.run(function($ionicPlatform, CacheFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    //Create all the caches
    if (!CacheFactory.get('partiesCache')) {
      
      CacheFactory.createCache('partiesCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 60000,
        storageMode: 'localStorage',
        maxAge: 5 * 1000
      });
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.dialogs', {
    url: "/dialogs",
    views: {
      'menuContent': {
        templateUrl: "templates/dialogs.html",
        controller: 'dialogsCtrl'
      }
    }
  })
  .state('app.playlists', {
    url: "/playlists",
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })
  .state('app.parties', {
    url: "/parties",
    views: {
      'menuContent': {
        templateUrl: "templates/parties.html",
        controller: 'PartiesCtrl'
      }
    }
  })
  .state('app.party', {
    url: "/parties/:partyId",
    views: {
      'menuContent': {
        templateUrl: "templates/party.html",
        controller: 'PartyCtrl'
      }
    }
  })
  .state('app.location-map', {
    url: "/parties/location-map/:location",
    views: {
      'menuContent': {
        templateUrl: "templates/location-map.html",
        controller: 'LocationCtrl'
      }
    }
  })
  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/parties');
});
