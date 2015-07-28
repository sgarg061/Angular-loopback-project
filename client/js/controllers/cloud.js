angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', 'Cloud', function($scope, $state, Cloud) {
    $scope.clouds = [];
    function getClouds() {
      Cloud
        .find()
        .$promise
        .then(function(results) {
          $scope.clouds = results;
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
