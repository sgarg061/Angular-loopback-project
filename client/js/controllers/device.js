angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Device', 'SoftwareVersion', 'DeviceLogEntry', 'userService', '$mdDialog', 'toastr', '$localStorage', 'softwareService',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, Device, SoftwareVersion, DeviceLogEntry, userService, $mdDialog, toastr, $localStorage, softwareService) {

    $scope.customer = {};

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;
    $scope.device = null;

    $scope.checkinHeight = 500;

    $scope.checkinWidth = 620;

    $scope.timelineView = false;

    $scope.logCount = 0;
    $scope.logDataLimit = 25;
    $scope.sendingCheckin = null;
    $scope.isSavingSettings = false;

    $scope.currentDate = new Date();

    $scope.NATPageUrl = null;

    $scope.checkinReasons = [
      {name: 'all', count: 0},
      {name: 'interval', count: 0},
      {name: 'status', count: 0},
      {name: 'forced', count: 0},
      {name: 'service', count: 0},
      {name: 'reboot', count: 0},
      {name: 'other', count: 0}
    ];

    $scope.checkinTypes = ['show all', 'all down', /*'some down', 'all online', these 2 aren't supported by loopback*/  'some up'];

    $scope.selectedCheckinType = 'show all';

    $scope.checkinColors = {
      interval: '#00bb00',
      status: '#c400ff',
      forced: '#ffa000',
      service: '#ff8a80',
      reboot: '#f54',
      other: '#0088cc'
    };

    function watchForChanges() {
      // watch device for updates and save them when they're found
      $scope.$watch("device", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.device.id;
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateDevice(id, {checkinInterval: newValue.checkinInterval}, 'Check in interval has been updated');
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateDevice(id, {signallingServerUrl: newValue.signallingServerUrl}, 'Signalling server has been updated');
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateDevice(id, {imageServerUrl: newValue.imageServerUrl}, 'Image server URL has been updated');
          }
          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateDevice(id, {eventServerUrl: newValue.eventServerUrl}, 'Event server URL has been updated');
          }
          if (newValue.selectedCheckinReason !== oldValue.selectedCheckinReason) {
            console.log('checkin value selected', selectedCheckinReason);
          }
          if(newValue.enableMonitoring != oldValue.enableMonitoring) {
            updateDevice(id, {enableMonitoring:newValue.enableMonitoring}, 'Updated monitor setting');
          }
        }
      }, true);

      $scope.$watch('selectedCheckinReason', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          document.getElementById('timeline-detail').classList.remove('open');
          $scope.device.noMoreLogs = false;

          // reset log entries
          $scope.device.logEntries = [];
          loadMore(100);
        }
      }, true);

      $scope.$watch('selectedCheckinType', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          $scope.device.logEntries = [];
          loadMore(100);
        }
      }, true);

      // watch device for updates and save them when they're found
      $scope.$watch('currentDate', function(newValue, oldValue) {
        if (newValue) {
          if (newValue !== oldValue) {
            renderGraph();
          }
        }
      }, true);

    }
    $scope.updateVersion = function (softwareVersion) {
      var id = $scope.device.id;
     if (softwareVersion === ''){
        updateDevice(id, {softwareVersionId: null}, 'Software version has been updated to default version');
        $scope.currentSoftwareVersion = softwareVersion;
      } else {
        updateDevice(id, {softwareVersionId: softwareVersion}, 'Software version has been updated');
        $scope.currentSoftwareVersion = softwareVersion;
      }
    }

    function updateDevice(id, changedDictionary, message) {
      Device.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(device) {toastr.info(' ' +  message);}, function (res) {
          toastr.error(res.statusText, 'Error Invalid Value');
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
                fields: ['id','timestamp', 'onlineCameras', 'totalCameras', 'reason'],
                limit: $scope.logDataLimit,
                order: 'timestamp DESC'
              }
            }]
          }
        })
        .$promise
        .then(function(devices) {
          if(!_.isEmpty(devices)) {
            $scope.device = devices[0];
            $scope.ipAddress = devices[0].ipAddress;
            if (!$scope.ipAddress|| $scope.ipAddress.length < 7 ) {
              $scope.ipAddress = 'Invalid Ip Address';
            }
            $scope.currentSoftwareVersion = devices[0].softwareVersionId;
          }
          
          $scope.device.loadingMore = false;
          
          $scope.device.logDataLimit = $scope.logDataLimit;

          if($scope.device.enableMonitoring == null){
            $scope.device.enableMonitoring = false;
          }
          
          if ($scope.device.logEntries.length){
              $scope.showCheckin($scope.device.logEntries[0]);

            if ($scope.device.logEntries.length < $scope.logDataLimit) {
              $scope.device.noMoreLogs = true;
            } else {
              $scope.device.noMoreLogs = false;
            }

            var height = document.body.clientHeight - 370;
            var width = document.body.clientWidth - 725;

            if (height < 650) {
              height = 650;
            }

            $scope.checkinHeight = height;
            $scope.checkinWidth = width;

            renderGraph();
          }

          $scope.device.cameraStatus = function (log) {
            if (log.onlineCameras === log.totalCameras){
              return $scope.checkinTypes[3]
            }
            else if(log.onlineCameras === 0){
              return $scope.checkinTypes[1]
            }
            else if(log.onlineCameras < log.totalCameras){
              return $scope.checkinTypes[2]
            }
            else{
              return $scope.checkinTypes[0]
            }
          }

          $scope.customer = devices[0].customer;
          $scope.reseller = devices[0].customer.reseller;
          $scope.cloud = devices[0].customer.reseller.cloud;
          $scope.defaultCheckinInterval = $scope.customer.checkinInterval || $scope.reseller.checkinInterval || $scope.cloud.checkinInterval;
          

          watchForChanges(); 
          var deviceIp = $scope.device.overrideIpAddress || $scope.device.ipAddress;
          var devicePort = $scope.device.overrideConnectPort || $scope.deviceconnectPort || 8000;
          $scope.NATPageUrl = "http://" + deviceIp + ":"+ devicePort + "/config/#/list";

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

          // console.log('$scope.device: ' + JSON.stringify($scope.device));
          if(cb){
            cb();
          }
        });
    }
    function getdefaultSoftwareVersion(version, cb) {
      var defaultSoftwareversion = version.filter(function(index){return index.id === $scope.customer.softwareVersionId });
      if (!_.isEmpty(defaultSoftwareversion)) {
        cb(null, defaultSoftwareversion[0]);
      } else {
        defaultSoftwareversion = version.filter(function(index){return index.id === $scope.reseller.softwareVersionId });
        if (!_.isEmpty(defaultSoftwareversion)){
          cb(null, defaultSoftwareversion[0]);
        } else {
          defaultSoftwareversion = version.filter(function(index){return index.id === $scope.cloud.softwareVersionId });
          if (!_.isEmpty(defaultSoftwareversion)){
             cb(null, defaultSoftwareversion[0]);
          } else {
            var error = 'Unknown Software Version';
            cb(error, null);
          }
        }
      }
    }
    

    function getSoftwareVersions() {
      SoftwareVersion
        .find({
          filter: {
            fields: {id: true, name: true, url: true},
            order: 'name DESC'
          }
        })
        .$promise
        .then(function(versions) {
          if (!_.isEmpty(versions)){
            $scope.softwareVersions = [].concat(versions);
            getdefaultSoftwareVersion($scope.softwareVersions, function(err, defaultSoftwareVersion){
              if (err){
                toastr.error (err);
                return;
              }
              $scope.defaultSoftwareVersion = defaultSoftwareVersion;
            });
          } else {
            toastr.error('Software versions not available');
          }
        })
    }

    function getCountByReasons() {
      var arrayReasons = Object.keys($scope.checkinColors).slice(0, $scope.checkinReasons.length-2);

      $scope.checkinReasons.forEach(function (reason, index){

        var reasonName = reason.name;
        if (reason.name == 'all')
          reasonName = {neq: null};
        else if(reason.name == 'other')
          reasonName = {nin: arrayReasons};

        var whereClause = {
          deviceId: $stateParams.deviceId,
          reason: reasonName
        };

        whereClause = _.merge(whereClause, checkinFilter(false));

        DeviceLogEntry
          .count({
              where: whereClause
          }, function(data) {
            reason.count = data.count;
            if (index == $scope.checkinReasons.length-1) {
              $scope.selectedCheckinReason = 'all';
            };
          });

      });

    }

    getCountByReasons();
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
      $state.go('device', {deviceId: (typeof device === 'string') ? device : $scope.device.id}, {reload: true});
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
      $scope.ipAddress = $scope.device.overrideIpAddress;
    }

    if ($scope.device.overrideLocalIP) {
      updatedConfigObject.overrideLocalIP = $scope.device.overrideLocalIP;
      updatedConfigObject.localIP = $scope.device.overrideLocalIP;
    }

    if ($scope.device.overrideVmsPort) {
      updatedConfigObject.overrideVmsPort = $scope.device.overrideVmsPort;
    }
    if ($scope.device.overrideLocalVmsPort) {
      updatedConfigObject.overrideLocalVmsPort = $scope.device.overrideLocalVmsPort;
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

    if ($scope.device.overrideAddress && $scope.device.overrideAddress.geometry) {
      var newLocation = {
        lat: $scope.device.overrideAddress.geometry.location.lat(),
        lng: $scope.device.overrideAddress.geometry.location.lng()
      };

      updatedConfigObject.overrideLocation = newLocation;
      updatedConfigObject.location = newLocation;

      updatedConfigObject.address = $scope.device.overrideAddress.formatted_address;
      updatedConfigObject.overrideAddress = $scope.device.overrideAddress.formatted_address;
    }

    if ($scope.device.overrideName) {
      updatedConfigObject.name = $scope.device.overrideName;
      updatedConfigObject.overrideName = $scope.device.overrideName;

      // make this change visible on the UI
      $scope.device.name = $scope.device.overrideName;
    }

    if ($scope.device.overrideExternalId){
      updatedConfigObject.overrideExternalId = $scope.device.overrideExternalId;
    }
    Device
      .prototype$updateAttributes({id: $scope.device.id}, updatedConfigObject)
      .$promise
      .then(function(d) {
        setTimeout(function () {
          $scope.$apply(function() {
            $scope.isSavingSettings = false;
            toastr.info('Settings updated');
          });
        }, 300); // wrapped in a setTimeout just so people know this is doing something :)
      })
      .catch(function (err) {
        toastr.error('Error updating settings');
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

  function checkinFilter(applyReasonFilter) {
    var filter = {};

    // set timestamp filter
    if ($scope.device && $scope.device.logEntries && $scope.device.logEntries.length > 0) {
      var lastTimestamp = $scope.device.logEntries[$scope.device.logEntries.length-1].timestamp;
      filter.timestamp = {lt: lastTimestamp};
    }

    // reason filter
    if (applyReasonFilter) {
      var arrayReasons = Object.keys($scope.checkinColors).slice(0, $scope.checkinReasons.length-2);

      var reasonName = $scope.selectedCheckinReason;
      if (reasonName === 'all'){
        reasonName = {neq: null};
      } else if (reasonName === 'other'){
        reasonName = {nin: arrayReasons};
      }

      filter.reason = reasonName;
    }

    switch ($scope.selectedCheckinType) {
      case 'all down':
        filter.and = [{
          totalCameras: {gt: 0}
        }, {
          onlineCameras: 0
        }];
        break;
      // the below 2 cases aren't supported by the loopback api.
      // TODO: implement this directly against the database at a later date
      /*case 'some down':
        filter.and = [{
          totalCameras: {gt: 'onlineCameras'}
        }, {
          onlineCameras: {
            onlineCameras: {gt: 0}
          }
        }];
        break;
      case 'all online':
        filter.onlineCameras = 'totalCameras';
        break;*/
      case 'some up':
        filter.onlineCameras = {gt: 0};
        break;
      case 'show all':
      default:
        // no filter to apply
    }

    return filter
  }

  function loadMore(value) {
    $scope.device.loadingMore = true;

    var whereClause = {
      deviceId: $stateParams.deviceId
    };

    whereClause = _.merge(whereClause, checkinFilter(true));
    DeviceLogEntry
      .find({
          filter: {
            where: whereClause,
            fields: ['id','timestamp', 'deviceId', 'onlineCameras', 'totalCameras', 'reason'],
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
      });

      getCountByReasons();
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

  function renderGraph() {
    var start = new Date($scope.currentDate.toLocaleDateString());
    var end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    DeviceLogEntry
      .find({
          filter: {
            where: {deviceId: $stateParams.deviceId, checkinTime: {gt: start, lt: end}},
            fields: ['id','timestamp','reason'],
            order: 'timestamp DESC'
          }
      })
      .$promise
      .then(function(logs) {
        $scope.device.loadingMore = false;


        var args = {
          date: $scope.currentDate,
          width: function() {
            return window.innerWidth - 380;
          },
          height: function() {
            return $scope.checkinHeight - 40;
          },
          margin: {
            left: 10,
            right: 10,
            top: 0,
            bottom: 0
          },
          data: logs,
          reasonColorCode: $scope.checkinColors,
          callback: function(data) {
            /* insert the data into angular directive */
            viewCheckin(data);
            var angularDirectiveDOM = document.createElement('div');
            return angularDirectiveDOM;

          }
        };

        timeline(args);

      })


  }

  function getTick(width) {
    if (width >= 1000) {
      return 1;
    }

    if (width >= 600) {
      return 2;
    }
  }
  function viewCheckin(checkin) {
    $scope.device.loadingMore = true;
    DeviceLogEntry
      .find({
          filter: {
            where: {id: checkin.id}
          }
      })
      .$promise
      .then(function(log) {
        $scope.device.loadingMore = false;
        $scope.device.currentGraphEntry = log[0];
      })
  }

  $scope.loadNextDay = function () {
    document.getElementById('timeline-detail').classList.remove('open');
    $scope.currentDate.setDate($scope.currentDate.getDate()+1);
    $scope.currentDate= new Date($scope.currentDate.toLocaleDateString());
  }

  $scope.loadPrevDay = function () {
    document.getElementById('timeline-detail').classList.remove('open');
    $scope.currentDate.setDate($scope.currentDate.getDate()-1);
    $scope.currentDate= new Date($scope.currentDate.toLocaleDateString());
  }

  $scope.canModifyMonitorSetting = function() {
    var userType = userService.getUserType();
    return ['solink', 'cloud'].indexOf(userType) > -1;
  };


  $scope.checkin = checkin;
  $scope.loadMore = loadMore;
  $scope.modifySettings = modifySettings;
  $scope.goHome = goHome;

  }]);
