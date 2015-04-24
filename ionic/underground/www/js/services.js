'use strict';

angular.module('underground.services',[])
.factory('parties',['$http', '$ionicLoading', '$timeout','CacheFactory','$q',
            function($http,$ionicLoading,$timeout,CacheFactory,$q) {

    var partiesCache = CacheFactory.get('partiesCache');
    


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
               
        var deferred = $q.defer();


        if (!forceRefresh) {
            var partiesData = partiesCache.get('parties');    
        }
        
        if (partiesData) {
            console.log('Data in cache',partiesData);
            deferred.resolve(partiesData);
            return deferred.promise;
        }
        else {
            $ionicLoading.show({
                template: "Loading..."
            });
            forceRefresh = forceRefresh || false; 

            var url = 'data/parties.json';
            $ionicLoading.show({
                template: "Loading..."
            });

            var request = $http({
                method: 'GET',
                url: url
            });

            return request
                   .then(function(response) {
                        $timeout(function(){
                            $ionicLoading.hide();
                        }, 1000);
                        console.log('From $http');
                        partiesCache.put('parties',response.data);
                        return response.data;
                    })
                    .catch(handleError);    
        }

        
    };

    var getById = function(partyId) {
        var deferred = $q.defer();

        var partiesData = partiesCache.get('parties');
        if (partiesData) { //Data in cache
            var party = _.chain(partiesData)
                         .find({"id" : partyId})
                         .value();
            deferred.resolve(party); 
            return deferred.promise; 
        }
        else {
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
        }     
        
    };    
 	


 	return {
 		getParties: getParties,
 		getById: getById 
 	};
}]);