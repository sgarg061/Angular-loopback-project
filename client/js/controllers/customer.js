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
                      order: 'name ASC'
                    }
                  }
                }
              },
              {
                relation: 'devices',
                scope: {
                  limit: 10, /* FIXME - prevent a billion devices and all their related bits from coming back */
                  include: ['cameras', 'posDevices', 'license', {
                    relation: 'logEntries',
                    scope: {
                      limit: 10,
                      order: 'timestamp DESC'
                    }
                  }],
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
          $scope.reseller = customers[0].reseller;
          $scope.cloudId = customers[0].reseller.cloud.id;
          $scope.cloud = customers[0].reseller.cloud;

          $scope.devices = customers[0].devices;

          getCloudResellers(customers[0].reseller.cloud.id);
          getResellerCustomers(customers[0].reseller.id)

          watchForChanges();

          /* 
            Device status

            green: 
              - all cameras are green
              - all pos devices are green
              - device has checked in within expected interval
            
            yellow:
              - one or more cameras or pos devices are red
              - device has checked in within expected interval 
            red:
              - device has not checked in within expected interval
          */
          for (var i=0; i<$scope.devices.length; i++) {
            var device = $scope.devices[i];

            var lastCheckinTimeInSeconds = new Date(device.lastCheckin).getTime() / 1000;
            var nowInSeconds = new Date().getTime() / 1000;

            var checkinIntervalInSeconds = device.checkinInterval || 
                                          $scope.customer.checkinInterval || 
                                          $scope.customer.reseller.checkinInterval || 
                                          $scope.customer.reseller.cloud.checkinInterval;

            console.log('lastCheckin: ' + lastCheckinTimeInSeconds + ' now: ' + nowInSeconds + ' checkin interval: ' + checkinIntervalInSeconds);

            var gracePeriodInSeconds = 30;
            var hasCheckedInOnTime = (lastCheckinTimeInSeconds + checkinIntervalInSeconds + gracePeriodInSeconds) > nowInSeconds;
            console.log('hasCheckedInOnTime: ' + hasCheckedInOnTime);

            var allCamerasOnline = true;
            if (device.cameras) {
              for (var j=0; j<device.cameras.length; j++) {
                var camera = device.cameras[j];
                if (camera.status != 'online') {
                  allCamerasOnline = false;
                  break;
                } 
              }
            }

            var allPOSDevicesOnline = true;
            if (device.posDevices) {
              for (var k=0; k<device.posDevices.length; k++) {
                var pos = device.posDevices[k];
                if (pos.status != 'online') {
                  allPOSDevicesOnline = false;
                  break;
                }
              }
            }

            if (hasCheckedInOnTime) {
              if (allCamerasOnline && allPOSDevicesOnline) {
                device.status = 'green';
              } else {
                device.status = 'yellow';
              }
            } else {
              device.status = 'red';
            }

            // var online = true;
            // if (device.cameras) {
            //   for (var j=0; j<device.cameras.length; j++) {
            //     var camera = device.cameras[j];
            //     if (camera.status === 'online') {
            //       $scope.deviceData[device.id].cameraStatus.online++;
            //     } else if (camera.status === 'offline') {
            //       $scope.deviceData[device.id].cameraStatus.offline++;
            //     } else {
            //       $scope.deviceData[device.id].cameraStatus.unreachable++;
            //     }
            //     $scope.deviceData[device.id].cameraStatus.total++;
            //   }
            //   $scope.deviceData[device.id].cameraStatus.color = ($scope.deviceData[device.id].cameraStatus.offline>0 ? 'red' : $scope.deviceData[device.id].cameraStatus.unreachable>0 ? 'yellow' : 'green');
            // }

            // if (device.posDevices) {
            //   for (var k=0; k<device.posDevices.length; k++) {
            //     var pos = device.posDevices[k];
            //     if (pos.status === 'online') {
            //       $scope.deviceData[device.id].posStatus.online++;
            //     } else if (camera.status === 'offline') {
            //       $scope.deviceData[device.id].posStatus.offline++;
            //     } else {
            //       $scope.deviceData[device.id].posStatus.unreachable++;
            //     }
            //     $scope.deviceData[device.id].posStatus.total++;
            //   }
            //   $scope.deviceData[device.id].posStatus.color = ($scope.deviceData[device.id].posStatus.offline>0 ? 'red' : $scope.deviceData[device.id].posStatus.unreachable>0 ? 'yellow' : 'green');
            // }
            // console.log('status: ' + JSON.stringify($scope.deviceData[device.id]));
          }
          
          console.log('$scope.customer: ' + JSON.stringify($scope.customer));
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
      $scope.cloud = cloud;
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
      });
    }

  function deleteCustomer(customer) {
    console.log('delete customer: ' + JSON.stringify(customer));
    $mdDialog.show({
        controller: function (scope, $mdDialog) {
          scope.customerName = '';

          scope.deleteCustomer = function() {

            if (scope.customerName === customer.name) {
              Customer.deleteById({id: customer.id})
                .$promise
                .then(function(result) {
                  $mdDialog.cancel();
                  $scope.selectReseller($scope.resellerId);
                  toastr.info('Customer ' + customer.name + ' deleted');
                }, function(err) {
                  $mdDialog.cancel();
                  toastr.error('Unable to delete customer: ' + err.data.error.message);
                });
            } else {
              toastr.info('Customer not deleted - name did not match "' + customer.name + '"');
              $mdDialog.cancel();
            }
          };

          scope.close = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'views/customerDelete.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
      })
      .then(function(result) {
      });
  }

  function showCheckin(anEntry) {
    console.log('show checkin entry: ' + JSON.stringify(anEntry));
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'views/device_checkin_entry.tmpl.html',
      controller: function (scope, $mdDialog) {
        scope.entry = anEntry;
        scope.close = function() {
          $mdDialog.cancel();
        }
      }
    });
  }

  function goHome() {
      $state.go('home');
    }

  $scope.showLicense = showLicense;
  $scope.addLicense = addLicense;
  $scope.deleteCustomer = deleteCustomer;
  $scope.showCheckin = showCheckin;
  $scope.goHome = goHome;

}]);
