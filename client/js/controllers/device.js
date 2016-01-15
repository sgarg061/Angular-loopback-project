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

    $scope.timelineView = false;

    $scope.logCount = 0;
    $scope.logDataLimit = 100;
    $scope.sendingCheckin = null;
    $scope.isSavingOverrideIpAddress = false;

    $scope.currentDate = new Date();


    $scope.checkinReasons = [
      {name: 'all', count: 0},
      {name: 'restart', count: 0},
      {name: 'interval', count: 0},
      {name: 'force', count: 0},
      {name: 'shutdown', count: 0}
    ];

    $scope.checkinColors = {
      interval: '#00bb00',
      restart: '#f54',
      shutdown: '#f54',
      force: '#ffa000',
      other: '#0088cc'
    };

    $scope.selectedCheckinReason = 'all';


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

    function getDevice() {
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

            $scope.checkinHeight = document.body.clientHeight - 550;
            renderGraph();
          };

          $scope.customer = devices[0].customer;
          $scope.reseller = devices[0].customer.reseller;
          $scope.cloud = devices[0].customer.reseller.cloud;

          watchForChanges();

          var device = $scope.device;
          var allCamerasOnline = !device.cameras || device.cameras.every(function(c) {return c.status == 'online';});
          device.statusIconColor = device.status == 'online' ? (allCamerasOnline ? 'green' : 'yellow') : 'red';
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

    function getCountByReasons() {
      $scope.checkinReasons.forEach(function (reason){
        
        var reasonName = reason.name;
        if (reason.name == 'all')
          reasonName = {neq: null};


        DeviceLogEntry
          .count({
              where: {reason: reasonName}
          }, function(data) {
            reason.count = data.count;
          });

      });
    }

    getDevice();
    getCountByReasons();
    getSoftwareVersions();

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

  function setOverrideIpAddress(ipAddress) {
    $scope.isSavingOverrideIpAddress = true;
    Device
      .prototype$updateAttributes(
        {id: $scope.device.id},
        {
          overrideIpAddress: ipAddress,
          ipAddress: ipAddress
        }
      )
      .$promise
      .then(function(d) {
        setTimeout(function () {
          $scope.$apply(function() {
            $scope.isSavingOverrideIpAddress = false;
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

  function renderGraph() {
    var start = new Date($scope.currentDate.toLocaleDateString());
    var end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    DeviceLogEntry
      .find({
          filter: {
            where: {deviceId: $stateParams.deviceId, checkinTime: {gt: start, lt: end}},
            fields: ['id','timestamp', 'checkinTime', 'deviceId', 'onlineCameras', 'totalCameras', 'reason'],
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

  var fakeCheckins = function(count) {
    var points = [];

    var reasonOptions = ['default', 'restart', 'info'];


    while(count > 0) {
      var checkInTime = new Date(`Fri Jan 15 2016 ${Math.floor((Math.random() * 24) + 0)}:${Math.floor((Math.random() * 59) + 0)}:${Math.floor((Math.random() * 59) + 0)} GMT-0500 (EST)`);
      var reasonId = Math.floor((Math.random() * 3) + 0);
      var obj = {
        deviceId: `30a34860-b3e8-11e5-b146-fbfc0da4d611`,
        timestamp: checkInTime.getTime(),
        checkinTime: checkInTime,
        reason: reasonOptions[reasonId],
        id: count
      }
      points.push(obj);

      count--;
    }

    return points;
  }

  $scope.loadNextDay = function () {
    document.getElementById('timeline-detail').classList.remove('open');
    $scope.currentDate.setDate($scope.currentDate.getDate()+1);
    renderGraph();
  }

  $scope.loadPrevDay = function () {
    document.getElementById('timeline-detail').classList.remove('open');
    $scope.currentDate.setDate($scope.currentDate.getDate()-1);
    renderGraph();
  }

  $scope.checkin = checkin;
  $scope.loadMore = loadMore;
  $scope.setOverrideIpAddress = setOverrideIpAddress;
  $scope.goHome = goHome;

  }]);
