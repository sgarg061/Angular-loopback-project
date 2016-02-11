angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngMaterial',
    'ngStorage',
    'ngAnimate',
    'toastr',
    'blockUI',
    'ui.bootstrap',
    'ngClipboard',
    'ngPrettyJson',
    'uiGmapgoogle-maps',
    'customUserService',
    'angular-momentjs',
    'd3',
    'filterService'
  ])
  .config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$momentProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', 'ngClipProvider', 'uiGmapGoogleMapApiProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider, $momentProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, toastr, ngClipProvider, uiGmapGoogleMapApiProvider) {
      $momentProvider
        .asyncLoading(false)
        .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('grey');

      $mdIconProvider
                    .icon("close", "./assets/svg/close.svg", 24)
                    .icon("content_copy", "./assets/svg/content_copy.svg", 24)
                    .icon("drop_down", "./assets/svg/ic_arrow_drop_down_circle_black_24px.svg")
                    .icon("upload", "./assets/svg/ic_file_upload_black_24px.svg")
                    .icon("indicator_red", "./assets/svg/indicator_red.svg", 24)
                    .icon("indicator_yellow", "./assets/svg/indicator_yellow.svg", 24)
                    .icon("indicator_green", "./assets/svg/indicator_green.svg", 24)
                    .icon('checkmark', './assets/svg/ic_check_circle_green_24px.svg', 24)
                    .icon('error', './assets/svg/ic_error_red_24px.svg', 24)
                    .icon('warning', './assets/svg/ic_warning_yellow_24px.svg', 24)
                    .icon("right_arrow", "./assets/svg/ic_keyboard_arrow_right_black_24px.svg", 24)
                    .icon("edit", "./assets/svg/ic_border_color_black_24px.svg", 24)
                    .icon("info", "./assets/svg/ic_info_outline_black_24px.svg", 24)
                    .icon("show", "./assets/svg/ic_pageview_black_24px.svg", 24)
                    .icon("timeline", "./assets/svg/ic_timeline_black_24px.svg", 24)
                    .icon("cached", "./assets/svg/ic_cached_black_24px.svg", 24)
                    .icon("list", "./assets/svg/ic_view_list_black_24px.svg", 24);




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
                $localStorage.redirect = $location.$$path;
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
          .state('home', {
          url: '/',
          params: {
            cloudId: null,
          },
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          data: {
            requiresLogin: true
          }
        })
        .state('cloud', {
          url: '/cloud/:cloudId',
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

      $urlRouterProvider.otherwise('home');
  }])
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
