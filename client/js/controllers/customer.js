angular
  .module('app')
  .controller('CustomerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Page', function($scope, $state, $stateParams, Cloud, Reseller, Customer, Page) {

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
            .$promise.then(function() {});
        }
      }, true);
    }

    function getCustomer() {
      Customer
        .find({
          filter: {
            where: {id: $stateParams.customerId},
            include: ['licenses', 'softwareVersion', {
                relation: 'reseller',
                scope: {
                  include: {
                    relation: 'cloud',
                    scope: {
                      fields: {id: true, name: true}
                    }
                  }
                }
              },
              {
                relation: 'devices',
                scope: {
                  include: ['cameras', 'posDevices']
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

          Page.setTitle($scope.customer.name);
          Page.setNavPath($scope.customer.name);

          watchForChanges();

          for (var i=0; i<$scope.devices.length; i++) {
            var device = $scope.devices[i];

            $scope.deviceData[device.id] = {
                                            cameraStatus: {online: 0, offline: 0, unreachable: 0, total: 0},
                                            posStatus: {online: 0, offline: 0, unreachable: 0, total: 0}
                                          };

            var online = true;
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
            where: {cloudId: cloudId}
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
            where: {resellerId: resellerId}
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
   
    function selectLicense($event) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        template:
          '<md-dialog aria-label="List dialog">' +
          '  <md-dialog-content>'+
          '  <pre>{{JSON.stringify(license)}}</pre>' +
          '  </md-dialog-content>' +
          '  <div class="md-actions">' +
          '    <md-button ng-click="closeDialog()" class="md-primary">' +
          '      Close Dialog' +
          '    </md-button>' +
          '  </div>' +
          '</md-dialog>',
        locals: { license: $scope.license },
        controller: DialogController
      });

      function DialogController($scope, $mdDialog, license) {
        $scope.license = license;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }
    $scope.selectLicense = selectLicense;

  }]);
