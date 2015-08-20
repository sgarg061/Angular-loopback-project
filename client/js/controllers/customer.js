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

    // watch customer for updates and save them when they're found
    $scope.$watch("customer", function(newValue, oldValue) {
      if (newValue) {
        Customer.prototype$updateAttributes({ id: $scope.customer.id }, $scope.customer)
          .$promise.then(function() {});
      }
    }, true);

    function getCustomer() {
      Customer
        .find({
          filter: {
            where: {id: $stateParams.customerId},
            include: ['devices', 'licenses', 'softwareVersion', {
                relation: 'reseller',
                scope: {
                  include: {
                    relation: 'cloud',
                    scope: {
                      fields: {id: true, name: true}
                    }
                  }
                }
            }]
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
          console.log('*** $scope.resellers: ' + JSON.stringify($scope.resellers));
        });
    }

    function getResellerCustomers(resellerId) {
      console.log('*** finding resellers for cloud: ' + resellerId); 
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
   
  }]);
