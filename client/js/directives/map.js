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
        loadMarkers();

        function loadMarkers() {
          if (scope.devices.length <= 0) {
            setTimeout(function() {
              loadMarkers();
            }, 100); // TODO: this is hacky.  how can we get a signal on change?
          } else {
            var map = new google.maps.Map(d3.select("#map").node(), {
              zoom: 8,
              center: new google.maps.LatLng(45, -73),
              mapTypeId: google.maps.MapTypeId.TERRAIN
            });

            var data = convertDevicesToMarkers(scope.devices);
            var overlay = new google.maps.OverlayView();
            var bounds = new google.maps.LatLngBounds();

            Object.keys(data).forEach(function(d) {
              var datapoint = data[d];
              bounds.extend(new google.maps.LatLng(datapoint[1], datapoint[0]));
            });

            // Add the container when the overlay is added to the map.
            overlay.onAdd = function() {
              var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                  .attr("class", "locations");

              // Draw each marker as a separate SVG element.
              overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 15;

                var markers = layer.selectAll("svg")
                    .data(d3.entries(data))
                    .each(transform) // update existing markers
                  .enter().append("svg:svg")
                    .each(transform)

                // Add a circle.
                markers.append("svg:circle")
                    .attr("r", 7.5)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .style("cursor", "pointer")
                    .on('mouseover', function(d) {
                      d3.select(this).transition().duration(500).attr('r', 10);
                    })
                    .on('mouseout', function (d) {
                      d3.select(this).transition().duration(500).attr('r', 7.5);
                    })
                    .on('click', function(d) {
                      scope.selectDevice(d.value[2]);
                    });

                function transform(d) {
                  var status = d.value[2].status;
                  d = new google.maps.LatLng(d.value[1], d.value[0]);
                  d = projection.fromLatLngToDivPixel(d);
                  d.status = status;

                  return d3.select(this)
                      .style("left", (d.x - padding) + "px")
                      .style("top", (d.y - padding) + "px")
                      .attr('class', 'marker-' + status);
                }
              };
            };

            // Bind our overlay to the map…
            overlay.setMap(map);
            map.fitBounds(bounds);
          }
        }

        scope.selectDevice = function(device) {
          $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
        };

        function convertDevicesToMarkers(devices) {
          var data = {};
          devices.forEach(function(device) {
            if (device.location) {
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

              var id = device.id;
              var lat = device.location.lat;
              var lng = device.location.lng;
              data[id] = [lng, lat, device];
            }
          });

          return data;
        }
      }
    }
  });