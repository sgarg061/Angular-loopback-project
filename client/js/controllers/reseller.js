angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', 'Cloud', 'Page', function($scope, $state, Cloud, Page) {

    Page.setTitle('Resellers');
    Page.setNavPath('Resellers');

    var self = this;

    self.cloud        = {};
    self.selectCloud  = selectCloud;

    function getClouds() {
      Cloud
        .find()
        .$promise
        .then(function(clouds) {
          self.cloud = clouds[0];
        });
    }
    getClouds();


    function selectCloud ( cloud ) {
      self.selected = angular.isNumber(cloud) ? $scope.clouds[cloud] : cloud;
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
