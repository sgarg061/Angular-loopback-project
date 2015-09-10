angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', '$mdDialog', 'toastr', 'userService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, $mdDialog, toastr, userService) {

    $scope.reseller = {};
    
    $scope.resellerId = null;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };
    $scope.markers = [];

    function watchForChanges() {
      // watch reseller for updates and save them when they're found
      $scope.$watch("reseller", function(newValue, oldValue) {
        if (newValue) {
          if (!angular.equals(newValue, oldValue)) {
            Reseller.prototype$updateAttributes({ id: $scope.reseller.id }, $scope.reseller)
              .$promise.then(function(reseller) {}, function (res) {
                toastr.error(res.data.error.message, 'Error');
            });
          }
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
                order: 'name ASC',
                include: {
                  relation: 'devices',
                  scope: {
                    fields: {id: true, name: true, location: true}
                  }
                }
              }
            }]
          }
        })
        .$promise
        .then(function(resellers) {
          $scope.reseller = resellers[0];

          $scope.cloudId = resellers[0].cloud.id;
          $scope.cloud = resellers[0].cloud;
          $scope.resellerId = resellers[0].id;

          watchForChanges();


          if ($scope.reseller.customers) {
            for (var i=0; i<$scope.reseller.customers.length; i++) {
              var customer = $scope.reseller.customers[i];
              if (customer.devices) {
                for (var j=0; j<customer.devices.length; j++) {
                  var device = customer.devices[j];
                  // console.log('device name: ' + device.name + " location: " + device.location);
                  if (device.location) {
                    $scope.markers.push({
                      id: device.id,
                      icon: 'assets/images/map_marker_28x40.png',
                      latitude: device.location.lat,
                      longitude: device.location.lng,
                      showWindow: false,
                      customerName: customer.name,
                      deviceName: device.name,
                      deviceId: device.id,
                      options: {
                        labelContent: customer.name,
                        labelAnchor: "22 0",
                        labelClass: "marker-labels"
                      }
                    });
                  }
                }
              }
            }
          }
          // console.log('$scope.reseller: ' + JSON.stringify($scope.reseller));
        });
    }

    getReseller();


    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }


    $scope.selectCloud = function(cloud) {
      if (['solink', 'cloud'].indexOf(userService.getUserType()) > -1) {
        $scope.cloud = cloud;
        $state.go('cloud', {cloudId: (typeof cloud  === 'string') ? cloud : cloud.id}, {reload: true});
      } else {
        // if not a cloud or solink user, stick around at the reseller page.
        $scope.selectReseller($scope.reseller);
      }
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

  $scope.canModifyEventUrl = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud'].indexOf(userType) > -1;
  };

  $scope.canModifyImageServerUrl = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud'].indexOf(userType) > -1;
  };

  $scope.canModifyCheckinInterval = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud'].indexOf(userType) > -1;
  };

  $scope.canModifySoftwareVersion = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud'].indexOf(userType) > -1;
  };

  $scope.canModifySignallingServer = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  function deleteReseller(reseller) {
    console.log('delete reseller: ' + JSON.stringify(reseller));
    $mdDialog.show({
        controller: function (scope, $mdDialog) {
          scope.resellerName = '';

          scope.deleteReseller = function() {

            if (scope.resellerName === reseller.name) {
              Reseller.deleteById({id: reseller.id})
                .$promise
                .then(function(result) {
                  $mdDialog.cancel();
                  $scope.selectCloud($scope.cloudId);
                  toastr.info('Reseller ' + reseller.name + ' deleted');
                }, function(err) {
                  $mdDialog.cancel();
                  toastr.error('Unable to delete reseller: ' + err.data.error.message);
                });
            } else {
              toastr.info('Reseller not deleted - name did not match "' + reseller.name + '"');
              $mdDialog.cancel();
            }
          };

          scope.close = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'views/resellerDelete.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
      })
      .then(function(result) {
      });
    }

    function onMarkerClicked(marker) {
      console.log("marker clicked");
      marker.showWindow = true;
      $scope.$apply();
    }

    function goHome() {
      $state.go('home');
    }

    $scope.deleteReseller = deleteReseller;
    $scope.onMarkerClicked = onMarkerClicked;
    $scope.goHome = goHome;

  }]);
