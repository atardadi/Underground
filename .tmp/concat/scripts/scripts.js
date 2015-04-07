'use strict';

/**
 * @ngdoc overview
 * @name theundergroundApp
 * @description
 * # theundergroundApp
 *
 * Main module of the application.
 */
var app = angular.module('theundergroundApp', [
    'firebase',
    'firebase.utils',
    'simpleLogin',
    'ui.router'
  ]);

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
'use strict';

/**
 * @ngdoc function
 * @name theundergroundApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the theundergroundApp
 */
angular.module('theundergroundApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

angular.module('firebase.config', [])
  .constant('FBURL', 'https://theunderground.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');


// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('firebase.utils', ['firebase', 'firebase.config'])
  .factory('fbutil', ['$window', 'FBURL', '$firebase', function($window, FBURL, $firebase) {
    'use strict';

    return {
      syncObject: function(path, factoryConfig) { // jshint ignore:line
        return syncData.apply(null, arguments).$asObject();
      },

      syncArray: function(path, factoryConfig) { // jshint ignore:line
        return syncData.apply(null, arguments).$asArray();
      },

      ref: firebaseRef
    };

    function pathRef(args) {
      for (var i = 0; i < args.length; i++) {
        if (angular.isArray(args[i])) {
          args[i] = pathRef(args[i]);
        }
        else if( typeof args[i] !== 'string' ) {
          throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
        }
      }
      return args.join('/');
    }

    /**
     * Example:
     * <code>
     *    function(firebaseRef) {
         *       var ref = firebaseRef('path/to/data');
         *    }
     * </code>
     *
     * @function
     * @name firebaseRef
     * @param {String|Array...} path relative path to the root folder in Firebase instance
     * @return a Firebase instance
     */
    function firebaseRef(path) { // jshint ignore:line
      var ref = new $window.Firebase(FBURL);
      var args = Array.prototype.slice.call(arguments);
      if( args.length ) {
        ref = ref.child(pathRef(args));
      }
      return ref;
    }

    /**
     * Create a $firebase reference with just a relative path. For example:
     *
     * <code>
     * function(syncData) {
         *    // a regular $firebase ref
         *    $scope.widget = syncData('widgets/alpha');
         *
         *    // or automatic 3-way binding
         *    syncData('widgets/alpha').$bind($scope, 'widget');
         * }
     * </code>
     *
     * Props is the second param passed into $firebase. It can also contain limit, startAt, endAt,
     * and they will be applied to the ref before passing into $firebase
     *
     * @function
     * @name syncData
     * @param {String|Array...} path relative path to the root folder in Firebase instance
     * @param {object} [props]
     * @return a Firebase instance
     */
    function syncData(path, props) {
      var ref = firebaseRef(path);
      props = angular.extend({}, props);
      angular.forEach(['limitToFirst', 'limitToLast', 'orderByKey', 'orderByChild', 'orderByPriority', 'startAt', 'endAt'], function(k) {
        if( props.hasOwnProperty(k) ) {
          var v = props[k];
          ref = ref[k].apply(ref, angular.isArray(v)? v : [v]);
          delete props[k];
        }
      });
      return $firebase(ref, props);
    }
  }]);

'use strict';
/**
 * @ngdoc function
 * @name theundergroundApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('theundergroundApp')
  .controller('ChatCtrl', ["$scope", "fbutil", "$timeout", function ($scope, fbutil, $timeout) {
    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }


    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = fbutil.syncArray('messages', {limitToLast: 10});

    // display any errors
    $scope.messages.$loaded().catch(alert);

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage})
          // display any errors
          .catch(alert);
      }
    };

    
  }]);

'use strict';

angular.module('theundergroundApp')
  .filter('reverse', function() {
    return function(items) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  });

(function() {
  'use strict';
  angular.module('simpleLogin', ['firebase', 'firebase.utils', 'firebase.config'])

    // a simple wrapper that rejects the promise
    // if the user does not exists (i.e. makes user required), useful for
    // setting up secure routes that require authentication
    .factory('authRequired', ["simpleLogin", "$q", function(simpleLogin, $q) {
      return function() {
        return simpleLogin.auth.$requireAuth().then(function (user) {
          return user ? user : $q.reject({ authRequired: true });
        });
      };
    }])

    .factory('simpleLogin', ["$firebaseAuth", "fbutil", "$q", "$rootScope", "createProfile", function($firebaseAuth, fbutil, $q, $rootScope, createProfile) {
      var auth = $firebaseAuth(fbutil.ref());
      var listeners = [];

      function statusChange() {
        fns.initialized = true;
        fns.user = auth.$getAuth() || null;
        angular.forEach(listeners, function(fn) {
          fn(fns.user);
        });
      }

      var fns = {
        auth: auth,

        user: null, //todo use getUser() and remove this var

        initialized: false,

        getUser: function() {
          return auth.$getAuth();
        },

        login: function(provider, opts) {
          return auth.$authWithOAuthPopup(provider, opts);
        },

        anonymousLogin: function(opts) {
          return auth.$authAnonymously(opts);
        },

        passwordLogin: function(creds, opts) {
          return auth.$authWithPassword(creds, opts);
        },

        logout: function() {
          auth.$unauth();
        },

        createAccount: function(email, pass, opts) {
          return auth.$createUser({email: email, password: pass})
            .then(function() {
              // authenticate so we have permission to write to Firebase
              return fns.passwordLogin({email: email, password: pass}, opts);
            })
            .then(function(user) {
              // store user data in Firebase after creating account
              return createProfile(user.uid, email/*, name*/).then(function() {
                return user;
              });
            });
        },

        changePassword: function(email, oldpass, newpass) {
          return auth.$changePassword({email: email, oldPassword: oldpass, newPassword: newpass});
        },

        changeEmail: function(password, newEmail, oldEmail) {
          return auth.$changeEmail({password: password, oldEmail: oldEmail, newEmail: newEmail});
        },

        removeUser: function(email, pass) {
          return auth.$removeUser({email: email, password: pass});
        },

        watch: function(cb, $scope) {
          listeners.push(cb);
          auth.$waitForAuth(cb);
          var unbind = function() {
            var i = listeners.indexOf(cb);
            if( i > -1 ) { listeners.splice(i, 1); }
          };
          if( $scope ) {
            $scope.$on('$destroy', unbind);
          }
          return unbind;
        }
      };

      auth.$onAuth(statusChange);

      return fns;
    }])

    .factory('createProfile', ["fbutil", "$q", "$timeout", function(fbutil, $q, $timeout) {
      return function(id, email, name) {
        function firstPartOfEmail(email) {
          return ucfirst(email.substr(0, email.indexOf('@'))||'');
        }

        function ucfirst (str) {
          // credits: http://kevin.vanzonneveld.net
          str += '';
          var f = str.charAt(0).toUpperCase();
          return f + str.substr(1);
        }


        var ref = fbutil.ref('users', id), def = $q.defer();
        ref.set({email: email, name: name||firstPartOfEmail(email)}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });

        

        return def.promise;
      };
    }]);
})();

