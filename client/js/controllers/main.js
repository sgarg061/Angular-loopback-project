angular.module('app')
.controller('MainController', ['$scope', '$rootScope', '$window', '$http', 'userService', 'Cloud', 'Reseller',
  function($scope, $rootScope, $window, $http, userService, Cloud, Reseller) {

    var id, name, userType, check; //check - to prevent multiple firings
    
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
                  name: name,
                  "User Type":userType
                }
              });
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
          if(user !== check){ //first time logging || diff account same load
            userType = "Cloud";
            id = user.cloudId;
            check = user;
            retrieveCloudName(user, function() {
                cbSendData();
            });
          }
          break;

        case "reseller": 
          if(user !== check){ //first time logging || diff account same load
            userType = "Reseller";
            id = user.resellerId;
            check = user;
            retrieveResellerName(user, function() {
                cbSendData();
            });
          }
          break;

        case "solink": 
          if(user !== check){
            userType = "Solink";
            id = "Solink user";
            name ="Solink";
            check = user;
            cbSendData();
          }
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
           if(cb){
              cb();
           }
        });
    }

  }]);