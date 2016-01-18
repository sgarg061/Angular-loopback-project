angular
  .module('app')
  .controller('CustomerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'License', 'POSFilter', 'POSConnector', 'SoftwareVersion', '$mdDialog', 'toastr', 'userService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, License, POSFilter, POSConnector, SoftwareVersion, $mdDialog, toastr, userService) {

    $scope.clouds = [];
    $scope.resellers = [];
    $scope.customers = [];
    $scope.customer = {};
    $scope.devices = [];
    $scope.filters = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];

    $scope.cloud = null;
    $scope.reseller = null;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };
    $scope.markers = [];

    $scope.deviceData = {};

    $scope.sort = {
      column: '',
      descending: false
    };

    function watchForChanges() {
      // watch customer for updates and save them when they're found
      $scope.$watch("customer", function(newValue, oldValue) {

        if (newValue) {
          // only update on a specific subset of values that change through the UI
          var id = $scope.customer.id;

          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateCustomer(id, {checkinInterval: newValue.checkinInterval});
          }
          if (newValue.softwareVersionId !== oldValue.softwareVersionId) {
            updateCustomer(id, {softwareVersionId: newValue.softwareVersionId});
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateCustomer(id, {signallingServerUrl: newValue.signallingServerUrl});
          }
          if (newValue.customerName !== oldValue.customerName) {
            updateCustomer(id, {customerName: newValue.customerName});
          }
        }
      }, true);
    }

    function updateCustomer(id, changedDictionary) {
      Customer.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(customer) {}, function (res) {
          toastr.error(res.data.error.message, 'Error');
        });
    }

    function getCustomer() {
      Customer
        .find({
          filter: {
            where: {id: $stateParams.customerId},
            include: ['softwareVersion', {
                relation: 'licenses',
                scope: {
                  order: 'activated ASC, key ASC'
                }
            },
            {
                relation: 'reseller',
                scope: {
                  include: {
                    relation: 'cloud',
                    scope: {
                      order: 'name ASC'
                    }
                  }
                }
              },
              {
                relation: 'devices',
                scope: {
                  include: ['cameras', 'posDevices', 'license'],
                  order: 'name ASC'
                }
              }
            ]
          }
        })
        .$promise
        .then(function(customers) {
          $scope.customer = customers[0];

          $scope.reseller = customers[0].reseller;
          $scope.cloud = customers[0].reseller.cloud;

          $scope.cloud = customers[0].reseller.cloud;
          $scope.reseller = customers[0].reseller;

          $scope.devices = customers[0].devices;

          getFilters();

          watchForChanges();
           /*   
 -            Device status   
 -    
 -            green:    
 -              - all cameras are green   
 -              - all pos devices are green   
 -              - device has checked in within expected interval    
 -    
 -            yellow:   
 -              - one or more cameras or pos devices are red    
 -              - device has checked in within expected interval    
 -            red:    
 -              - device has not checked in within expected interval    
 -          */
          for (var i=0; i<$scope.devices.length; i++) {
            var device = $scope.devices[i];

            var lastCheckinTimeInSeconds = new Date(device.lastCheckin).getTime() / 1000;
             var nowInSeconds = new Date().getTime() / 1000;
 
             var checkinIntervalInSeconds = device.checkinInterval ||
                                           $scope.customer.checkinInterval ||
                                           $scope.customer.reseller.checkinInterval ||
                                           $scope.customer.reseller.cloud.checkinInterval;
 
             console.log('lastCheckin: ' + lastCheckinTimeInSeconds + ' now: ' + nowInSeconds + ' checkin interval: ' + checkinIntervalInSeconds);
 
             var gracePeriodInSeconds = 30;
             var hasCheckedInOnTime = (lastCheckinTimeInSeconds + checkinIntervalInSeconds + gracePeriodInSeconds) > nowInSeconds;
             if (hasCheckedInOnTime) {
               device.onlineStatus = 'Online';
             } else {
               device.onlineStatus = 'Offline';
             }
             console.log('hasCheckedInOnTime: ' + hasCheckedInOnTime);
 
             device.onlineCameraCount = 0;
             var allCamerasOnline = true;
             if (device.cameras) {
               for (var j=0; j<device.cameras.length; j++) {
                 var camera = device.cameras[j];
                 if (camera.status != 'online') {
                   allCamerasOnline = false;
                 } else {
                   device.onlineCameraCount++;
                 }
               }
             }
 
             if (hasCheckedInOnTime) {
               if (allCamerasOnline) {
                 device.status = 'green';
               } else {
                 device.status = 'yellow';
               }
             } else {
               device.status = 'red';
             }

           /* device.onlineCameraCount = device.cameras ? device.cameras.filter(function(c) {return c.status == 'online';}).length : 0;
            var allCamerasOnline = !device.cameras || device.onlineCameraCount == device.cameras.length;
            device.statusIconColor = device.status == 'online' ? (allCamerasOnline ? 'green' : 'yellow') : 'red';
            device.onlineStatus = device.status == 'online' ? 'Online' : 'Offline';*/

            // TODO: add marker here
            if (device.location) {
           //   var icon = 'assets/images/gmaps_marker_' + device.statusIconColor + '.png';*/
              var icon = 'assets/images/gmaps_marker_' + device.status + '.png';

              $scope.markers.push({
                id: device.id,
                icon: icon,
                latitude: device.location.lat,
                longitude: device.location.lng,
                showWindow: false,
                customerName: $scope.customer.name,
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
        });
    }

    function getFilters(){
      POSFilter
        .find({
          filter: {
            where: {
              or: [{'creatorId': $stateParams.customerId},{'creatorId': $scope.reseller.id},{'creatorId': $scope.cloud.id}]
            },
            include: {
              relation: 'connectors',
              scope: {
                where: {
                  or: [{'assigneeId': $stateParams.customerId},{'assigneeId': $scope.reseller.id}]
                }
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
            filter.selected = false;
            filter.owner = (filter.creatorType == 'customer'  || userService.getUserType() == 'solink');
            if (i > -1) {

              if (filter.connectors.length) {
                var index = filter.connectors.length - 1;

                filter.selected = (filter.connectors.length >= 2);

                if (filter.connectors[index].assigneeType == 'customer') {
                  filter.selected = true;                  
                  $scope.filters.push(filter);
                  filter.creatorType == 'customer' ? $scope.ownedFilters.push(filter) : $scope.cascadedFilters.push(filter)
                }
                else if (filter.connectors[index].assigneeType == 'reseller') {
                  $scope.filters.push(filter);  
                  filter.creatorType == 'customer' ? $scope.ownedFilters.push(filter) : $scope.cascadedFilters.push(filter)
                }
              }
              else if(filter.creatorType == 'customer'){
                $scope.filters.push(filter);      
                  filter.creatorType == 'customer' ? $scope.ownedFilters.push(filter) : $scope.cascadedFilters.push(filter)          
              }
            };
            
          }
        })
    }
    
    getCustomer();
    getSoftwareVersions();

    $scope.loadFilters = function(owner){

      var sortedFilters = $scope.filters.filter(function (el) {
        return el.owner == owner;
      })

      return sortedFilters;
    }

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

    var convArrToObj = function(array){
      var thisEleObj = new Object();
      if(typeof array == "object"){
        for(var i in array){
          var thisEle = convArrToObj(array[i]);
          thisEleObj[i] = thisEle;
        }
      } else {
        thisEleObj = array;
      }
      return thisEleObj;
    }

    function showLicense(aLicense) {
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'views/licenseShowForm.tmpl.html',
        controller: function (scope, $mdDialog) {
          scope.license = aLicense;
          scope.close = function() {
            $mdDialog.cancel();
          }
          scope.activateLicense = function() {
            License.activate({key: scope.license.key})
              .$promise
              .then(function(activationResult) {

                var licenseIndex = $scope.customer.licenses.indexOf(scope.license);

                if (~licenseIndex) {
                  $scope.customer.licenses[licenseIndex].activated = true;
                  $scope.customer.licenses[licenseIndex].username = activationResult.username;
                  $scope.customer.licenses[licenseIndex].password = activationResult.password;
                  $scope.customer.licenses[licenseIndex].deviceId = activationResult.deviceId;
                }

                // update device list
                getCustomer();

              }, function(err) {
                console.log('activated license error: ' + err);
            });
            $mdDialog.cancel();
          }
          $scope.revokeLicense = function() {
            console.log('revoking license: ' + scope.license);
            $mdDialog.cancel();
          }
        }
      });
    }

    function addLicense(customerId) {
      $mdDialog.show({
        controller: function (scope, $mdDialog) {
          scope.quantity = 0;
          scope.created = false;
          scope.licenseKeys = [];
          scope.licenseKeyList = "";
          scope.create = function() {

            async.times(scope.quantity, function(n, next){
              License.create({customerId: customerId})
                .$promise
                .then(function(license) {
                  $scope.customer.licenses.push(license);
                  // add to the list on screen and to the string that might be copied to the clipboard
                  scope.licenseKeys.push(license.key);
                  scope.licenseKeyList += license.key + "\n";

                  next(undefined, license)
                }, function(err) {
                  next(err);
                })
              }, function(err, users) {
                scope.created = true;
            });

          };

          scope.cancel = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'views/licenseCreateForm.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
      })
      .then(function(result) {
      });
    }

  function deleteCustomer(customer) {
    $mdDialog.show({
        controller: function (scope, $mdDialog) {
         scope.customerName = '';

          scope.deleteCustomer = function() {

            if (scope.customerName === customer.name) {
              Customer.deleteById({id: customer.id})
                .$promise
                .then(function(result) {
                  $mdDialog.cancel();
                  $scope.selectReseller($scope.resellerId);
                  toastr.info('Customer ' + customer.name + ' deleted');
                }, function(err) {
                  $mdDialog.cancel();
                  toastr.error('Unable to delete customer: ' + err.data.error.message);
                });
            } else {
              toastr.info('Customer not deleted - name did not match "' + customer.name + '"');
              $mdDialog.cancel();
            }
          };

          scope.close = function() {
            $mdDialog.cancel();
          };

        },
        templateUrl: 'views/customerDelete.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
     })
      .then(function(result) {
      });
  }

 function renameCustomer(customer) {
    $mdDialog.show({
        controller: function (scope, $mdDialog) {
          
          scope.renameCustomer = function() {
              Customer.prototype$updateAttributes({id: customer.id}, {
                name: scope.customerRename
              })
              .$promise
              .then
              (function(customer) 
                {
                  $scope.customer.name = scope.customerRename
                }, 
                function (res) 
                {
                  toastr.error(res.data.error.message, 'Error');
                }
              );
            $mdDialog.cancel();
            toastr.info('Successful customer renaming to ' + scope.customerRename + ".");
            $scope.selectCustomer($scope.customerId)
          };

        },
        templateUrl: 'views/customerRename.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:false
     })
      .then(function(result) {
      });
  }

  function showCheckin(anEntry) {
    console.log('show checkin entry: ' + JSON.stringify(anEntry));
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'views/device_checkin_entry.tmpl.html',
      controller: function (scope, $mdDialog) {
        scope.entry = anEntry;
        scope.close = function() {
          $mdDialog.cancel();
        }
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
      })
  }

  // TODO: refactor these permissions
  // so much code replication :/
  $scope.canModifyEventUrl = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  };

  $scope.canModifyImageServerUrl = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  };

  $scope.canModifyImageServerUrl = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  };

  $scope.canModifyCheckinInterval = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  };

  $scope.canModifySoftwareVersion = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  };

  $scope.canModifySignallingServer = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  function goHome() {
      $state.go('home');
  }

  $scope.setDeviceStatusStyling = function(device) {
    switch (device.onlineStatus) {
      case 'Offline':
        return {color: '#D10F0F'};
        break;
      case 'Online':
        return {color: '#18D348'};
        break;
      default:
        return {color: '#F4DB2A'};
    }
  }

  $scope.setCameraStatusStyling = function(device) {
    var error = {color: '#D10F0F'};
    var warning = {color: '#F4DB2A'};
    var good = {color: '#18D348'};

    if (!device.cameras || device.cameras.length < 1) {
      return error;
    }

    var onlineCameras = device.cameras.filter(function (cam) {
      return cam.status === 'online';
    });

    var percentageOfOnlineCameras = onlineCameras.length/device.cameras.length;
    if (percentageOfOnlineCameras === 1) {
      return good;
    } else if (percentageOfOnlineCameras > 0.5) {
      return warning;
    } else {
      return error;
    }
  }

  $scope.changeSorting = function(column) {
    var sort = $scope.sort;

    if (sort.column === column) {
      sort.descending = !sort.descending;
    } else {
      sort.column = column;
      sort.descending = false;
    }
  };

  $scope.selectConnector = function(connector) {
  };

  $scope.addFilter = function(connector) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
                    $scope.newFilter = {
                      name: '',
                      script: '',
                      owner: true

                    };
                    $scope.create = function() {
                      var script = JSON.stringify($scope.newFilter.script);
                        POSFilter.create({
                          id: '',
                          name: $scope.newFilter.name,
                          description: $scope.newFilter.description,
                          script: script,
                          creatorId: $stateParams.customerId,
                          creatorType: 'customer' 
                        })
                      .$promise
                      .then(function(customer) {
                        getFilters();
                      }, function (res) {
                        toastr.error(res.data.error.message, 'Error');
                      });
                      $mdDialog.hide();
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
        $scope.create = function() {
          var script = JSON.stringify($scope.newFilter.script);
          POSFilter.prototype$updateAttributes({id: filter.id}, {
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


    $scope.filterChanged = function (filter) {
      if (filter.selected) {
        POSConnector.create({
          assigneeId: $stateParams.customerId,
          filterId: filter.id,
          assigneeType: 'customer'
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
          for(var i in filter.connectors){
            var connector = filter.connectors[i];
            if (connector.assigneeType == 'customer') {
              deleteConnectorById(connector.id);
            };
          }
        }
      }
    };


    function deleteConnectorById (id) {
      POSConnector.deleteById({id: id})
      .$promise
      .then(function(data) {
        toastr.success('Unassigned filter successfully!', 'Filter Unassigned')
      }, function (res) {
        toastr.error(res.data.error.message, 'Error');
      });
    }


  $scope.showLicense = showLicense;
  $scope.addLicense = addLicense;
  $scope.deleteCustomer = deleteCustomer;
  $scope.renameCustomer = renameCustomer;
  $scope.showCheckin = showCheckin;
  $scope.goHome = goHome;

}]);
