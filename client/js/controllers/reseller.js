angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Reseller', 'Page', function($scope, $state, $stateParams, Reseller, Page) {

    Page.setTitle('Resellers');
    Page.setNavPath('Resellers');

    $scope.reseller = {};

    function getReseller() {
      Reseller
        .find({
          filter: {
            where: {id: $stateParams.resellerId},
            include: ['customers', 'softwareVersion', 'posConnectors']
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.reseller = resellers[0];

          Page.setNavPath($scope.reseller.name);

          console.log('$scope.reseller: ' + JSON.stringify($scope.reseller));
        });
    }
    getReseller();

    $scope.selectCustomer = function(customer) {
      $state.go('customer', {customerId: customer.id});
    }
   
  }]);
