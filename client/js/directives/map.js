angular
  .module('app')
  .directive('map', function($state) {
    return {
      restrict: 'E',
      templateUrl: '/views/map.html',
      scope: {
        devices: '=devices'
      },
      link: function (scope, element, attrs) {
        scope.markers = [];
        scope.filteredMarkers = [];
        scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };
        loadMarkers();

        function loadMarkers() {
          if (scope.devices.length <= 0) {
            setTimeout(function() {
              loadMarkers();
            }, 100); // TODO: this is hacky.  how can we get a signal on change?
          } else {
            scope.devices.forEach(function (device) {
              if (device.location) {
                // get device status
                var lastCheckinTimeInSeconds = new Date(device.lastCheckin).getTime() / 1000;
                var nowInSeconds = new Date().getTime() / 1000;

                var gracePeriodInSeconds = 60;
                var hasCheckedInOnTime = (lastCheckinTimeInSeconds + device.checkinInterval + gracePeriodInSeconds) > nowInSeconds;

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

                scope.markers.push({
                  id: device.id,
                  icon: icon,
                  latitude: device.location.lat,
                  longitude: device.location.lng,
                  showWindow: false,
                  customerName: device.customerName,
                  deviceName: device.name,
                  deviceId: device.id,
                  options: {
                    labelAnchor: "22 0",
                    labelClass: "marker-labels"
                  },
                  selectDevice: scope.selectDevice
                });
              }
            });
            scope.filteredMarkers = scope.markers;
          }
        }

        scope.onMarkerClicked = function onMarkerClicked(marker) {
          marker.showWindow = true;
          scope.$apply();
        };

        scope.selectDevice = function(device) {
          $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
        };
      }
    }
  });