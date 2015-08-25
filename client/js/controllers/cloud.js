angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', '$mdDialog', 'toastr',
    function($scope, $state, $stateParams, Cloud, Reseller, $mdDialog, toastr) {

    $scope.currentResellerPage = 0;
    $scope.resellersPerPage = 1000; // FIXME
    $scope.totalResellers = 0;

    $scope.clouds = [];
    $scope.cloud = null;
    $scope.cloudId = null;

    function watchForChanges() {
      // watch cloud for updates and save them when they're found
      $scope.$watch("cloud", function(newValue, oldValue) {
        if (newValue) {
          Cloud.prototype$updateAttributes({ id: $scope.cloud.id }, $scope.cloud)
            .$promise.then(function(cloud) {}, function (res) {
              toastr.error(res.data.error.message, 'Error');
          });
        }
      }, true);
    }

    function getCloud() {
      console.log('changing to cloud: ' + $stateParams.cloudId);
      Cloud
        .find({
          filter: {
            where: {id: $stateParams.cloudId},
            include: ['softwareVersion', 'posConnectors', {
              relation: 'resellers',
              scope: {
                order: 'name ASC',
                limit: $scope.currentResellerPage,
                skip: $scope.currentResellerPage * $scope.resellersPerPage
              }
            }]
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.cloud = clouds[0];
          $scope.cloudId = clouds[0].id;

          watchForChanges();
          
          if ($scope.cloud) {

            $scope.cloud.posConnectors = [
              {name: 'POS Connector 1', cloudId: $scope.cloud.id},
              {name: 'POS Connector 2', cloudId: $scope.cloud.id, checkinInterval: 3000},
            ];
          }
        });
    }

    function getCloudResellerCount() {
      Reseller.count({filter: {where: {id: $stateParams.cloudId}}})
      .$promise
      .then(function(res) {
        $scope.totalResellers = res.count;
      });
    }

    function getClouds() {
      Cloud
        .find({
          filter: {
            fields: {id: true, name: true},
            order: 'name ASC'
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds    = [].concat(clouds);          
          
          // select the first by default
          if (!$stateParams.cloudId && clouds.length > 0) {
            $scope.selectCloud(clouds[0]);
          }
        });
    }

    if ($stateParams.cloudId) {
      getCloud();
      getCloudResellerCount();
    }
    getClouds();

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

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

    $scope.openResellerForm = function(event, cloud) {
      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog) {
                      $scope.newReseller = {
                        cloudId: cloud.id,
                        email: '',
                        password: ''
                      };
                      $scope.create = function() {
                        $scope.newReseller['cloudId'] = cloud.id;
                        Reseller.create($scope.newReseller)
                        .$promise
                        .then(function(reseller) {
                          getCloud();
                        }, function (res) {
                          toastr.error(res.data.error.message, 'Error');
                        });
                        $mdDialog.cancel();
                      };
                      $scope.cancel = function() {
                        $mdDialog.cancel();
                      };
        },
        templateUrl: 'views/resellerForm.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(result) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    }

    
  }]);
