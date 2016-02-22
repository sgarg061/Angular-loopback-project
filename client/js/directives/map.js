angular
  .module('app')
  .directive('map', ['$state', 'socket', function($state, socket) {
    return {
      restrict: 'E',
      templateUrl: '/views/map.html',
      scope: {
        devices: '=devices'
      },
      link: function (scope, element, attrs) {
        var smallMarkerRadius = 7.5;
        var bigMarkerRadius = 10;
        var readyToRefit = true;

        scope.showGreenDevices = true;
        scope.showYellowDevices = true;
        scope.showRedDevices = true;
        scope.greenCount = 0;
        scope.redCount = 0;
        scope.yellowCount = 0;
        scope.searchQuery = '';

        scope.filteredDevices = [];
        scope.hoveredLocationText = '';

        scope.overlay = new google.maps.OverlayView();
        scope.layer = null;
        scope.map = new google.maps.Map(d3.select('#map').node(), {
          zoom: 8,
          center: new google.maps.LatLng(45, -73),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        loadMarkers();
        watchForChanges();

        var colourTransitionMapping = {
          red: '#DE0808',
          green: 'green',
          yellow: '#F7CC05'
        }; // yeah, this sucks.  not sure how to do this yet...

        socket.on('checkin', function (data) {
          console.log('checkin:', data);
          pulse(data.deviceId)
        });

        function pulse(id) {
          try {
            var elem = d3.select('#marker-inner-' + id);
            var originalColour = colourTransitionMapping[elem.data()[0].status];
            elem.transition().duration(500).style('fill', 'blue').attr('r', bigMarkerRadius);

            setTimeout(function() {
              elem.transition().duration(500).style('fill', originalColour).attr('r', smallMarkerRadius);
            }, 1000);
          } catch (err) {
          }
        }

        function loadMarkers() {
          if (scope.devices.length <= 0) {
            setTimeout(function() {
              loadMarkers();
            }, 100); // TODO: this is hacky.  how can we get a signal on change?
          } else {
            preprocessDevices();
            filterDevices();

            // Add the container when the overlay is added to the map.
            scope.overlay.onRemove = function() {
              scope.layer.remove();
              console.log(scope.layer);
            };

            scope.overlay.onAdd = function() {
              scope.layer = d3.select(this.getPanes().overlayMouseTarget).append('div')
                .attr('class', 'locations');
            };

            scope.overlay.draw = function() {
              var data = convertDevicesToMarkers(scope.filteredDevices);
              var bounds = new google.maps.LatLngBounds();


              Object.keys(data).forEach(function(d) {
                var datapoint = data[d];
                bounds.extend(new google.maps.LatLng(datapoint[1], datapoint[0]));
              });
              var projection = this.getProjection(), padding = 15;

              var markers = scope.layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
                .enter().append('svg:svg')
                .each(transform);

              // Add a circle.
              markers.append('svg:circle')
                .attr('r', 7.5)
                .attr('cx', padding)
                .attr('cy', padding)
                .each(transformInner);

              markers.append('svg:circle')
                .attr('r', 15)
                .attr('cx', padding)
                .attr('cy', padding)
                .style('opacity', 0.2)
                .style('cursor', 'pointer')
                .each(transformOuter);

              function transformInner(d) {
                return d3.select(this).attr('id', 'marker-inner-' + d.id);
              };

              function transformOuter(d) {
                var id = d.id;

                return d3.select(this)
                  .attr('id', 'marker-outer-' + id)
                  .on('mouseover', function(d) {
                    scope.$applyAsync(function () {
                      scope.hoveredLocationText = d.name;
                    });

                    d3.select('#marker-inner-' + id).transition().duration(500).attr('r', bigMarkerRadius);
                  })
                  .on('mouseout', function (d) {
                    scope.$applyAsync(function () {
                      scope.hoveredLocationText = '';
                    });

                    d3.select('#marker-inner-' + id).transition().duration(500).attr('r', smallMarkerRadius);
                  })
                  .on('click', function(d) {
                    scope.selectDevice(d);
                  });
              }

              function transform(d) {
                var device = d.value[2];
                var status = d.value[2].status;
                var id = d.value[2].id;
                d = new google.maps.LatLng(d.value[1], d.value[0]);
                d = projection.fromLatLngToDivPixel(d);
                d.status = status;

                return d3.select(this)
                  .style('left', (d.x - padding) + 'px')
                  .style('top', (d.y - padding) + 'px')
                  .attr('class', 'marker-' + status)
                  .attr('id', 'marker-' + id)
                  .datum(device);
              }

              if (readyToRefit) {
                scope.map.fitBounds(bounds);
                readyToRefit = false;
              }
            };

            // Bind our overlay to the map…
            scope.overlay.setMap(scope.map);
          }
        }

        scope.selectDevice = function (device) {
          $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
        };

        scope.toggle = function (colour) {
          switch (colour) {
            case 'green':
              scope.showGreenDevices = !scope.showGreenDevices;
              break;
            case 'yellow':
              scope.showYellowDevices = !scope.showYellowDevices;
              break;
            case 'red':
              scope.showRedDevices = !scope.showRedDevices;
              break;
            default:
              console.log('toggling', colour);
          }

          filterDevices();
        };

        function watchForChanges() {
          scope.$watch('searchQuery', function (newValue, oldValue) {
            filterDevices();
          }, true);

          scope.$watch('devices', function (newValue, oldValue) {
            filterDevices();
          }, true);
        }

        function filterDevices() {
          var newFilteredDevices = scope.devices;

          if (scope.searchQuery.length > 0) {
            var lowercaseQuery = scope.searchQuery.toLowerCase();
            newFilteredDevices = newFilteredDevices.filter(function (d) {
              return (d.name.toLowerCase().indexOf(lowercaseQuery) > -1 ||
                d.customerName.toLowerCase().indexOf(lowercaseQuery) > -1 ||
                d.id.toLowerCase().indexOf(lowercaseQuery) > -1);
            });
          }

          if (!scope.showRedDevices) {
            newFilteredDevices = newFilteredDevices.filter(function (d) {
              return d.status !== 'red';
            });
          }

          if (!scope.showYellowDevices) {
            newFilteredDevices = newFilteredDevices.filter(function (d) {
              return d.status !== 'yellow';
            });
          }

          if (!scope.showGreenDevices) {
            newFilteredDevices = newFilteredDevices.filter(function (d) {
              return d.status !== 'green';
            });
          }

          scope.filteredDevices = newFilteredDevices;
          scope.overlay.map_changed();
          readyToRefit = true;
        }

        function preprocessDevices() {
          scope.devices.forEach(function(device) {
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
                scope.greenCount++;
              } else {
                device.status = 'yellow';
                scope.yellowCount++;
              }
            } else {
              device.status = 'red';
              scope.redCount++;
            }
          }
        });
      }
      function convertDevicesToMarkers(devices) {
        var data = {};
        devices.forEach(function(device) {
          if (device.location) {
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
}]);