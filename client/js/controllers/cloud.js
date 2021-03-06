angular
  .module('app')
  .controller('CloudController', ['$window','$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'SoftwareVersion', 'POSFilter', 'SearchFilter', '$mdDialog', 'toastr', 'userService', 'filterService', 'softwareService', 'intercomService',
    function($window, $scope, $state, $stateParams, Cloud, Reseller, SoftwareVersion, POSFilter, SearchFilter, $mdDialog, toastr, userService, filterService, softwareService, intercomService) {
    $scope.currentResellerPage = 0;
    $scope.resellersPerPage = 1000; // FIXME
    $scope.totalResellers = 0;

    $scope.clouds = [];
    $scope.cloudId = null;
    $scope.cloud = null;

    $scope.allDevices = [];

    $scope.children = [];
    $scope.filters = [];
    $scope.reports = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];

    $scope.cascadedReports = [];
    $scope.ownedReports = [];

    $scope.selectedTab = $stateParams.tabIndex;

    function watchForChanges() {
      // watch cloud for updates and save them when they're found

      $scope.$watch("cloud", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.cloud.id;

          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateCloud(id, {eventServerUrl: newValue.eventServerUrl}, 'Event server URL has been updated');
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateCloud(id, {imageServerUrl: newValue.imageServerUrl}, 'Image server URL has been updated');
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateCloud(id, {signallingServerUrl: newValue.signallingServerUrl}, 'Signalling server has been updated');
          }
          if (!(_.isEqual(newValue.turnServerUrl, oldValue.turnServerUrl))) {
             updateCloud(id, {turnServerUrl: newValue.turnServerUrl}, 'Turn server URL has been updated');
          }
          if (!(_.isEqual(newValue.stunServerUrl, oldValue.stunServerUrl))) {
             updateCloud(id, {stunServerUrl: newValue.stunServerUrl}, 'Stun server URL has been updated');
          }
          if (newValue.updateUrl !== oldValue.updateUrl) {
            updateCloud(id, {updateUrl: newValue.updateUrl}, 'URL has been updated');
          }
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateCloud(id, {checkinInterval: newValue.checkinInterval}, 'Check in interval has been updated');
          }
      }


      }, true);
    }
    $scope.updateVersion = function (softwareVersion) {
      var id = $scope.cloud.id;
      softwareService.dialog(id,softwareVersion, '').then(function(result) {
        updateCloud(id, {softwareVersionId: softwareVersion}, 'Software version has been updated');
        $scope.currentSoftwareVersion = softwareVersion;
        intercomService.logSoftwareVersion(softwareVersion, null, 'Cloud', $stateParams.cloudId);
      }, function(result){$scope.cloud.softwareVersionId = $scope.currentSoftwareVersion;});
    }
    
    function updateCloud(id, changedDictionary, message) {
      Cloud.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(cloud) {toastr.info(' ' + message);},
          function (res) {
        toastr.error(res.statusText, 'Error Invalid Value');
      });
    }

    function getCloud() {
      Cloud
        .find({
          filter: {
            where: {id: $stateParams.cloudId},
            include: ['softwareVersion', {
              relation: 'resellers',
              scope: {
                order: 'name ASC',
                limit: $scope.currentResellerPage,
                skip: $scope.currentResellerPage * $scope.resellersPerPage,
                include: {
                  relation: 'customers',
                  scope: {
                    include: {
                      relation: 'devices',
                      scope: {
                        include: {
                          relation: 'cameras',
                          scope: {
                            fields: ['id', 'name', 'status']
                          }
                        }
                      }
                    }
                  }
                }
              }
            }]
          }
        })
        .$promise
        .then(function(clouds) {
          if(!_.isEmpty(clouds)){
            $scope.cloud = clouds[0];
            $scope.cloudId = clouds[0].id;
            $scope.currentSoftwareVersion = clouds[0].softwareVersionId;
            $scope.cloud.turnServerUrls = clouds[0].turnServerUrl;
            $scope.cloud.stunServerUrls = clouds[0].stunServerUrl;
            $scope.children = clouds[0].resellers;

            $scope.cloud.resellers.forEach(function (reseller) {
              reseller.customers.forEach(function (customer) {
                customer.devices.forEach(function (device) {
                  device.customerName = customer.name;
                  device.checkinInterval = device.checkinInterval ||
                    customer.checkinInterval ||
                    reseller.checkinInterval ||
                    $scope.cloud.checkinInterval;

                  $scope.allDevices.push(device);
                })
              })
            })
          } else {
            toastr.error('invalid arrray');
          }
          $scope.userTypes = ['cloud'];
          getUsers($scope.cloudId, function (users) {
            $scope.users = users;
          });

          watchForChanges();
        });
    }
    function getClouds() {
      Cloud
        .find({
          filter: {
            fields: {id: true, name: true},
            order: 'name ASC'
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.clouds    = [].concat(clouds);

          // select the first by default
          if (!$stateParams.cloudId && clouds.length > 0) {
            $scope.selectCloud(clouds[0]);
          }
        });
    }

    function getUsers(id, cb) {
      Cloud.prototype$listUsers({
        id: id
      })
      .$promise
      .then(function(res) {
        cb(res.users);
      })
      .catch(function (err) {
        console.error('error listing users', err);
        toastr.error('Unable to list users: ' + err.data.error.message);
        cb([]);
      });
    }



    function getFilters(){
      POSFilter
        .find({
          filter: {
            where: {
              creatorId: $stateParams.cloudId,
              creatorType: 'cloud'
            }
          }
        })
        .$promise
        .then(function(connectors) {
          $scope.filters = [];
          $scope.ownedFilters = [];
          $scope.cascadedFilters = [];
          for(var i in connectors){
            var filter = connectors[i];
            if (i > -1) {
              filter.owner = (filter.creatorType == 'cloud' || userService.getUserType() == 'solink');
              $scope.filters.push(filter);

              filter.creatorType == 'cloud' ? $scope.ownedFilters.push(filter) :$scope.cascadedFilters.push(filter)
            };
          }

        })
    }


    function getReports(){
      SearchFilter
        .find({
          filter: {
            where: {
              creatorId: $stateParams.cloudId,
              creatorType: 'cloud'
            }
          }
        })
        .$promise
        .then(function(filters) {
          $scope.reports = [];
          $scope.ownedReports = [];
          $scope.cascadedReports = [];
          for(var i in filters){
            var filter = filters[i];
            filter.filter = JSON.stringify(filter.filter);
            if (i > -1) {
              filter.owner = (filter.creatorType == 'cloud' || userService.getUserType() == 'solink');
              $scope.reports.push(filter);

              filter.creatorType == 'cloud' ? $scope.ownedReports.push(filter) : $scope.cascadedReports.push(filter)
            };
          }
        })

    }


    $scope.goHome = function () {
      $state.go('home');
    }

    if ($stateParams.cloudId) {
      getFilters();
      getReports();
      getCloud();
      getSoftwareVersions();
    }

    $scope.pageChanged = function() {
      $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.selectReseller = function(reseller) {
      $state.go('reseller', {resellerId: (typeof reseller  === 'string') ? reseller : reseller.id});
    }

    $scope.selectCloud = function(cloud) {
      if (typeof cloud == 'string') {
        $scope.cloud = $scope.clouds.filter(function (c) {
          return c.id === cloud;
        })[0];
      } else {
        $scope.cloud = cloud;
      }
      $state.go('cloud', {cloudId: cloud.id}, {reload: true});
    }

    $scope.selectCustomer = function() {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : $scope.customer.id}, {reload: true});
    }

    $scope.selectDevice = function(device) {
      $state.go('device', {deviceId: (typeof device === 'string') ? device : device.id}, {reload: true});
    }

    $scope.addCloud = function() {
      Cloud
        .create($scope.newCloud)
        .$promise
        .then(function(cloud) {
          $scope.newCloud = '';
          $scope.cloudForm.name.$setPristine();
          $('.focus').focus();
          getClouds();
        });
    };

    $scope.removeCloud = function(item) {
      Cloud
        .deleteById(item)
        .$promise
        .then(function() {
          getClouds();
        });
    };

    $scope.openResellerForm = function(event, cloud) {
      $mdDialog.show({
        controller: function DialogController($scope, $mdDialog) {
                      $scope.newReseller = {
                        cloudId: cloud.id,
                        email: '',
                        password: ''
                      };
                      $scope.create = function() {
                        $scope.newReseller['cloudId'] = cloud.id;

                        Reseller
                        .find({
                          filter: {
                            where: {and: [{'cloudId':cloud.id}, {'name':$scope.newReseller.name}]}
                          }
                        })
                        .$promise
                        .then(function(reseller){ //if the reseller already exists
                          if(reseller && reseller.length > 0) {
                              toastr.error("Reseller already exists; please enter a unique name.");
                          } else {
                            Reseller.create($scope.newReseller)
                            .$promise
                            .then(function(reseller) {
                              getCloud();
                            }, function (res) {
                              toastr.error(res.data.error.message, 'Error');
                            });
                            $mdDialog.cancel();
                          }
                        });
                      };
                      $scope.cancel = function() {
                        $mdDialog.cancel();
                      };
        },
        templateUrl: 'views/resellerForm.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(result) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    }

  $scope.openSoftwareVersionForm = function(event) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
                    $scope.newSoftwareVersion = {};
                    $scope.create = function() {
                      SoftwareVersion.create($scope.newSoftwareVersion)
                      .$promise
                      .then(function(softwareVersion) {
                        $mdDialog.cancel();
                        getSoftwareVersions();
                      }, function (res) {
                        toastr.error(res.data.error.message, 'Error');
                      });
                      
                    };
                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };
      },
      templateUrl: 'views/softwareVersionForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
    })
    .then(function(result) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
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
        $scope.softwareVersions = [].concat(versions);
      })
    }

  $scope.canModifyEventUrl = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };
  $scope.canModifyImageServerUrl = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  $scope.addServerUrl = function(cloud, serverUrl) {
    var cloudServerUrl = eval('cloud.' + serverUrl);
      $mdDialog.show({
              controller: function DialogController ($scope, $mdDialog) {
                  $scope.create = function() {
                      if(cloudServerUrl === null) {
                        cloudServerUrl = [$scope.model.tempServerUrl];
                        $mdDialog.cancel();
                      } else {
                        if(cloudServerUrl.indexOf($scope.model.tempServerUrl) === -1) { //check for duplicate entry
                          cloudServerUrl.push($scope.model.tempServerUrl);
                          $mdDialog.cancel();
                        } else {
                          toastr.error("Duplicate URL entry. Please enter a unique URL.");
                        }
                      }
                      eval('cloud.' + serverUrl + '= cloudServerUrl');
                  };
                  $scope.close = function() {
                      $mdDialog.cancel();
                  };
              },
              templateUrl: 'views/newServerUrl.tmpl.html',
              parent: angular.element(document.body),
              targetEvent: event,
              clickOutsideToClose: true
          })
          .then(function(result) {
      }, function() {
    });
  };

  $scope.deleteServerUrl = function(cloud, serverUrl, deleteUrl) {
      var cloudServerUrl = eval ('cloud.' + serverUrl)
      var deleteIndex = cloudServerUrl.indexOf(deleteUrl);

      if(deleteIndex > -1){
        cloudServerUrl.splice(deleteIndex, 1);
      }
  };

  $scope.canModifyCheckinInterval = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  $scope.canModifySoftwareVersion = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  $scope.canModifySignallingServer = function() {
    var userType = userService.getUserType();
    return ['solink'].indexOf(userType) > -1;
  };

  $scope.selectConnector = function(connector) {
  };


  $scope.addFilter = function(connector) {
    filterService.addFilter('cloud', $stateParams.cloudId, function(){
      getFilters();
    });
  };

  $scope.actionFilter = function(filter) {
    filterService.actionFilter(filter, function(){
      getFilters();
    });
  };


  $scope.addReport = function(connector) {
    filterService.addReport('cloud', $stateParams.cloudId, function(){
      getReports();
    });
  };

  $scope.actionReport = function(filter) {
    filterService.actionReport(filter, function(){
      getReports();
    });
  };

}]);

