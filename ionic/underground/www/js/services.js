'use strict';

angular.module('underground.servies',[])
.factory('parties',['$http', '$ionicLoading', '$timeout',
            function($http,$ionicLoading,$timeout) {

    var handleError = function (response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject(response.data) || !response.data.message) {
            return ( $q.reject("An unknown error occurred.") );
        }

        // Otherwise, use expected error message.
        return ( $q.reject(response.data.message) );
    };

    var handleSuccess = function (response) {
        $timeout(function(){
           $ionicLoading.hide();
        }, 1000);
        return ( response.data );
    };

    //TODO angular cache
    var getParties = function(forceRefresh) {
        forceRefresh = forceRefresh || false; 

        $ionicLoading.show({
            template: "Loading..."
        });

        var url = 'data/parties.json';
        $ionicLoading.show({
            template: "Loading..."
        });

        var request = $http({
            method: 'GET',
            url: url
        });

        return ( request.then(handleSuccess, handleError) );
    };

    var getById = function(partyId) {

        $ionicLoading.show({
            template: "Loading..."
        });

        var url = 'data/parties.json';
        $ionicLoading.show({
            template: "Loading..."
        });

        var request = $http({
            method: 'GET',
            url: url
        });

        return ( request
                .then(function(response) {
                    var parties = response.data;
                    $timeout(function(){
                               $ionicLoading.hide();
                            }, 1000);
                    var party = _.chain(parties)
                     .find({"id" : partyId})
                     .value();
                    return party;
                }, handleError) );
    };    
 	


 	return {
 		getParties: getParties,
 		getById: getById 
 	};
}]);