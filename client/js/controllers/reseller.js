angular
  .module('app')
  .controller('ResellerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'POSFilter', 'POSConnector', 'SearchFilter', 'SearchFilterConnector', 'SoftwareVersion', '$mdDialog', 'toastr', 'userService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, POSFilter, POSConnector, SearchFilter, SearchFilterConnector, SoftwareVersion, $mdDialog, toastr, userService) {

    $scope.reseller = {};

    $scope.resellerId = null;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };
    $scope.markers = [];
    $scope.filters = [];
    $scope.reports = [];

    $scope.children = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];

    $scope.cascadedReports = [];
    $scope.ownedReports = [];
    

    function watchForChanges() {
      // watch reseller for updates and save them when they're found
      $scope.$watch("reseller", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.reseller.id;
          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateReseller(id, {eventServerUrl: newValue.eventServerUrl});
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateReseller(id, {imageServerUrl: newValue.imageServerUrl});
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateReseller(id, {signallingServerUrl: newValue.signallingServerUrl});
          }
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateReseller(id, {checkinInterval: newValue.checkinInterval});
          }
          if (newValue.softwareVersionId !== oldValue.softwareVersionId) {
            updateReseller(id, {softwareVersionId: newValue.softwareVersionId});
          }
        }
      }, true);
    }

    function updateReseller(id, changedDictionary) {
      Reseller.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(reseller) {}, function (res) {
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


          $scope.reseller = resellers[0];

          $scope.cloudId = resellers[0].cloud.id;
          $scope.cloud = resellers[0].cloud;
          $scope.resellerId = resellers[0].id;

          $scope.children = $scope.reseller.customers;


          getFilters();
          getReports();

          watchForChanges();

          if ($scope.reseller.customers) {
            for (var i=0; i<$scope.reseller.customers.length; i++) {
              var customer = $scope.reseller.customers[i];
              if (customer.devices) {
                for (var j=0; j<customer.devices.length; j++) {
                  var device = customer.devices[j];
                  if (device.location) {
                    // get device status
                     /*
                       Device status
 
                       green:
                         - all cameras are green
                         - device has checked in within expected interval
 
                       yellow:
                         - one or more cameras are red
                         - device has checked in within expected interval
                       red:
                         - device has not checked in within expected interval
                     */
                     var checkinIntervalInSeconds = device.checkinInterval ||
                       customer.checkinInterval ||
                       $scope.reseller.checkinInterval ||
                       $scope.cloud.checkinInterval;
 
                     var lastCheckinTimeInSeconds = new Date(device.lastCheckin).getTime() / 1000;
                     var nowInSeconds = new Date().getTime() / 1000;
 
                     var gracePeriodInSeconds = 30;
                     var hasCheckedInOnTime = (lastCheckinTimeInSeconds + checkinIntervalInSeconds + gracePeriodInSeconds) > nowInSeconds;
 
                     var allCamerasOnline = true;
                     if (device.cameras) {
                       for (var k = 0; k < device.cameras.length; k++) {
                         var camera = device.cameras[k];
                         if (camera.status != 'online') {
                           allCamerasOnline = false;
                           break;
                         }
                       }
                     }

                   // var allCamerasOnline = !device.cameras || device.cameras.every(function(c) {return c.status == 'online';});
                   // device.statusIconColor = device.status == 'online' ? (allCamerasOnline ? 'green' : 'yellow') : 'red';

                   if (hasCheckedInOnTime) {
                       if (allCamerasOnline) {
                         device.status = 'green';
                       } else {
                         device.status = 'yellow';
                       }
                     } else {
                       device.status = 'red';
                     }
                     var icon = 'assets/images/gmaps_marker_' + device.status + '.png';
                    //var icon = 'assets/images/gmaps_marker_' + device.statusIconColor + '.png';

                    $scope.markers.push({
                      id: device.id,
                      icon: icon,
                      latitude: device.location.lat,
                      longitude: device.location.lng,
                      showWindow: false,
                      customerName: customer.name,
                      deviceName: device.name,
                      deviceId: device.id,
                      options: {
                        labelAnchor: "22 0",
                        labelClass: "marker-labels"
                      },
                      selectDevice: $scope.selectDevice
                    });
                  }
                }
              }
            }
          }
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
          $scope.defaultSoftwareVersion = $scope.softwareVersions.filter(currentSoftwareVersion)[0]; //filtering versions for one that matches the cloud version for default
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
      marker.showWindow = true;
      $scope.$apply();
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
      })
      .then(function(result) {
      }, function() {
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
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
                    $scope.newFilter = {
                      name: '',
                      script: '',
                      owner: true,
                      $title: 'Connector'
                    };
                    $scope.create = function() {
                      var script = JSON.stringify($scope.newFilter.script);
                      POSFilter.create({
                        id: '',
                        name: $scope.newFilter.name,
                        description: $scope.newFilter.description,
                        script: script,
                        creatorId: $stateParams.resellerId,
                        creatorType: 'reseller' 
                      })
                      .$promise
                      .then(function(customer) {
                        getFilters();
                      }, function (res) {
                        toastr.error(res.data.error.message, 'Error');
                      });
                      $mdDialog.cancel();
                    };
                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  };

  $scope.actionFilter = function(filter) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
        $scope.newFilter = filter

        if (!$scope.newFilter.parsed_script){
          try {
            $scope.newFilter.script = JSON.parse(filter.script)
          }
          catch(err){
            $scope.newFilter.script = filter.script
          }
          
          $scope.newFilter.parsed_script = true
        }

        $scope.newFilter.$edit = true
        $scope.newFilter.$title = 'Connector'
        $scope.create = function() {
          var script = JSON.stringify($scope.newFilter.script);
          POSFilter.prototype$updateAttributes({id: filter.id},
          {
            name: $scope.newFilter.name,
            description: $scope.newFilter.description,
            script: script
          })
          .$promise
          .then(function(customer) {
            getFilters();
          }, function (res) {
            toastr.error(res.data.error.message, 'Error');
          });
          $mdDialog.cancel();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.destroy = function() {
          var confirm = $mdDialog.confirm()
            .title('Delete Filter')
            .content('Are you sure you want to delete filter ' + $scope.newFilter.name + '?')
            .ok('Yes')
            .cancel('No');

          $mdDialog.show(confirm).then(function() {
            POSFilter.deleteById($scope.newFilter)
              .$promise
              .then(function(customer) {
                getFilters();
              }, function (res) {
                toastr.error(res.data.error.message, 'Error');
              });
          });


        };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  };
   

  $scope.addReport = function(connector) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
                    $scope.newFilter = {
                      name: '',
                      filter: '{}',
                      owner: true,
                      $title: 'Report'
                    };
                    $scope.create = function() {
                      try{
                        var script = JSON.parse($scope.newFilter.filter);
                      }
                      catch(err){
                        alert('invalid json object: ' +  err);
                      }
                      if (script) {
                        SearchFilter.create({
                          id: '',
                          name: $scope.newFilter.name,
                          description: $scope.newFilter.description,
                          filter: script,
                          creatorId: $stateParams.resellerId,
                          creatorType: 'reseller' 
                        })
                        .$promise
                        .then(function(customer) {
                          getReports();
                        }, function (res) {
                          toastr.error(res.data.error.message, 'Error');
                        });
                        $mdDialog.cancel();
                      }
                    };
                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  };

  $scope.actionReport = function(thisFilter) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
        $scope.newFilter = thisFilter

        // $scope.newFilter.filter = JSON.stringify(thisFilter.filter);

        $scope.newFilter.$edit = true
        $scope.newFilter.$title = 'Report'
        $scope.create = function() {

          try{
            var script = JSON.parse($scope.newFilter.filter);
          }
          catch(err){
            $scope.newFilter.filter.$error = {invalid: true};
            alert('Invalid json object: ' +  err);
          }

          if (script) {
            SearchFilter.prototype$updateAttributes({id: thisFilter.id},
            {
              name: $scope.newFilter.name,
              description: $scope.newFilter.description,
              filter: script
            })
            .$promise
            .then(function(customer) {
              getReports();
            }, function (res) {
              toastr.error(res.data.error.message, 'Error');
            });
            $mdDialog.cancel();
          }
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.destroy = function() {
          var confirm = $mdDialog.confirm()
            .title('Delete Filter')
            .content('Are you sure you want to delete filter ' + $scope.newFilter.name + '?')
            .ok('Yes')
            .cancel('No');

          $mdDialog.show(confirm).then(function() {
            SearchFilter.deleteById($scope.newFilter)
              .$promise
              .then(function(customer) {
                getReports();
              }, function (res) {
                toastr.error(res.data.error.message, 'Error');
              });
          });


        };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  }; 


    $scope.deleteReseller = deleteReseller;
    $scope.onMarkerClicked = onMarkerClicked;
    $scope.goHome = goHome;

  }]);
