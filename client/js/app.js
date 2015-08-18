angular
  .module('app', [
    'auth0', 
    'angular-storage', 
    'angular-jwt',
    'lbServices',
    'ui.router',
    'ngMaterial'
  ])
  .config(['authProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', 'jwtInterceptorProvider', '$mdThemingProvider', '$mdIconProvider',
    function(authProvider, $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider, jwtInterceptorProvider, $mdThemingProvider, $mdIconProvider) {

      $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu"       , "./assets/svg/menu.svg"        , 24)
        .icon("share"      , "./assets/svg/share.svg"       , 24)
        .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
        .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
        .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
        .icon("phone"      , "./assets/svg/phone.svg"       , 512);

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('grey');

      $locationProvider.html5Mode(true);

      authProvider.init({
        domain: 'solink.auth0.com',
        clientID: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
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
        // .state('root', {
        //   url: '/',
        //   templateUrl: 'views/root.html',
        //   controller: 'RootController',
        //   data: {
        //     requiresLogin: true
        //   }
        // })
        .state('cloud', {
          url: '/',
          templateUrl: 'views/cloud.html',
          controller: 'CloudController',
          data: {
            requiresLogin: true
          }
        })
        .state('reseller', {
          url: '/reseller/:resellerId',
          templateUrl: 'views/reseller.html',
          controller: 'ResellerController',
          data: {
            requiresLogin: true
          }
        })
        .state('customer', {
          url: '/customer/:customerId',
          templateUrl: 'views/customer.html',
          controller: 'CustomerController',
          data: {
            requiresLogin: true
          }
        })
        .state('device', {
          url: '/device/:deviceId',
          templateUrl: 'views/device.html',
          controller: 'DeviceController',
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
