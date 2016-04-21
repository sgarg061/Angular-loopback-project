angular.module('app')
.controller('MainController', ['$scope', '$rootScope', '$window', '$http', 'userService',
  function($scope, $rootScope, $window, $http, userService) {

    $rootScope.$on("$stateChangeStart", function(event, curr, prev){
      var user = userService.getUser();

      var id, name;
      switch (user.userType){
        case "cloud": 
          id = user.cloudId;
          name = userService.getCloudName();
          break;
        case "reseller": 
          id = user.resellerId;
          name = userService.getResellerName();
          break;
        case "solink": 
          id = "Solink";
          break;
      }

      if (user && user.userType) {
        $http.get('/assets/config.json')
        .then(function (res) {
          var config = res.data;
          $window.Intercom('boot', {
            app_id: config.intercomId,
            email: user.email,
            created_at: user.createdAt,
            user_id: user.id,
            userType: user.userType;
            company:{
              id: id,
              name: name
            },
          });
        })
        .catch(function (err) {
          console.error('no config found', err);
        });
      }
    });

  }]);