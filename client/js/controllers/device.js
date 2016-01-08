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


    $scope.checkinReasons = ['all','restart','interval','force','shutdown'];
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

    function getReasons() {
      DeviceLogEntry
        .find({
          filter: {
            fields: ['id', 'timestamp','reason']
          },
          groupBy: ['reason']
        }, function(models) {
          console.log('reasongs', models);
        });

      // var logCollection = DeviceLogEntry.getDataSource().connector.collection(DeviceLogEntry.modelName);
      // logCollection.aggregate({
      //   $group: {
      //     _id: { reason: "$reason"},
      //     total: { $sum: 1 }
      //   }
      // }, function(err, records) {
      //   console.log('records',records);
      // });

      console.log('device logs', DeviceLogEntry);
    }

    getDevice();
    getCheckinCount();
    getReasons();
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

  function getCheckinCount() {

    DeviceLogEntry
      .count({
          filter: {
            where: {deviceId: $stateParams.deviceId}
          }
      })
      .$promise
      .then(function(data) {
        $scope.logCount = data.count;
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

  function renderGraph() {

    var detail = document.getElementById('timeline');

    var _width = document.getElementById('device-tab').offsetWidth - 40;
    var _height = $scope.checkinHeight - 40;
    var _innerwidth = _width - 20;
    var _innerheight = $scope.checkinHeight - 140;

    var _marginLeft = 30;

    var currentOpen = null;


    var detailTextBox = document.getElementById('detail-text');
    detailTextBox.setAttribute('style', `width: ${_innerwidth - 20}px; height: ${_innerheight - 20}px;`);

    var svg = d3.select('#timeline').append('svg')
      .attr('id', 'timeline-svg')
      .attr('width', _width)
      .attr('height', _height);

    /**
    * x scale
    */

    var start = new Date();
    var end = new Date();

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    var checkInData = fakeCheckins(20);


    var _domain = [start, end];
    var xScale = d3.time.scale.utc().domain(_domain).rangeRound([0, _innerwidth]);

    /**
    * x axis
    */
    var ticks = d3.time.hours;
    var xAxis = {
      class: 'main-x-axis',
      tickFormat: {
        Day: '%H:%M',
        Week: '%B %d',
      },
      tick: 1,
      tickPadding: 1,
      tickSize: 1,
      'font-size': '0.8em',
      fill: '#fff',
      scroll: {
        class: 'main-x-axis small',
      },
    };



    var xAxisFunc =
      d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(d3.time.format('%H:%M'))
        .ticks(d3.time.hours, getTick(_innerwidth))
        .tickPadding(10)
        .tickSize(1)
        .tickSubdivide(1);

    svg.append('g')
      .attr('class', xAxis.class)
      .attr('transform', `translate(0, 50)`)
      .call(xAxisFunc)
      .selectAll('text')
        .attr('x', _innerwidth / 24 / 2)
        .attr('y', 18)
        .style('font-size', xAxis['font-size'])
        .style('fill', '#888');

    /**
    * 
    */
    
    var dataPointGroup = svg.append('g').attr('id', 'data-points');
    checkInData.forEach(function(checkin) {
      var id = checkin.id;
      var cx = xScale(new Date(parseInt(checkin.timestamp)));
      var cy = 30;
      var r = 5;
      var rHover = 8;
      dataPointGroup.append('circle')
        .attr('id', `circle-${id}-shadow`)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .attr('class', 'check-in-point-shadow')
        .attr('fill', checkin.reasonColor)
    });

    checkInData.forEach(function(checkin) {
      var id = checkin.id;
      var cx = xScale(new Date(parseInt(checkin.timestamp)));
      var cy = 30;
      var r = 5;
      var rHover = 8;
      dataPointGroup.append('circle')
        .attr('id', `circle-${id}`)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', rHover)
        .attr('class', 'check-in-point')
        .attr('fill', checkin.reasonColor)
        .on('mouseover', function() {
          d3.select(`#tooltip-${id}`).transition().duration(300).style('opacity', 1);
        })
        .on('mouseout', function() {
          if(currentOpen !== id) {
            d3.select(`#tooltip-${id}`).transition().duration(300).style('opacity', 0);
          }
        })
        .on('click', function() {
          if (currentOpen && currentOpen === id) {
            currentOpen = null;
            d3.select(`#check-in-detail`).transition().duration(300).attr('width', 0).attr('height', 0);
            d3.select(`#check-in-detail-arrow-group`).transition().duration(300).attr('transform', `translate(0, 0)`);
            d3.select(`#check-in-detail-arrow`).transition().duration(300).attr('width', 0).attr('height', 0);

            d3.select(`#circle-${id}-shadow`).transition().duration(300).attr('r', r);
            d3.select(`#check-in-detail div`).remove();
            detailTextBox.classList.remove("opened");
            detail.classList.remove("opened");
          } else {
            d3.select(`#circle-${currentOpen}-shadow`).transition().duration(300).attr('r', r);
            d3.select(`#tooltip-${currentOpen}`).transition().duration(300).style('opacity', 0);
            d3.select(`#check-in-detail div`).remove();

            currentOpen = id;
            d3.select(`#check-in-detail`).transition().duration(300).attr('width', _innerwidth).attr('height', _innerheight);
            d3.select(`#check-in-detail-arrow-group`).transition().duration(300).attr('transform', `translate(${cx}, 80)`)
            d3.select(`#check-in-detail-arrow`).transition().duration(300).attr('width', 40).attr('height', 40);
            d3.select(`#circle-${currentOpen}-shadow`).transition().duration(300).attr('r', rHover);

            // console.log('children',detailTextBox.childNodes);

            detailTextBox.classList.add("opened");
            detail.classList.add("opened");
            viewCheckin(checkin);
          }
        });

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(checkin.timestamp*1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


      dataPointGroup.append('text')
        .attr('id', `tooltip-${id}`)
        .attr('x', cx - 30)
        .attr('y', cy - 15)
        .style('opacity', 0)
        .attr('class', 'check-in-point-tooltip')
        .attr('fill', '#555')
        .text(formattedTime)
    });

    

    var checkInDetailBox = svg.append('g');
    
    checkInDetailBox.append('g')
      .attr('id', 'check-in-detail-arrow-group')
      .append('rect')
        .attr('id', 'check-in-detail-arrow')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
        .attr('fill', '#f1f1f1')
        .attr('transform', `rotate(45)`)
    checkInDetailBox.append('rect')
      .attr('id', 'check-in-detail')
      .attr('x', 0)
      .attr('y', 100)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', '#f1f1f1')
    checkInDetailBox.append('text')
      .attr('x', 10)
      .attr('y', 120)
      .attr('id', 'check-in-detail-text');

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

    var reasonColorCode = {
      default: '#0088cc',
      restart: '#f54',
      info: '#ffa000'
    };


    while(count > 0) {
      var checkInTime = new Date(`Fri Jan 08 2016 ${Math.floor((Math.random() * 24) + 0)}:${Math.floor((Math.random() * 59) + 0)}:${Math.floor((Math.random() * 59) + 0)} GMT-0500 (EST)`);
      var reasonId = Math.floor((Math.random() * 3) + 0);
      var obj = {
        deviceId: `30a34860-b3e8-11e5-b146-fbfc0da4d611`,
        timestamp: checkInTime.getTime(),
        checkinTime: checkInTime,
        reason: reasonOptions[reasonId],
        reasonColor: reasonColorCode[reasonOptions[reasonId]],
        id: count
      }
      points.push(obj);

      count--;
    }

    return points;
  }


  $scope.checkin = checkin;
  $scope.loadMore = loadMore;
  $scope.setOverrideIpAddress = setOverrideIpAddress;
  $scope.goHome = goHome;

  }]);
