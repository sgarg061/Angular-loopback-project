angular
  .module('app')
  .controller('HomeController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', '$mdDialog', 'toastr', 'SoftwareVersion', 'userService',
    function($scope, $state, $stateParams, Cloud, Reseller, $mdDialog, toastr, SoftwareVersion, userService) {

    $scope.currentResellerPage = 0;
    $scope.resellersPerPage = 1000; // FIXME
    $scope.totalResellers = 0;

    $scope.clouds = [];
    $scope.cloudId = null;

    $scope.softwareVersions = [];

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
        });
    }

    function getSoftwareVersions() {
      SoftwareVersion
        .find({
          filter: {
            fields: {id: true, name: true, url: true},
            order: 'name ASC'
          }
        })
        .$promise
        .then(function(versions) {
          $scope.softwareVersions = [].concat(versions);
          console.log($scope.softwareVersions);
        })
    }

    function redirectBasedOnUserType() {
      var userType = userService.getUserType();
      switch (userType) {
        case 'solink':
          return;
          break;
        case 'cloud':
          $state.go('cloud', {cloudId: userService.getCloudId()}, {reload: true});
          break;
        case 'reseller':
          $state.go('reseller', {resellerId: userService.getResellerId()}, {reload: true});
          break;
        default:
          $state.go('logout', {}, {reload: true});
          break;
      }
    }

    if (userService.getUserType() !== 'solink') {
      redirectBasedOnUserType();
    } else {
      getClouds();
      getSoftwareVersions();
    }

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }

    $scope.selectCloud = function(cloud) {
      if (typeof cloud == 'string') {
        $scope.cloud = $scope.clouds.filter(function (c) {
          return c.id === cloud;
        })[0];
      } else {
        $scope.cloud = cloud;
      }
      $state.go('cloud', {cloudId: cloud.id}, {reload: true});
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

  $scope.canModifyEventServer = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  }

    
  }]);
