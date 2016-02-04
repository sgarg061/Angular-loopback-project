angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'POSFilter', 'POSConnector', 'SearchFilter', 'SearchFilterConnector', 'SoftwareVersion', '$mdDialog', 'toastr', 'userService', 'filterService', 'softwareService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, POSFilter, POSConnector, SearchFilter, SearchFilterConnector, SoftwareVersion, $mdDialog, toastr, userService, filterService, softwareService) {


    $scope.reseller = {};

    $scope.resellerId = null;

    $scope.filters = [];
    $scope.reports = [];

    $scope.children = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];

    $scope.allDevices = [];
    $scope.cascadedReports = [];
    $scope.ownedReports = [];
    

    function watchForChanges() {
      // watch reseller for updates and save them when they're found
      $scope.$watch("reseller", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.reseller.id;
          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateReseller(id, {eventServerUrl: newValue.eventServerUrl}, 'Event server URL has been updated');
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateReseller(id, {imageServerUrl: newValue.imageServerUrl}, 'Image server URL has been updated');
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateReseller(id, {signallingServerUrl: newValue.signallingServerUrl}, 'Signalling server has been updated');
          }
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateReseller(id, {checkinInterval: newValue.checkinInterval}, 'Check in interval has been updated');
          }
          
        }
      }, true);
    }
    $scope.updateVersion = function (softwareVersion) {
      var id = $scope.reseller.id;
      softwareService.dialog(id,softwareVersion).then(function(result) {
        updateReseller(id, {softwareVersionId: softwareVersion}, 'Software version has been updated'); 
      }, function(result){getReseller();});
    }
    
    function updateReseller(id, changedDictionary, message) {
      Reseller.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(reseller) {toastr.info(' ' + message);}, 
          function (res) {
        toastr.error(res.data.error.message, 'Error');
      });
    }

    function getReseller(cb) {
      Reseller
        .find({
          filter: {
            where: {id: $stateParams.resellerId},
            include: ['cloud', 'softwareVersion', {
              relation: 'customers',
              scope: {
                order: 'name ASC',
                include: {
                  relation: 'devices',
                  scope: {
                    include: {
                      relation: 'cameras',
                      scope: {
                        fields: ['id', 'name', 'status']
                      }
                    }
                  }
                }
              }
            }]
          }
        })
        .$promise
        .then(function(resellers) {

          if(String(_.isEmpty(resellers)) === 'false'){
            $scope.reseller = resellers[0];

            $scope.cloudId = resellers[0].cloud.id;
            $scope.cloud = resellers[0].cloud;
            $scope.resellerId = resellers[0].id;
            $scope.currentSoftwareVersion = resellers[0].softwareVersionId;

          getFilters();
          getReports();

          watchForChanges();

          // get all devices
          $scope.reseller.customers.forEach(function (customer) {
            customer.devices.forEach(function (device) {
              device.customerName = customer.name;
              device.checkinInterval = device.checkinInterval ||
                 customer.checkinInterval ||
                 $scope.reseller.checkinInterval ||
                 $scope.cloud.checkinInterval;

              $scope.allDevices.push(device);
            });
          });
          if (cb){
            cb();
          }
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

          //Getting the default software version name
          function currentSoftwareVersion(testVersion){ //used in filter
            return testVersion.id === $scope.cloud.softwareVersionId;
          }
          $scope.defaultSoftwareVersion = null; //filtering versions for one that matches the cloud version for default
           
        })
    }

    function getFilters(){
      POSFilter
        .find({
          filter: {
            where: {
              or: [{'creatorId': $stateParams.resellerId},{'creatorId': $scope.cloudId}]
            },
            include: {
              relation: 'connectors',
              scope: {
                where: {assigneeId: $stateParams.resellerId}
              }
            }
          }
        })
        .$promise
        .then(function(connectors) {
          $scope.filters = [];
          $scope.cascadedFilters = [];
          $scope.ownedFilters = [];


          for(var i in connectors){
            var filter = connectors[i];
            if (i > -1) {
              filter.selected = (filter.connectors.length > 0)
              filter.owner = (filter.creatorType == 'reseller');
              $scope.filters.push(filter);

              filter.creatorType == 'reseller' ? $scope.ownedFilters.push(filter) :$scope.cascadedFilters.push(filter)
            };

          }
        })
    }

    
    function getReports(){
      SearchFilter
        .find({
          filter: {
            where: {
              or: [{'creatorId': $stateParams.resellerId},{'creatorId': $scope.cloudId}]
            },
            include: {
              relation: 'connectors',
              scope: {
                where: {assigneeId: $stateParams.resellerId}
              }
            }
          }
        })
        .$promise
        .then(function(filters) {
          $scope.reports = [];
          $scope.ownedReports = [];
          $scope.cascadedReports = [];
          for(var i in filters){
            var filter = filters[i];
            filter.filter = JSON.stringify(filter.filter);
            if (i > -1) {
              filter.selected = (filter.connectors.length > 0)
              filter.owner = (filter.creatorType == 'reseller');
              $scope.reports.push(filter);

              filter.creatorType == 'reseller' ? $scope.ownedReports.push(filter) : $scope.cascadedReports.push(filter)
            };
          }
        })

    }


    getReseller(function(){
      getSoftwareVersions();
    });


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
      });
    }

    function goHome() {
      $state.go('home');
    }

    $scope.selectConnector = function(connector){
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
      });
    }

    $scope.filterChanged = function (filter) {
      if (filter.selected) {
        POSConnector.create({
          filterId: filter.id,
          assigneeId: $stateParams.resellerId,
          assigneeType: 'reseller'
        })
        .$promise
        .then(function(data) {
          filter.connectors.push(data)
          toastr.success('Assigned filter successfully!', 'Filter Assigned')
        }, function (res) {
          toastr.error(res.data.error.message, 'Error');
        });
      }
      else{
        if (filter.connectors.length) {
          deleteConnectorById(filter.connectors[0].id);
        }
      }
    }

    function deleteConnectorById (id) {
      POSConnector.deleteById({id: id})
      .$promise
      .then(function(data) {
        toastr.success('Unassigned filter successfully!', 'Filter Unassigned')
      }, function (res) {
        toastr.error(res.data.error.message, 'Error');
      });
    }


    $scope.reportChanged = function (filter) {
      if (filter.selected) {
        SearchFilterConnector.create({
          filterId: filter.id,
          assigneeId: $stateParams.resellerId,
          assigneeType: 'reseller'
        })
        .$promise
        .then(function(data) {
          filter.connectors.push(data)
          toastr.success('Assigned filter successfully!', 'Filter Assigned')
        }, function (res) {
          toastr.error(res.data.error.message, 'Error');
        });
      }
      else{
        if (filter.connectors.length) {
          deletesearchFilterById(filter.connectors[0].id);
        }
      }
    }

    function deletesearchFilterById (id) {
      SearchFilterConnector.deleteById({id: id})
      .$promise
      .then(function(data) {
        toastr.success('Unassigned filter successfully!', 'Filter Unassigned')
      }, function (res) {
        toastr.error(res.data.error.message, 'Error');
      });
    }


    $scope.addFilter = function(connector) {
      filterService.addFilter('reseller', $stateParams.resellerId, function(){
        getFilters();
      });
    };

    $scope.actionFilter = function(filter) {
      filterService.actionFilter(filter, function(){
        getFilters();
      });
    };
     

    $scope.addReport = function(connector) {
      filterService.addReport('reseller', $stateParams.resellerId, function(){
        getReports();
      });
    };

    $scope.actionReport = function(filter) {
      filterService.actionReport(filter, function(){
        getReports();
      });
    }; 
    $scope.deleteReseller = deleteReseller;
    $scope.goHome = goHome;

  }]);
