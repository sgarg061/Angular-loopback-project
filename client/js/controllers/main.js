angular.module('app')
.controller('MainController', ['$scope', '$rootScope', '$window', '$http', 'userService', 'Cloud', 'Reseller',
  function($scope, $rootScope, $window, $http, userService, Cloud, Reseller) {

    var id, name;

    
    $rootScope.$on("$stateChangeStart", function(event, curr, prev){
      var user = userService.getUser();

        configureData(user, function() { 
          if (user && user.userType && name) {
            $http.get('/assets/config.json')
            .then(function (res) {
              var config = res.data;
              $window.Intercom('boot', {
                app_id: config.intercomId,
                email: user.email,
                created_at: user.createdAt,
                user_id: user.id,
                company:{
                  id: id,
                  name: name
                }
              });

              console.log("---Sent intercom boot.---"); //debug
            })
            .catch(function (err) {
              console.error('no config found', err);
            });
          }
      });

    });

    function configureData(user, cbSendData){
      switch (user.userType){

        case "cloud": 
          id = user.cloudId;
          retrieveCloudName(user, function() {
              cbSendData();
          });
          break;

        case "reseller": 
          id = user.resellerId;
          retrieveResellerName(user, function() {
              console.log("Redirecting");
              cbSendData();
          });
          break;

        case "solink": 
          id = "Solink user";
          name ="Solink";
          cbSendData();
          break;

      }
    }
    
    function retrieveCloudName(user, cb){
      Cloud
        .findOne({
          filter:{
            where: {id: id}, 
            fields: {name: true}
          }
        })
        .$promise
        .then(function(cloud){
           name = cloud.name;
           console.log("---Loopback Database Call---");
           if(cb){
              cb();
           }
        });
    }

    function retrieveResellerName(user, cb){
      Reseller
        .findOne({
          filter:{
            where: {id: id}, 
            fields: {name: true}
          }
        })
        .$promise
        .then(function(reseller){
           name = reseller.name;
           console.log("---Loopback Database Call---");
           if(cb){
              cb();
           }
        });
    }

  }]);