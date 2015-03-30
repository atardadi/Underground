"use strict";angular.module("theundergroundApp",["firebase","firebase.utils","simpleLogin"]),angular.module("theundergroundApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("firebase.config",[]).constant("FBURL","https://theunderground.firebaseio.com").constant("SIMPLE_LOGIN_PROVIDERS",["password"]).constant("loginRedirectPath","/login"),angular.module("firebase.utils",["firebase","firebase.config"]).factory("fbutil",["$window","FBURL","$firebase",function(a,b,c){function d(a){for(var b=0;b<a.length;b++)if(angular.isArray(a[b]))a[b]=d(a[b]);else if("string"!=typeof a[b])throw new Error("Argument "+b+" to firebaseRef is not a string: "+a[b]);return a.join("/")}function e(c){var e=new a.Firebase(b),f=Array.prototype.slice.call(arguments);return f.length&&(e=e.child(d(f))),e}function f(a,b){var d=e(a);return b=angular.extend({},b),angular.forEach(["limitToFirst","limitToLast","orderByKey","orderByChild","orderByPriority","startAt","endAt"],function(a){if(b.hasOwnProperty(a)){var c=b[a];d=d[a].apply(d,angular.isArray(c)?c:[c]),delete b[a]}}),c(d,b)}return{syncObject:function(a,b){return f.apply(null,arguments).$asObject()},syncArray:function(a,b){return f.apply(null,arguments).$asArray()},ref:e}}]),angular.module("theundergroundApp").controller("ChatCtrl",["$scope","fbutil","$timeout",function(a,b,c){function d(b){a.err=b,c(function(){a.err=null},5e3)}a.messages=b.syncArray("messages",{limitToLast:10}),a.messages.$loaded()["catch"](d),a.addMessage=function(b){b&&a.messages.$add({text:b})["catch"](d)}}]),angular.module("theundergroundApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),function(){angular.module("simpleLogin",["firebase","firebase.utils","firebase.config"]).factory("authRequired",["simpleLogin","$q",function(a,b){return function(){return a.auth.$requireAuth().then(function(a){return a?a:b.reject({authRequired:!0})})}}]).factory("simpleLogin",["$firebaseAuth","fbutil","$q","$rootScope","createProfile",function(a,b,c,d,e){function f(){i.initialized=!0,i.user=g.$getAuth()||null,angular.forEach(h,function(a){a(i.user)})}var g=a(b.ref()),h=[],i={auth:g,user:null,initialized:!1,getUser:function(){return g.$getAuth()},login:function(a,b){return g.$authWithOAuthPopup(a,b)},anonymousLogin:function(a){return g.$authAnonymously(a)},passwordLogin:function(a,b){return g.$authWithPassword(a,b)},logout:function(){g.$unauth()},createAccount:function(a,b,c){return g.$createUser({email:a,password:b}).then(function(){return i.passwordLogin({email:a,password:b},c)}).then(function(b){return e(b.uid,a).then(function(){return b})})},changePassword:function(a,b,c){return g.$changePassword({email:a,oldPassword:b,newPassword:c})},changeEmail:function(a,b,c){return g.$changeEmail({password:a,oldEmail:c,newEmail:b})},removeUser:function(a,b){return g.$removeUser({email:a,password:b})},watch:function(a,b){h.push(a),g.$waitForAuth(a);var c=function(){var b=h.indexOf(a);b>-1&&h.splice(b,1)};return b&&b.$on("$destroy",c),c}};return g.$onAuth(f),i}]).factory("createProfile",["fbutil","$q","$timeout",function(a,b,c){return function(d,e,f){function g(a){return h(a.substr(0,a.indexOf("@"))||"")}function h(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}var i=a.ref("users",d),j=b.defer();return i.set({email:e,name:f||g(e)},function(a){c(function(){a?j.reject(a):j.resolve(i)})}),j.promise}}])}(),angular.module("theundergroundApp").controller("LoginCtrl",["$scope","simpleLogin","$location",function(a,b,c){function d(){c.path("/account")}function e(b){a.err=b}a.passwordLogin=function(c,f){a.err=null,b.passwordLogin({email:c,password:f},{rememberMe:!0}).then(d,e)},a.createAccount=function(c,f,g){a.err=null,f?f!==g?a.err="Passwords do not match":b.createAccount(c,f,{rememberMe:!0}).then(d,e):a.err="Please enter a password"}}]),angular.module("theundergroundApp").controller("AccountCtrl",["$scope","user","simpleLogin","fbutil","$timeout",function(a,b,c,d,e){function f(a){h(a,"danger")}function g(a){h(a,"success")}function h(b,c){var d={text:b+"",type:c};a.messages.unshift(d),e(function(){a.messages.splice(a.messages.indexOf(d),1)},1e4)}function i(b){j&&j.$destroy(),j=d.syncObject("users/"+b.uid),j.$bindTo(a,"profile")}a.user=b,a.logout=c.logout,a.messages=[];var j;i(b),a.changePassword=function(b,d,e){a.err=null,b&&d?d!==e?f("Passwords do not match"):c.changePassword(j.email,b,d).then(function(){g("Password changed")},f):f("Please enter all fields")},a.changeEmail=function(b,d){a.err=null,c.changeEmail(b,d,j.email).then(function(){j.email=d,j.$save(),g("Email changed")})["catch"](f)}}]),angular.module("theundergroundApp").directive("ngShowAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",!c)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]),angular.module("theundergroundApp").directive("ngHideAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",c!==!1)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]);