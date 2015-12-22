angular
  .module('app')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'Customer', 'Device', 'SoftwareVersion', 'userService', '$mdDialog', '$localStorage',
    function($scope, $state, $stateParams, Cloud, Reseller, Customer, Device, SoftwareVersion, userService, $mdDialog, $localStorage) {

    $scope.customer = {};

    $scope.cloudId = null;
    $scope.resellerId = null;
    $scope.customerId = null;
    $scope.device = null;

    $scope.sendingCheckin = null;
    $scope.isSavingOverrideIpAddress = false;

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

  function setOverrideIpAddress(ipAddress) {
    $scope.isSavingOverrideIpAddress = true;
    Device
      .prototype$updateAttributes(
        {id: $scope.device.id},
        {overrideIpAddress: ipAddress}
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
  $scope.setOverrideIpAddress = setOverrideIpAddress;
  $scope.goHome = goHome;

  }]);
