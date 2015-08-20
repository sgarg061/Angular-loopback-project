angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngMaterial'
  ])
  .config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
      
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('grey');

      $locationProvider.html5Mode(true);

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
          params: {
            cloudId: null,
          },
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
  .directive('sidebar', function() {
    var directive = {};

    directive.restrict = 'E'; 
    directive.templateUrl = "/views/sidebar.html";
    directive.scope = {
      model: "=model",
      type: "=type"
    }
    return directive;
  })
  .run(function($rootScope, $location) {

    $rootScope.$on('$locationChangeStart', function() {
      // if (!auth.isAuthenticated) {
      //   var token = store.get('token');
      //   if (token) {
      //     if (!jwtHelper.isTokenExpired(token)) {
      //       auth.authenticate(store.get('profile'), token);
      //     } else {
      //       $location.path('/login');
      //     }
      //   }
      // }
  });
});
