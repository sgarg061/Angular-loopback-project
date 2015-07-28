angular
  .module('app', [
    'auth0', 
    'angular-storage', 
    'angular-jwt',
    'lbServices',
    'ui.router'
  ])
  .config(['authProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', 'jwtInterceptorProvider', 
    function(authProvider, $stateProvider, $httpProvider, $urlRouterProvider, jwtInterceptorProvider) {

    authProvider.init({
      domain: 'tylercope.auth0.com',
      clientID: 'qSxGuoCEtWuLcfkEk0Er3rRgnn6ZKJSm',
      callbackURL: location.href,
      loginState: 'login' // matches login state
    });

    authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
      console.log("Login Success");
      profilePromise.then(function(profile) {
        store.set('profile', profile);
        store.set('token', idToken);
      });
      $location.path('/');
    });

    authProvider.on('authenticated', function($location) {
      console.log("Authenticated");
    });

    authProvider.on('logout', function() {
      console.log("Logged out");
    })

    // We're annotating this function so that the `store` is injected correctly when this file is minified
    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'views/root.html',
        controller: 'RootController',
        data: {
          requiresLogin: true
        }
      })
      .state('cloud', {
        url: '/cloud',
        templateUrl: 'views/cloud.html',
        controller: 'CloudController',
        data: {
          requiresLogin: true
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'views/logout.html',
        controller: 'LogoutController'
      });    

    $urlRouterProvider.otherwise('cloud');


  }])
  .run(function($rootScope, auth, store, jwtHelper, $location) {

    // This hooks all auth events to check everything as soon as the app starts
    auth.hookEvents();

    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(store.get('profile'), token);
          } else {
            $location.path('/login');
          }
        }
      }
  });
});