'use strict';
/**
 * @ngdoc function
 * @name theundergroundApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('theundergroundApp')
  .controller('LoginCtrl', ["$scope", "simpleLogin", "$location", "$state", function ($scope, simpleLogin, $location, $state) {
    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        simpleLogin.createAccount(email, pass, {rememberMe: true})
          .then(redirect, showError);
      }
    };
    

    function redirect() {
      $state.go('account');
    }

    function showError(err) {
      $scope.err = err;
    }


  }]);

'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
app.controller('AccountCtrl', ["$scope", "user", "simpleLogin", "fbutil", "$timeout", function ($scope, user, simpleLogin, fbutil, $timeout) {
    $scope.user = user;
    $scope.logout = simpleLogin.logout;
    $scope.messages = [];
    var profile;
    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

    function loadProfile(user) {
      if( profile ) {
        profile.$destroy();
      }
      profile = fbutil.syncObject('users/'+user.uid);
      profile.$bindTo($scope, 'profile');
    }



    
    loadProfile(user);

    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        simpleLogin.changePassword(profile.email, oldPass, newPass)
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      simpleLogin.changeEmail(pass, newEmail, profile.email)
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
        })
        .catch(error);
    };

    
  }]);

/**
 * @ngdoc function
 * @name theundergroundApp.directive:ngShowAuth
 * @description
 * # ngShowAuthDirective
 * A directive that shows elements only when user is logged in. It also waits for simpleLogin
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('theundergroundApp')
  .directive('ngShowAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    'use strict';
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        simpleLogin.watch(update, scope);
        simpleLogin.getUser(update);
      }
    };
  }]);


/**
 * @ngdoc function
 * @name theundergroundApp.directive:ngHideAuth
 * @description
 * # ngHideAuthDirective
 * A directive that shows elements only when user is logged out. It also waits for simpleLogin
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('theundergroundApp')
  .directive('ngHideAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    'use strict';
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it
        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', isLoggedIn !== false);
          }, 0);
        }

        simpleLogin.watch(update, scope);
        simpleLogin.getUser(update);
      }
    };
  }]);
