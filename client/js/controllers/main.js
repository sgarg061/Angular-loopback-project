angular.module('app')
.controller('MainController', ['$scope', '$rootScope', '$window', '$http', 'userService',
  function($scope, $rootScope, $window, $http, userService) {

    $rootScope.$on("$stateChangeStart", function(event, curr, prev){
      var user = userService.getUser();

      var name;
      if (user.userType === "cloud")
        {name = user.cloudId;}
      else if (user.userType === "reseller")
        name = user.resellerId;
      else if (user.userType === "solink")
        name = "Solink";


      if (user && user.userType) {
        $http.get('/assets/config.json')
        .then(function (res) {
          var config = res.data;
          $window.Intercom('boot', {
            app_id: config.intercomId,
            email: user.email,
            created_at: user.createdAt,
            user_id: user.id,
            company:{
              id: name,
            },
          });
        })
        .catch(function (err) {
          console.error('no config found', err);
        });
      }
    });

  }]);