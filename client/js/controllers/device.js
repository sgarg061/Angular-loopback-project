angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Device', 'Page', function($scope, $state, $stateParams, Device, Page) {

    $scope.customer = {};

    function getDevice() {
      Device
        .find({
          filter: {
            where: {id: $stateParams.deviceId},
            include: ['softwareVersion']
          }
        })
        .$promise
        .then(function(devices) {
          $scope.device = devices[0];

          Page.setTitle($scope.device.name);
          Page.setNavPath($scope.device.name);

          console.log('$scope.device: ' + JSON.stringify($scope.device));
        });
    }
    getDevice();

    
   
  }]);
