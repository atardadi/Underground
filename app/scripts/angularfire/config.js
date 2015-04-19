angular.module('firebase.config', [])
  .constant('FBURL', 'https://theunderground.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])
  .constant('loginRedirectPath', '/login');
