angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', 'Cloud', 'Page', function($scope, $state, Cloud, Page) {

    Page.setTitle('Clouds');
    
    var self = this;

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
            console.log('resellers: ' + $scope.selected.resellers);
          }
          
          $scope.resellers = [
            {name: 'Reseller 1', cloudId: $scope.selected.id},
            {name: 'Reseller 2', cloudId: $scope.selected.id, checkinInterval: 3000},
          ];
        });
    }
    getClouds();


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
