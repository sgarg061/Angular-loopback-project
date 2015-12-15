angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Device', 'SoftwareVersion', 'userService', '$mdDialog', '$localStorage',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, Device, SoftwareVersion, userService, $mdDialog, $localStorage) {

    $scope.customer = {};

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;
    $scope.device = null;


    $scope.checkinData = [{
        "deviceId": "4c607770-8969-11e5-aad3-870f35e59e60",
        "timestamp": "1449170032490",
        "id": 10756,
        "name": "Activated Device",
        "address": "390 March Rd, ottawa",
        "location": {
          "lat": 45.3376177,
          "lng": -75.9087814
        },
        "password": "__connect__",
        "username": "solink-local",
        "locationName": "Store #201",
        "posInformation": [
          {
            "host": "10.126.140.41",
            "name": "Drive Thru 1",
            "port": 53004,
            "type": "tcp",
            "error": null,
            "posId": 0,
            "status": "online",
            "cameras": [
              "K8kswbltEsm1RIes",
              "j8h5ayzy3pb8hAyA"
            ],
            "filter_id": "lhgVvgnD9cbvadOC"
          },
          {
            "host": "10.126.140.41",
            "name": "Drive Thru 2",
            "port": 53005,
            "type": "tcp",
            "error": null,
            "posId": 1,
            "status": "online",
            "cameras": [
              "K8kswbltEsm1RIes",
              "buLFAr1iR8opuuo8"
            ],
            "filter_id": "lhgVvgnD9cbvadOC"
          },
          {
            "host": "10.126.140.41",
            "name": "Front Cash 1",
            "port": 53006,
            "type": "tcp",
            "error": null,
            "posId": 2,
            "status": "online",
            "cameras": [
              "K8kswbltEsm1RIes",
              "pYvsKPPkTlGqeT8t"
            ],
            "filter_id": "lhgVvgnD9cbvadOC"
          },
          {
            "host": "10.126.140.41",
            "name": "Front Cash 2",
            "port": 53007,
            "type": "tcp",
            "error": null,
            "posId": 3,
            "status": "online",
            "cameras": [
              "K8kswbltEsm1RIes",
              "jIvWiDfL7dCu0Oyk"
            ],
            "filter_id": "lhgVvgnD9cbvadOC"
          },
          {
            "evt": "motion",
            "url": "http://localhost:8080/?username=solink-local&password=__connect__",
            "name": "Motion",
            "type": "socketio",
            "error": null,
            "posId": 4,
            "status": "online",
            "cameras": [
              "mG8sxDba527puXBO",
              "j8h5ayzy3pb8hAyA",
              "pYvsKPPkTlGqeT8t",
              "tjULDOXVRPb3tM9b"
            ],
            "filter_id": "aO8tmOfpJMbmGAyt"
          }
        ],
        "organizationPath": "",
        "cameraInformation": [
          {
            "ip": "10.126.140.31",
            "name": "Upside down Time",
            "type": "onvif",
            "status": "online",
            "streams": [
              {
                "id": "31917f48-6355-435b-af02-9d1c1d150098",
                "url": "rtsp://admin:S0l1nk!!@10.126.140.31/Streaming/Channels/1",
                "name": "",
                "bitrate": 512,
                "quality": "",
                "framerate": "",
                "retention": "",
                "resolution": "1280x720",
                "latestThumb": "1449170013000_13334"
              }
            ],
            "cameraId": "5hkwFr40V4TX0wen",
            "password": "S0l1nk!!",
            "username": "admin",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-5hkwFr40V4TX0wen-thumbnail.jpg",
            "manufacturer": "hik",
            "motionParams": {
              "roi": 1.111111111111111e+99,
              "enabled": false,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.108",
            "name": "No Video Cam",
            "type": "onvif",
            "status": "online",
            "streams": [
              {
                "id": "ab0ec16b-14c7-4993-98fb-a9d2e886aadc",
                "url": "rtsp://root:admin@10.126.140.108/axis-media/media.amp?streamprofile=solink&fps=15&resolution=D1&compression=40&videocodec=h264&videomaxbitrate=512&camera=1",
                "name": "",
                "quality": "",
                "camera_no": "0",
                "framerate": "",
                "retention": "",
                "resolution": "D1",
                "latestThumb": "1449170015000_10677"
              }
            ],
            "cameraId": "r2PIxJpMZRbhYndq",
            "password": "admin",
            "username": "root",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-r2PIxJpMZRbhYndq-thumbnail.jpg",
            "manufacturer": "axis",
            "motionParams": {
              "roi": 1.111111111111111e+99,
              "enabled": false,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.41",
            "name": "Drive Thru 2",
            "status": "online",
            "streams": [
              {
                "id": "7ae18eab-2a02-4065-fd66-5cf53278ca93",
                "url": "http://10.126.140.41:18085",
                "name": "",
                "retention": "",
                "latestThumb": "1449170007000_13000"
              }
            ],
            "cameraId": "mG8sxDba527puXBO",
            "password": "",
            "username": "",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-mG8sxDba527puXBO-thumbnail.jpg",
            "manufacturer": "unknown",
            "motionParams": {
              "roi": "0000000000000000000000000000000000000000000000000000000000100000000010000000000000000000000000000000",
              "enabled": true,
              "threshold": 161,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.111",
            "name": "Far Away Time Cam",
            "type": "onvif",
            "status": "offline",
            "streams": [
              {
                "id": "68ed0781-2567-4d68-8ff4-b26b3ef0a7d6",
                "url": "rtsp://root:admin@10.126.140.111/axis-media/media.amp?streamprofile=solink&fps=15&resolution=2592x1944&compression=40&videocodec=h264&videomaxbitrate=512",
                "name": "",
                "quality": "",
                "framerate": "",
                "retention": "",
                "resolution": "2592x1944",
                "latestThumb": "1448905161000_11914"
              }
            ],
            "cameraId": "jIvWiDfL7dCu0Oyk",
            "password": "admin",
            "username": "root",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-jIvWiDfL7dCu0Oyk-thumbnail.jpg",
            "manufacturer": "axis",
            "motionParams": {
              "roi": 1.1100111111110002e+99,
              "enabled": true,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.41",
            "name": "Front Cash 1",
            "status": "online",
            "streams": [
              {
                "id": "b08f653d-ed5a-479c-99e0-e48a77b8bc89",
                "url": "http://10.126.140.41:18086",
                "name": "",
                "retention": "",
                "latestThumb": "1449170004000_13000"
              }
            ],
            "cameraId": "pYvsKPPkTlGqeT8t",
            "password": "",
            "username": "",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-pYvsKPPkTlGqeT8t-thumbnail.jpg",
            "manufacturer": "unknown",
            "motionParams": {
              "roi": "0000000000000000000000000000000000000000000000100000000010000000000000000000000000000000000000000000",
              "enabled": true,
              "threshold": 183,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.170",
            "name": "Menanmera",
            "status": "online",
            "streams": [
              {
                "id": "86e019f2-9c20-452d-e285-b85541a5893c",
                "url": "rtsp://root:admin@10.126.140.170/axis-media/media.amp?streamprofile=solink&fps=30&resolution=1600x1200&compression=40&videocodec=h264&videomaxbitrate=512",
                "name": "sd",
                "quality": "",
                "framerate": 30,
                "retention": "",
                "resolution": "1600x1200",
                "latestThumb": "1449170007000_20199"
              }
            ],
            "cameraId": "buLFAr1iR8opuuo8",
            "password": "admin",
            "username": "root",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-buLFAr1iR8opuuo8-thumbnail.jpg",
            "manufacturer": "axis",
            "motionParams": {
              "roi": "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              "enabled": true,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.41",
            "name": "Drive Thru 1",
            "status": "online",
            "streams": [
              {
                "id": "39be63d5-7cc8-417b-a2c3-6469f487b732",
                "url": "http://10.126.140.41:18084",
                "name": "",
                "retention": "",
                "latestThumb": "1449170004000_13000"
              }
            ],
            "cameraId": "j8h5ayzy3pb8hAyA",
            "password": "",
            "username": "",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-j8h5ayzy3pb8hAyA-thumbnail.jpg",
            "manufacturer": "unknown",
            "motionParams": {
              "roi": "0000000000000000000000000000000000000000000000000000000000000000000010000000001000000000000000000000",
              "enabled": true,
              "threshold": 211,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.41",
            "name": "Front Cash 2",
            "status": "online",
            "streams": [
              {
                "id": "4997234b-c467-496c-e515-4653364eb119",
                "url": "http://10.126.140.41:18087",
                "name": "",
                "retention": "",
                "latestThumb": "1449170014000_13000"
              }
            ],
            "cameraId": "tjULDOXVRPb3tM9b",
            "password": "",
            "username": "",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-tjULDOXVRPb3tM9b-thumbnail.jpg",
            "manufacturer": "unknown",
            "motionParams": {
              "roi": "0000000000000000000000000000000000000000000000000000011000000000100000000000000000000000000000000000",
              "enabled": true,
              "threshold": 71,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.104",
            "name": "Good Time Cam",
            "type": "onvif",
            "status": "online",
            "streams": [
              {
                "id": "df5972c7-47bc-4658-ae88-45a2bb2f91ce",
                "url": "rtsp://root:admin@10.126.140.104/axis-media/media.amp?streamprofile=solink&fps=15&resolution=2592x1944&compression=40&videocodec=h264&videomaxbitrate=512",
                "name": "HD",
                "quality": "",
                "framerate": "",
                "retention": "",
                "resolution": "2592x1944",
                "latestThumb": "1449170018000_10497"
              },
              {
                "id": "c364c397-6771-46c3-8dc4-b7c56ea08b13",
                "url": "rtsp://root:admin@10.126.140.104/axis-media/media.amp?streamprofile=solink&fps=15&resolution=640x480&compression=40&videocodec=h264&videomaxbitrate=512",
                "name": "SD",
                "quality": "",
                "framerate": "",
                "retention": "",
                "resolution": "640x480",
                "latestThumb": "1449169989000_20828"
              }
            ],
            "cameraId": "K8kswbltEsm1RIes",
            "password": "admin",
            "username": "root",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-K8kswbltEsm1RIes-thumbnail.jpg",
            "manufacturer": "axis",
            "motionParams": {
              "roi": 1.111111111111111e+99,
              "enabled": true,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          },
          {
            "ip": "10.126.140.30",
            "name": "Middle of Nowhere Cam",
            "type": "onvif",
            "status": "online",
            "streams": [
              {
                "id": "ec20c24a-cbac-4146-bac8-4c8055485310",
                "url": "rtsp://admin:S0l1nk!!@10.126.140.30/Streaming/Channels/1",
                "name": "",
                "bitrate": 512,
                "quality": "",
                "framerate": "",
                "retention": "",
                "resolution": "1280x720",
                "latestThumb": "1449170003000_13334"
              }
            ],
            "cameraId": "ik0a57khmFKEL6Pl",
            "password": "S0l1nk!!",
            "username": "admin",
            "thumbnail": "4c607770-8969-11e5-aad3-870f35e59e60-ik0a57khmFKEL6Pl-thumbnail.jpg",
            "manufacturer": "hik",
            "motionParams": {
              "roi": 1.111111111111111e+99,
              "enabled": false,
              "threshold": 40,
              "sensitivity": 50
            },
            "schedule_enabled": true
          }
        ],
        "deviceInformation": {
          "ip": "10.126.140.201",
          "name": "Solink-HQ 201",
          "size": 893687693312,
          "used": 808354578432,
          "model": "TS-X53",
          "firmware": "4.2.0",
          "deviceCapacity": 893687693312,
          "availableCapacity": 85333114880
        },
        "$$hashKey": "object:125"
      }];

    $scope.sendingCheckin = null;

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
                limit: 10,
                order: 'timestamp DESC'
              }
            }]
          }
        })
        .$promise
        .then(function(devices) {
          $scope.device = devices[0];

          $scope.device = devices[0];
          $scope.customer = devices[0].customer;
          $scope.reseller = devices[0].customer.reseller;
          $scope.cloud = devices[0].customer.reseller.cloud;

          watchForChanges();

          var device = $scope.device;
          var allCamerasOnline = !device.cameras || device.cameras.every(function(c) {return c.status == 'online';});
          device.statusIconColor = device.status == 'online' ? (allCamerasOnline ? 'green' : 'yellow') : 'red';

          console.log('$scope.device: ' + JSON.stringify($scope.device));
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

    getDevice();
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
  $scope.goHome = goHome;

  }]);
