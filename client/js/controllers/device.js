angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Device', 'SoftwareVersion', 'DeviceLogEntry', 'userService', '$mdDialog', '$localStorage',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, Device, SoftwareVersion, DeviceLogEntry, userService, $mdDialog, $localStorage) {

    $scope.customer = {};

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;
    $scope.device = null;

    $scope.checkinHeight = 500;

    $scope.logDataLimit = 100;
    $scope.sendingCheckin = null;
    $scope.isSavingSettings = false;

    function watchForChanges() {
      // watch device for updates and save them when they're found
      $scope.$watch("device", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.device.id;
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateDevice(id, {checkinInterval: newValue.checkinInterval});
          }
          if (newValue.softwareVersionId !== oldValue.softwareVersionId) {
            updateDevice(id, {softwareVersionId: newValue.softwareVersionId});
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateDevice(id, {signallingServerUrl: newValue.signallingServerUrl});
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateDevice(id, {imageServerUrl: newValue.imageServerUrl});
          }
          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateDevice(id, {eventServerUrl: newValue.eventServerUrl});
          }
        }
      }, true);
    }

    function updateDevice(id, changedDictionary) {
      Device.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(device) {}, function (res) {
          toastr.error(res.data.error.message, 'Error');
        });
    }

    function getDevice(cb) {
      Device
        .find({
          filter: {
            where: {id: $stateParams.deviceId},
            include: ['softwareVersion', 'cameras', 'posDevices', 'license', {
              relation: 'customer',
              scope: {
                include: {
                  relation: 'reseller',
                  scope: {
                    include: {
                      relation: 'cloud'
                    }
                  }
                }
              }
            }, {
              relation: 'logEntries',
              scope: {
                fields: ['id','timestamp'],
                limit: $scope.logDataLimit,
                order: 'timestamp DESC'
              }
            }]
          }
        })
        .$promise
        .then(function(devices) {
          $scope.device = devices[0];

          $scope.device.loadingMore = false;
          $scope.device.logDataLimit = $scope.logDataLimit;

          if ($scope.device.logEntries.length) {
            $scope.showCheckin($scope.device.logEntries[0]);

            if ($scope.device.logEntries.length < $scope.logDataLimit) {
              $scope.device.noMoreLogs = true;
            }
            else{
              $scope.device.noMoreLogs = false;
            }

            $scope.checkinHeight = document.body.clientHeight - 450;
          };

          $scope.customer = devices[0].customer;
          $scope.reseller = devices[0].customer.reseller;
          $scope.cloud = devices[0].customer.reseller.cloud;

          watchForChanges();

          var device = $scope.device;

            var lastCheckinTimeInSeconds = new Date(device.lastCheckin).getTime() / 1000;
           var nowInSeconds = new Date().getTime() / 1000;
 
           var checkinIntervalInSeconds = device.checkinInterval ||
                                         $scope.customer.checkinInterval ||
                                         $scope.customer.reseller.checkinInterval ||
                                         $scope.customer.reseller.cloud.checkinInterval;
 
           console.log('lastCheckin: ' + lastCheckinTimeInSeconds + ' now: ' + nowInSeconds + ' checkin interval: ' + checkinIntervalInSeconds);
 
           var gracePeriodInSeconds = 30;
           var hasCheckedInOnTime = (lastCheckinTimeInSeconds + checkinIntervalInSeconds + gracePeriodInSeconds) > nowInSeconds;
           console.log('hasCheckedInOnTime: ' + hasCheckedInOnTime);
 
           var allCamerasOnline = true;
           if (device.cameras) {
             for (var j=0; j<device.cameras.length; j++) {
               var camera = device.cameras[j];
               if (camera.status != 'online') {
                 allCamerasOnline = false;
                 break;
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
  //        var allCamerasOnline = !device.cameras || device.cameras.every(function(c) {return c.status == 'online';});
    //      device.statusIconColor = device.status == 'online' ? (allCamerasOnline ? 'green' : 'yellow') : 'red';

          console.log('$scope.device: ' + JSON.stringify($scope.device));
          if(cb){
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
          function currentSoftwareVersion(testVersion){ //used in filter
            return (testVersion.id===$scope.customer.softwareVersionId || 
                    testVersion.id===$scope.reseller.softwareVersionId || 
                    testVersion.id===$scope.cloud.softwareVersionId);
        }
        $scope.defaultSoftwareVersion=$scope.softwareVersions.filter(currentSoftwareVersion)[0]; //filtering versions for one that matches the most immediate parent version for default
        })
    }

    getDevice(function(){
      getSoftwareVersions();
    });

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id}, {reload: true});
    }

    $scope.selectCloud = function(cloud) {
      $state.go('cloud', {cloudId: (typeof cloud  === 'string') ? cloud : cloud.id}, {reload: true});
    }

    $scope.selectCustomer = function() {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : $scope.customer.id}, {reload: true});
    }

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
    }

   $scope.showCheckin = function(anEntry) {

    $scope.device.loadingMore = true;

    DeviceLogEntry
      .find({
          filter: {
            where: {id: anEntry.id}
          }
      })
      .$promise
      .then(function(log) {
        $scope.device.loadingMore = false;
        $scope.device.currentEntry = log[0];
      })


  }

  function modifySettings() {
    $scope.isSavingSettings = true;
    var updatedConfigObject = {};

    if ($scope.device.overrideIpAddress) {
      updatedConfigObject.overrideIpAddress = $scope.device.overrideIpAddress;
      updatedConfigObject.ipAddress = $scope.device.overrideIpAddress;
    }

    if ($scope.device.overrideVmsPort) {
      updatedConfigObject.overrideVmsPort = $scope.device.overrideVmsPort;
    }

    if ($scope.device.overrideConnectPort) {
      updatedConfigObject.overrideConnectPort = $scope.device.overrideConnectPort;
    }

    if ($scope.device.overrideCheckinPort) {
      updatedConfigObject.overrideCheckinPort = $scope.device.overrideCheckinPort;
    }

    if ($scope.device.overrideUploaderPort) {
      updatedConfigObject.overrideUploaderPort = $scope.device.overrideUploaderPort;
    }

    if ($scope.device.overrideListenerPort) {
      updatedConfigObject.overrideListenerPort = $scope.device.overrideListenerPort;
    }

    if ($scope.device.overrideConfigForwardPort) {
      updatedConfigObject.overrideConfigForwardPort = $scope.device.overrideConfigForwardPort;
    }

    Device
      .prototype$updateAttributes({id: $scope.device.id}, updatedConfigObject)
      .$promise
      .then(function(d) {
        setTimeout(function () {
          $scope.$apply(function() {
            $scope.isSavingSettings = false;
          });
        }, 300); // wrapped in a setTimeout just so people know this is doing something :)
      });
  }

  function checkin(device) {
    console.log('Checkin on device ' + device.id);
    $scope.sendingCheckin = device.id;

    // get the right signalling server
    var signallingServerUrl = device.signallingServerUrl ||
                              $scope.customer.signallingServerUrl ||
                              $scope.reseller.signallingServerUrl ||
                              $scope.cloud.signallingServerUrl;

    webrtcCommunications.webrtcCheckin($localStorage.token, device.id, signallingServerUrl, function (err, res) {
      if (err) {
        // maybe display an error message?
        console.log(err);
      } else {
        // maybe display a success message?
        console.log(res);
      }
      $scope.sendingCheckin = null;
      $scope.$digest();
    });
  }

  function loadMore(value) {
    $scope.device.loadingMore = true;
    var lastTimeStamp = $scope.device.logEntries[$scope.device.logEntries.length-1].timestamp
    DeviceLogEntry
      .find({
          filter: {
            where: {deviceId: $stateParams.deviceId, timestamp: {lt: lastTimeStamp}},
            fields: ['id','timestamp', 'deviceId'],
            limit: value,
            order: 'timestamp DESC'
          }
      })
      .$promise
      .then(function(logs) {
        $scope.device.loadingMore = false;

        for(var i in logs){
          if (i > -1) {
            $scope.device.logEntries.push(logs[i]);
          };
        }

        if (logs.length < $scope.logDataLimit) {
          $scope.device.noMoreLogs = true;
        }
        else{
          $scope.device.noMoreLogs = false;
        }
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
  };


  $scope.checkin = checkin;
  $scope.loadMore = loadMore;
  $scope.modifySettings = modifySettings;
  $scope.goHome = goHome;

  }]);
