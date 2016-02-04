angular
  .module('app')
  .directive('map', ['$state', 'DeviceLogEntry', function($state, DeviceLogEntry) {
    return {
      restrict: 'E',
      templateUrl: '/views/map.html',
      scope: {
        devices: '=devices'
      },
      link: function (scope, element, attrs) {
        var smallMarkerRadius = 7.5;
        var bigMarkerRadius = 10;

        scope.showGreenDevices = true;
        scope.showYellowDevices = true;
        scope.showRedDevices = true;
        scope.greenCount = 0;
        scope.redCount = 0;
        scope.yellowCount = 0;
        scope.searchQuery = '';

        scope.devices = [];
        scope.filteredDevices = [];

        scope.overlay = new google.maps.OverlayView();
        scope.layer = null;
        scope.map = new google.maps.Map(d3.select('#map').node(), {
          zoom: 8,
          center: new google.maps.LatLng(45, -73),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        loadMarkers();
        getUpdates(new Date());
        watchForChanges();

        var colourTransitionMapping = {
          red: '#DE0808',
          green: 'green',
          yellow: '#F7CC05'
        }; // yeah, this sucks.  not sure how to do this yet...

        var attempts = 0;
        function getUpdates(lastDate) {
          console.log('querying...', lastDate);
          var newLastDate = new Date();
          DeviceLogEntry.find({
            filter: {
              where: {checkinTime: {gt: lastDate}},
              fields: ['id', 'deviceId', 'onlineCameras', 'totalCameras']
            }
          })
          .$promise
          .then(function(checkins) {
              if  (checkins.length > 0) {
                checkins.forEach(function(c) {
                  console.log('new checkin from ', c);
                  pulse(c.deviceId);
                });
              }

              setTimeout(function() {
                getUpdates(newLastDate);
              }, 5000);
          });
        }

        function pulse(id) {
          try {
            var elem = d3.select('#marker-' + id);
            var originalColour = colourTransitionMapping[elem.data()[0].status];
            elem.transition().duration(500).style('fill', 'blue');
            elem.selectAll('circle').transition().duration(500).attr('r', bigMarkerRadius);

            setTimeout(function() {
              elem.transition().duration(500).style('fill', originalColour);
              elem.selectAll('circle').transition().duration(500).attr('r', smallMarkerRadius);
            }, 1000);
          } catch (err) {
          }
        }

        function loadMarkers() {
          console.log('loading markers');
          if (scope.devices.length <= 0) {
            setTimeout(function() {
              loadMarkers();
            }, 100); // TODO: this is hacky.  how can we get a signal on change?
          } else {
            preprocessDevices();
            filterDevices();

            // Add the container when the overlay is added to the map.
            scope.overlay.onRemove = function() {
              console.log('huh!!');
              scope.layer.remove();
              console.log(scope.layer);
            };

            scope.overlay.onAdd = function() {
              scope.layer = d3.select(this.getPanes().overlayMouseTarget).append('div')
                .attr('class', 'locations');
            };

            scope.overlay.draw = function() {
              console.log('drawing');
              var data = convertDevicesToMarkers(scope.filteredDevices);
            var bounds = new google.maps.LatLngBounds();

            console.log('hmm', Object.keys(data).length);

            Object.keys(data).forEach(function(d) {
              var datapoint = data[d];
              bounds.extend(new google.maps.LatLng(datapoint[1], datapoint[0]));
            });
              var projection = this.getProjection(), padding = 15;

              var markers = scope.layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
                .enter().append('svg:svg')
                .each(transform)

              // Add a circle.
              markers.append('svg:circle')
                .attr('r', 7.5)
                .attr('cx', padding)
                .attr('cy', padding)
                .style('cursor', 'pointer')
                .on('mouseover', function(d) {
                  d3.select(this).transition().duration(500).attr('r', bigMarkerRadius);
                })
                .on('mouseout', function (d) {
                  d3.select(this).transition().duration(500).attr('r', smallMarkerRadius);
                })
                .on('click', function(d) {
                  scope.selectDevice(d);
                });

              // Add a label.
              /*markers.append("svg:text")
                .attr("x", padding + 7)
                .attr("y", padding + 10)
                .attr("dy", ".31em")
                .text(function(d) { return d.key; });*/

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

              scope.map.fitBounds(bounds);
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
            //loadMarkers();
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