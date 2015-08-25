angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', '$mdDialog', 'toastr',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, $mdDialog, toastr) {

    $scope.clouds = [ ];
    $scope.reseller = {};
    
    $scope.cloudId = null;
    $scope.resellerId = null;

    function watchForChanges() {
      // watch reseller for updates and save them when they're found
      $scope.$watch("reseller", function(newValue, oldValue) {
        if (newValue) {
          Reseller.prototype$updateAttributes({ id: $scope.reseller.id }, $scope.reseller)
            .$promise.then(function(reseller) {}, function (res) {
              toastr.error(res.data.error.message, 'Error');
          });
        }
      }, true);
    }

    function getReseller() {
      Reseller
        .find({
          filter: {
            where: {id: $stateParams.resellerId},
            include: ['cloud', 'softwareVersion', 'posConnectors', {
              relation: 'customers',
              scope: {
                order: 'name ASC'
              }
            }]
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.reseller = resellers[0];

          $scope.cloudId = resellers[0].cloud.id;
          $scope.resellerId = resellers[0].id;

          watchForChanges();

          getCloudResellers(resellers[0].cloud.id);

          // console.log('$scope.reseller: ' + JSON.stringify($scope.reseller));
        });
    }

    function getAllClouds() {
      Cloud
        .find({
          filter: {
            fields: {id: true, name: true},
            include: {
              relation: 'resellers',
              scope: {
                fields: {id: true, name: true},
              }
            }
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds = clouds;
          // console.log('$scope.clouds: ' + JSON.stringify($scope.clouds));
        });
    }

    function getCloudResellers(cloudId) {
      // console.log('*** finding resellers for cloud: ' + cloudId); 
      Reseller
        .find({
          filter: {
            fields: {id: true, name: true},
            where: {cloudId: cloudId}
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.resellers = resellers;
          // console.log('*** $scope.resellers: ' + JSON.stringify($scope.resellers));
        });
    }

    getReseller();
    getAllClouds();


    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }

    $scope.selectCloud = function(cloud) {
      $state.go('cloud', {cloudId: (typeof cloud  === 'string') ? cloud : cloud.id}, {reload: true});
    }

    $scope.selectCustomer = function(customer) {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : customer.id}, {reload: true});
    }

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
    }
   
    $scope.openCustomerForm = function(event, reseller) {
      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog) {
                      $scope.newCustomer = {
                        resellerId: reseller.id,
                        name: '',
                      };
                      $scope.create = function() {
                        $scope.newCustomer['resellerId'] = reseller.id;
                        Customer.create($scope.newCustomer)
                        .$promise
                        .then(function(customer) {
                          getReseller();
                        }, function (res) {
                          toastr.error(res.data.error.message, 'Error');
                        });
                        $mdDialog.cancel();
                      };
                      $scope.cancel = function() {
                        $mdDialog.cancel();
                      };
        },
        templateUrl: 'views/customerForm.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
      });
    }

  }]);
