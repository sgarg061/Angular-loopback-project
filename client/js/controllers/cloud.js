angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', '$stateParams', 'Cloud', 'Page', function($scope, $state, $stateParams, Cloud, Page) {

    Page.setTitle('Clouds');
    
    $scope.clouds = [ ];
    $scope.cloud = null;
    $scope.cloudId = null;

    function watchForChanges() {
      // watch cloud for updates and save them when they're found
      $scope.$watch("cloud", function(newValue, oldValue) {
        if (newValue) {
          Cloud.prototype$updateAttributes({ id: $scope.cloud.id }, $scope.cloud)
            .$promise.then(function() {});
        }
      }, true);
    }

    function getCloud() {
      console.log('changing to cloud: ' + $stateParams.cloudId);
      Cloud
        .find({
          filter: {
            where: {id: $stateParams.cloudId},
            include: ['resellers', 'softwareVersion', 'posConnectors']
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.cloud = clouds[0];
          $scope.cloudId = clouds[0].id;

          watchForChanges();
          
          if ($scope.cloud) {
            Page.setNavPath($scope.cloud.name);
            console.log('cloud: ' + JSON.stringify($scope.cloud));

            $scope.cloud.posConnectors = [
              {name: 'POS Connector 1', cloudId: $scope.cloud.id},
              {name: 'POS Connector 2', cloudId: $scope.cloud.id, checkinInterval: 3000},
            ];
          }
          
        });
    }

    function getClouds() {
      Cloud
        .find({
          filter: {
            fields: {id: true, name: true}
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds    = [].concat(clouds);          
          
          // select the first by default
          if (!$stateParams.cloudId) {
            $scope.selectCloud(clouds[0]);
          }
        });
    }

    if ($stateParams.cloudId) {
      getCloud();
    }
    getClouds();

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }

    $scope.selectCloud = function(cloud) {
      console.log('select cloud: ' + cloud.name);
      $state.go('cloud', {cloudId: (typeof cloud  === 'string') ? cloud : cloud.id}, {reload: true});
    }

    $scope.selectCustomer = function(customer) {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : customer.id}, {reload: true});
    }

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
    }

    $scope.addCloud = function() {
      Cloud
        .create($scope.newCloud)
        .$promise
        .then(function(cloud) {
          $scope.newCloud = '';
          $scope.cloudForm.name.$setPristine();
          $('.focus').focus();
          getClouds();
        });
    };

    $scope.removeCloud = function(item) {
      Cloud
        .deleteById(item)
        .$promise
        .then(function() {
          getClouds();
        });
    };
  }]);
