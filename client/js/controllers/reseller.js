angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Page', function($scope, $state, $stateParams, Cloud, Reseller, Page) {

    Page.setTitle('Resellers');
    Page.setNavPath('Resellers');

    $scope.clouds = [ ];
    $scope.reseller = {};
    
    $scope.cloudId = null;
    $scope.resellerId = null;

    function getReseller() {
      Reseller
        .find({
          filter: {
            where: {id: $stateParams.resellerId},
            include: ['cloud', 'customers', 'softwareVersion', 'posConnectors']
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.reseller = resellers[0];

          $scope.cloudId = resellers[0].cloud.id;
          $scope.resellerId = resellers[0].id;

          Page.setNavPath($scope.reseller.name);

          getCloudResellers(resellers[0].cloud.id);
          
          console.log('$scope.reseller: ' + JSON.stringify($scope.reseller));
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
      console.log('*** finding resellers for cloud: ' + cloudId); 
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

    getReseller();
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
