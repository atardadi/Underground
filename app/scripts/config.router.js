'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /login
    $urlRouterProvider.otherwise("/login");
    //
    // Set up the states
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'LoginCtrl'
    }).state('account', {
        url: "/account",
        templateUrl: "views/account.html",
        controller: 'AccountCtrl'
    }).state('chat', {
        url: "/chat",
        templateUrl: "views/chat.html",
        controller: 'ChatCtrl'
    }).state('parties', {
        url: "/parties",
        templateUrl: "views/parties.html",
        controller: 'PartiesCtrl'
    }).state('party', {
        url: "/party/:partyId",
        templateUrl: "views/party.html",
        controller: 'PartiesCtrl'
    }).state('party_create', {
        url: "/create",
        templateUrl: "views/party_create.html",
        controller: 'PartyCreateCtrl'
    });

    
}]);