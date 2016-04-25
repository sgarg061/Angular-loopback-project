angular.module('app')
.controller('MainController', ['$scope', '$rootScope', '$window', '$http', 'userService', 'Cloud', 'Reseller',
  function($scope, $rootScope, $window, $http, userService, Cloud, Reseller) {

    var id, name;

    function retrieveCloudName(user, cb){
      console.log("id " + id);
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

        console.log("cloudName: " + name);
    }

    function retrieveResellerName(user, cb){
      console.log("id " + id);
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

        console.log("resellerName: " + name);
    }

    function configureIntercom(user, cb){
      switch (user.userType){
        case "cloud": 
          id = user.cloudId;
          retrieveCloudName(user, function(){  
            name = "cloudName: " + name;
            console.log("Sent in cloud! name: " + name);
            cb();
          });
          break;
        case "reseller": 
          id = user.resellerId;
          retrieveResellerName(user, function(){
            name = "resellerName: " + name;
            console.log("Sent in reseller! name: " + name);
            cb();
          });
          break;
        case "solink": 
          id = "Solink user";
          name ="Solink";
          cb();
          break;
      }

      // if(cb){
      //   console.log("Initiated cb");
      //   cb();
      // }

    }
    $rootScope.$on("$stateChangeStart", function(event, curr, prev){
      var user = userService.getUser();

        configureIntercom(user, function() { 
        console.log("cb is running");
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
            })
            .catch(function (err) {
              console.error('no config found', err);
            });
          }
      });

    });

  }]);