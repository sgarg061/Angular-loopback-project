angular
  .module('app')
  .controller('CustomerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'License', '$mdDialog', 'toastr', 
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, License, $mdDialog, toastr) {

    $scope.clouds = [];
    $scope.resellers = [];
    $scope.customers = [];
    $scope.customer = {};
    $scope.devices = [];

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;

    $scope.deviceData = {};

    function watchForChanges() {
      // watch customer for updates and save them when they're found
      $scope.$watch("customer", function(newValue, oldValue) {
        if (newValue) {
          Customer.prototype$updateAttributes({ id: $scope.customer.id }, $scope.customer)
            .$promise.then(function(customer) {}, function (res) {
              toastr.error(res.data.error.message, 'Error');
          });
        }
      }, true);
    }

    function getCustomer() {
      Customer
        .find({
          filter: {
            where: {id: $stateParams.customerId},
            include: ['softwareVersion', {
                relation: 'licenses',
                scope: {
                  order: 'activated ASC, key ASC'
                }
            },
            {
                relation: 'reseller',
                scope: {
                  include: {
                    relation: 'cloud',
                    scope: {
                      fields: {id: true, name: true},
                      order: 'name ASC'
                    }
                  }
                }
              },
              {
                relation: 'devices',
                scope: {
                  include: ['cameras', 'posDevices'],
                  order: 'name ASC'
                }
              }
            ]
          }
        })
        .$promise
        .then(function(customers) {
          $scope.customer = customers[0];

          $scope.customerId = customers[0].id;
          $scope.resellerId = customers[0].reseller.id;
          $scope.cloudId = customers[0].reseller.cloud.id;

          $scope.devices = customers[0].devices;

          getCloudResellers(customers[0].reseller.cloud.id);
          getResellerCustomers(customers[0].reseller.id)

          watchForChanges();

          for (var i=0; i<$scope.devices.length; i++) {
            var device = $scope.devices[i];

            $scope.deviceData[device.id] = {
                                            cameraStatus: {online: 0, offline: 0, unreachable: 0, total: 0},
                                            posStatus: {online: 0, offline: 0, unreachable: 0, total: 0}
                                          };

            var online = true;
            if (device.cameras) {
              for (var j=0; j<device.cameras.length; j++) {
                var camera = device.cameras[j];
                if (camera.status === 'online') {
                  $scope.deviceData[device.id].cameraStatus.online++;
                } else if (camera.status === 'offline') {
                  $scope.deviceData[device.id].cameraStatus.offline++;
                } else {
                  $scope.deviceData[device.id].cameraStatus.unreachable++;
                }
                $scope.deviceData[device.id].cameraStatus.total++;
              }
              $scope.deviceData[device.id].cameraStatus.color = ($scope.deviceData[device.id].cameraStatus.offline>0 ? 'red' : $scope.deviceData[device.id].cameraStatus.unreachable>0 ? 'yellow' : 'green');
            }

            if (device.posDevices) {
              for (var k=0; k<device.posDevices.length; k++) {
                var pos = device.posDevices[k];
                if (pos.status === 'online') {
                  $scope.deviceData[device.id].posStatus.online++;
                } else if (camera.status === 'offline') {
                  $scope.deviceData[device.id].posStatus.offline++;
                } else {
                  $scope.deviceData[device.id].posStatus.unreachable++;
                }
                $scope.deviceData[device.id].posStatus.total++;
              }
              $scope.deviceData[device.id].posStatus.color = ($scope.deviceData[device.id].posStatus.offline>0 ? 'red' : $scope.deviceData[device.id].posStatus.unreachable>0 ? 'yellow' : 'green');
            }
            // console.log('status: ' + JSON.stringify($scope.deviceData[device.id]));
          }
          
          // console.log('$scope.customer: ' + JSON.stringify($scope.customer));
        });
    }

    function getAllClouds() {
      Cloud
        .find({
          filter: {
            fields: {id: true, name: true},
            include: {
              relation: 'resellers',
              scope: {
                fields: {id: true, name: true},
                order: 'name ASC'
              }
            }
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds = clouds;
          // console.log('$scope.clouds: ' + JSON.stringify($scope.clouds));
        });
    }

    function getCloudResellers(cloudId) {
      Reseller
        .find({
          filter: {
            fields: {id: true, name: true},
            where: {cloudId: cloudId},
            order: 'name ASC'
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.resellers = resellers;
          // console.log('*** $scope.resellers: ' + JSON.stringify($scope.resellers));
        });
    }

    function getResellerCustomers(resellerId) {
      // console.log('*** finding resellers for cloud: ' + resellerId); 
      Customer
        .find({
          filter: {
            fields: {id: true, name: true},
            where: {resellerId: resellerId},
            order: 'name ASC'
          }
        })
        .$promise
        .then(function(customers) {
          $scope.customers = customers;
          // console.log('*** $scope.customers: ' + JSON.stringify($scope.customers));
        });
    }

    getCustomer();
    getAllClouds();

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }

    $scope.selectCloud = function(cloud) {
      $state.go('cloud', {cloudId: (typeof cloud  === 'string') ? cloud : cloud.id}, {reload: true});
    }

    $scope.selectCustomer = function(customer) {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : customer.id}, {reload: true});
    }

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
    }
   
    var convArrToObj = function(array){
      var thisEleObj = new Object();
      if(typeof array == "object"){
        for(var i in array){
          var thisEle = convArrToObj(array[i]);
          thisEleObj[i] = thisEle;
        }
      } else {
        thisEleObj = array;
      }
      return thisEleObj;
    }

    function showLicense(aLicense) {
      console.log('show license: ' + JSON.stringify(aLicense));
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'views/licenseShowForm.tmpl.html',
        controller: function (scope, $mdDialog) {
          scope.license = aLicense;
          scope.close = function() {
            $mdDialog.cancel();
          }
          scope.activateLicense = function() {
            console.log('activating license: ' + scope.license);
            License.activate({key: scope.license.key})
              .$promise
              .then(function(activationResult) {

                console.log('activated license: ' + JSON.stringify(activationResult));

                var licenseIndex = $scope.customer.licenses.indexOf(scope.license);

                if (~licenseIndex) {
                  $scope.customer.licenses[licenseIndex].activated = true;
                  $scope.customer.licenses[licenseIndex].username = activationResult.username;
                  $scope.customer.licenses[licenseIndex].password = activationResult.password;
                  $scope.customer.licenses[licenseIndex].deviceId = activationResult.deviceId;
                }

                // update device list
                getCustomer();

              }, function(err) {
                console.log('activated license error: ' + err);
            });
            $mdDialog.cancel();
          }
          $scope.revokeLicense = function() {
            console.log('revoking license: ' + scope.license);
            $mdDialog.cancel();
          }
        }
      });
    }

    function addLicense(customerId) {
      console.log('add license for customer id: ' + customerId);

      $mdDialog.show({
        controller: function (scope, $mdDialog) {
          scope.quantity = 0;
          scope.created = false;
          scope.licenseKeys = [];
          scope.licenseKeyList = "";
          scope.create = function() {
            
            async.times(scope.quantity, function(n, next){
              License.create({customerId: customerId})
                .$promise
                .then(function(license) {
                  $scope.customer.licenses.push(license);
                  console.log('adding license key: ' + license.key);

                  // add to the list on screen and to the string that might be copied to the clipboard
                  scope.licenseKeys.push(license.key);
                  scope.licenseKeyList += license.key + "\n";

                  next(undefined, license)
                }, function(err) {
                  next(err);
                })    
              }, function(err, users) {
                scope.created = true;
            });

          };

          scope.cancel = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'views/licenseCreateForm.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
      })
      .then(function(result) {
      }, function() {
      });
    }

  $scope.showLicense = showLicense;
  $scope.addLicense = addLicense;

}]);
