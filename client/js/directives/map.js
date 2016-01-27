angular
  .module('app')
  .directive('map', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/map.html',
      scope: {
        devices: '=devices'
      },
      link: function (scope, element, attrs) {
        scope.markers = [];
        scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };

        scope.onMarkerClicked = function onMarkerClicked(marker) {
          marker.showWindow = true;
          scope.$apply();
        };

        scope.selectDevice = function(device) {
          $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
        };
    }
  });