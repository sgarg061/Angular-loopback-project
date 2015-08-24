angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngMaterial',
    'ngStorage',
    'ngAnimate',
    'toastr',
    'blockUI'
  ])
  .config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', 
    function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, toastr) {
      
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('grey');

      $mdIconProvider
                    .icon("indicator_red", "./assets/svg/indicator_red.svg", 24)
                    .icon("indicator_yellow", "./assets/svg/indicator_yellow.svg", 24)
                    .icon("indicator_green", "./assets/svg/indicator_green.svg", 24);


      $locationProvider.html5Mode(true);

      $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
          'request': function (config) {
            config.headers = config.headers || {};
            if ($localStorage.token) {
              config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }
            return config;
          },
          'responseError': function (response) {
            switch (response.status) {
              case 401:
              case 403: 
                delete $localStorage.token;
                $location.path('/login');
                break;
              case 500:
              toastr.error(response.message, 'Error');
                break;
            }
            return $q.reject(response);
          }
        };
      }]);

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

    // $rootScope.$on('$locationChangeStart', function() {
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

    $rootScope.$on( "$routeChangeStart", function(event, next) {
      if ($localStorage.token == null) {
        $location.path('/login');
      }
    });
  

});
