angular
  .module('app')
  .controller('CustomerController', ['$scope', '$state', '$stateParams', 'Customer', 'Page', function($scope, $state, $stateParams, Customer, Page) {

    $scope.customer = {};

    function getCustomer() {
      Customer
        .find({
          filter: {
            where: {id: $stateParams.customerId},
            include: ['devices', 'licenses', 'softwareVersion']
          }
        })
        .$promise
        .then(function(customers) {
          $scope.customer = customers[0];

          Page.setTitle($scope.customer.name);
          Page.setNavPath($scope.customer.name);

          console.log('$scope.customer: ' + JSON.stringify($scope.customer));
        });
    }
    getCustomer();

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: device.id});
    }
   
  }]);
