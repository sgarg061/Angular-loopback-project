angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', 'Cloud', 'Page', function($scope, $state, Cloud, Page) {

    Page.setTitle('Clouds');
    
    $scope.clouds = [ ];
    $scope.selected = null;

    function getClouds() {
      Cloud
        .find({
          filter: {
            where: {},
            include: ['resellers', 'softwareVersion', 'posConnectors']
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds    = [].concat(clouds);          
          $scope.selected = clouds[0];

          if ($scope.selected) {
            Page.setNavPath($scope.selected.name);
            console.log('selected: ' + JSON.stringify($scope.selected));
          }
          
          $scope.selected.posConnectors = [
            {name: 'POS Connector 1', cloudId: $scope.selected.id},
            {name: 'POS Connector 2', cloudId: $scope.selected.id, checkinInterval: 3000},
          ];
        });
    }
    getClouds();

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: reseller.id});
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
