angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Device', 'Page', function($scope, $state, $stateParams, Cloud, Reseller, Customer, Device, Page) {

    $scope.customer = {};

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;
    $scope.deviceId = null;

    // watch device for updates and save them when they're found
    $scope.$watch("device", function(newValue, oldValue) {
      if (newValue) {
        Device.prototype$updateAttributes({ id: $scope.device.id }, $scope.device)
          .$promise.then(function() {});
      }
    }, true);

    function getDevice() {
      Device
        .find({
          filter: {
            where: {id: $stateParams.deviceId},
            include: ['softwareVersion', 'logEntries', 'cameras', 'posDevices', {
              relation: 'customer',
              scope: {
                include: {
                  relation: 'reseller',
                  scope: {
                    include: {
                      relation: 'cloud'
                    }
                  }
                }
              }
            }]
          }
        })
        .$promise
        .then(function(devices) {
          $scope.device = devices[0];

          $scope.deviceId = devices[0].id;
          $scope.customerId = devices[0].customer.id;
          $scope.resellerId = devices[0].customer.reseller.id;
          $scope.cloudId = devices[0].customer.reseller.cloud.id;

          getCloudResellers($scope.cloudId);
          getResellerCustomers($scope.resellerId);
          getCustomerDevices($scope.customerId);

          Page.setTitle($scope.device.name);
          Page.setNavPath($scope.device.name);

          console.log('$scope.device: ' + JSON.stringify($scope.device));
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
        });
    }

    function getResellerCustomers(resellerId) {
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
          console.log('*** $scope.customers: ' + JSON.stringify($scope.customers));
        });
    }

    function getCustomerDevices(customerId) {
      console.log('*** finding devices for customer: ' + customerId); 
      Device
        .find({
          filter: {
            fields: {id: true, name: true},
            where: {customerId: customerId}
          }
        })
        .$promise
        .then(function(devices) {
          $scope.devices = devices;
          console.log('*** $scope.devices: ' + JSON.stringify($scope.devices));
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
          console.log('$scope.clouds: ' + JSON.stringify($scope.clouds));
        });
    }

    getDevice();
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
   
  }]);