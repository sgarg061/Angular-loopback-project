angular
  .module('app')
  .controller('CustomerController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'License', 'POSFilter', 'POSConnector','SearchFilter', 'SearchFilterConnector', 'SoftwareVersion', '$mdDialog', 'toastr', 'userService', 'filterService', 'softwareService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, License, POSFilter, POSConnector, SearchFilter, SearchFilterConnector, SoftwareVersion, $mdDialog, toastr, userService, filterService, softwareService) {


    $scope.clouds = [];
    $scope.resellers = [];
    $scope.customers = [];
    $scope.customer = {};
    $scope.devices = [];
    $scope.filters = [];
    $scope.reports = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];

    $scope.cascadedReports = [];
    $scope.ownedReports = [];
    
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
            updateCustomer(id, {checkinInterval: newValue.checkinInterval}, 'Check in interval has been updated');
          }
          
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateCustomer(id, {signallingServerUrl: newValue.signallingServerUrl}, 'Signalling server has been updated');
          }
          if (newValue.customerName !== oldValue.customerName) {
            updateCustomer(id, {customerName: newValue.customerName}, 'Check in interval has been updated');
          }
        }
      }, true);
    }

    function updateCustomer(id, changedDictionary, message) {
      Customer.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(customer) {toastr.info(' ', message);}, 
          function (res) {
          toastr.error(res.data.error.message, 'Error');
        });
    }
    $scope.updateVersion = function (newValueSoftwareVersionId) {
      var id = $scope.customer.id;
      softwareService.dialog(id,newValueSoftwareVersionId).then(function(result) {
       updateCustomer(id, {softwareVersionId: newValueSoftwareVersionId}, 'Software version has been updated');
      }, function(result){getCustomer();});
    }

    function getCustomer(cb) {
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
          if(String(_.isEmpty(customers)) === 'false'){
            $scope.customer = customers[0];

            $scope.reseller = customers[0].reseller;
            $scope.cloud = customers[0].reseller.cloud;

            $scope.cloud = customers[0].reseller.cloud;
            $scope.reseller = customers[0].reseller;
            $scope.currentSoftwareVersion = customers[0].softwareVersionId;

            $scope.devices = customers[0].devices;
          } else {
            toastr.error('invalid array');
          }

          getFilters();
          getReports();


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
          if(cb){
            cb();
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


          connectors.forEach(function(filter, i){
            filter.selected = false;
            filter.owner = (filter.creatorType == 'customer');
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
            
          })
        })
    }
    
    function getReports(){
      SearchFilter
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
          $scope.reports = [];
          $scope.ownedReports = [];
          $scope.cascadedReports = [];
          

          connectors.forEach(function(filter, i){
            filter.filter = JSON.stringify(filter.filter);
            filter.selected = false;
            filter.owner = (filter.creatorType == 'customer');
            if (i > -1) {

              if (filter.connectors.length) {
                var index = filter.connectors.length - 1;

                filter.selected = (filter.connectors.length >= 2);

                if (filter.connectors[index].assigneeType == 'customer') {
                  filter.selected = true;                  
                  $scope.reports.push(filter);
                  filter.creatorType == 'customer' ? $scope.ownedReports.push(filter) : $scope.cascadedReports.push(filter)
                }
                else if (filter.connectors[index].assigneeType == 'reseller') {
                  $scope.reports.push(filter);  
                  filter.creatorType == 'customer' ? $scope.ownedReports.push(filter) : $scope.cascadedReports.push(filter)
                }
              }
              else if(filter.creatorType == 'customer'){
                $scope.reports.push(filter);      
                  filter.creatorType == 'customer' ? $scope.ownedReports.push(filter) : $scope.cascadedReports.push(filter)          
              }
            };
            
          })
        })
    }

    getCustomer(function(){
      getSoftwareVersions();
    });

    $scope.loadFilters = function(owner){

      var sortedFilters = $scope.filters.filter(function (el) {
        return el.owner == owner;
      })

      return sortedFilters;
    }

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : $scope.reseller.id}, {reload: true});
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

    $scope.selectCustomer = function() {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : $scope.customer.id}, {reload: true});
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
                  $scope.customer.licenses[licenseIndex].activationDate = new Date();
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
                  toastr.success('Successful customer renaming to ' + scope.customerRename + ".");
                  $scope.selectCustomer()
                }, 
                function (res) 
                {
                  toastr.error('Error');
                  console.log('FOO' + res.data.error.message);
                }
              );
            $mdDialog.cancel();
          };

          scope.close = function() {
            $mdDialog.cancel();
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

        //Getting the default software version name
        function currentSoftwareVersion(testVersion){ //used in filter
            return (testVersion.id===$scope.reseller.softwareVersionId || 
                    testVersion.id===$scope.cloud.softwareVersionId);
        }
        $scope.defaultSoftwareVersion=$scope.softwareVersions.filter(currentSoftwareVersion)[0]; //filtering versions for one that matches the most immediate parent version for default
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

  $scope.reportChanged = function (filter) {
    if (filter.selected) {
      SearchFilterConnector.create({
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
            deleteSearchFilterById(connector.id);
          };
        }
      }
    }
  };



  function deleteSearchFilterById (id) {
    SearchFilterConnector.deleteById({id: id})
    .$promise
    .then(function(data) {
      toastr.success('Unassigned filter successfully!', 'Filter Unassigned')
    }, function (res) {
      toastr.error(res.data.error.message, 'Error');
    });
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



  $scope.addFilter = function(connector) {
    filterService.addFilter('customer', $stateParams.customerId, function(){
      getFilters();
    });
  };

  $scope.actionFilter = function(filter) {
    filterService.actionFilter(filter, function(){
      getFilters();
    });
  };
   

  $scope.addReport = function(connector) {
    filterService.addReport('customer', $stateParams.customerId, function(){
      getReports();
    });
  };

  $scope.actionReport = function(filter) {
    filterService.actionReport(filter, function(){
      getReports();
    });
  }; 

  $scope.showLicense = showLicense;
  $scope.addLicense = addLicense;
  $scope.deleteCustomer = deleteCustomer;
  $scope.renameCustomer = renameCustomer;
  $scope.showCheckin = showCheckin;
  $scope.goHome = goHome;

}]);
