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
    });

    
}]);