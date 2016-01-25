angular
  .module('app')
  .controller('CloudController', ['$scope', '$state', '$stateParams', 'Cloud', 'Reseller', 'SoftwareVersion', 'POSFilter', '$mdDialog', 'toastr', 'userService',
    function($scope, $state, $stateParams, Cloud, Reseller, SoftwareVersion, POSFilter, $mdDialog, toastr, userService) {

    $scope.currentResellerPage = 0;
    $scope.resellersPerPage = 1000; // FIXME
    $scope.totalResellers = 0;

    $scope.clouds = [];
    $scope.cloudId = null;
    $scope.cloud = null;

    $scope.children = [];
    $scope.filters = [];

    $scope.cascadedFilters = [];
    $scope.ownedFilters = [];
    
    function watchForChanges() {
      // watch cloud for updates and save them when they're found
      $scope.$watch("cloud", function(newValue, oldValue) {
        if (newValue) {
          var id = $scope.cloud.id;
          
          if (newValue.eventServerUrl !== oldValue.eventServerUrl) {
            updateCloud(id, {eventServerUrl: newValue.eventServerUrl});
          }
          if (newValue.imageServerUrl !== oldValue.imageServerUrl) {
            updateCloud(id, {imageServerUrl: newValue.imageServerUrl});
          }
          if (newValue.signallingServerUrl !== oldValue.signallingServerUrl) {
            updateCloud(id, {signallingServerUrl: newValue.signallingServerUrl});
          }
          if (newValue.updateUrl !== oldValue.updateUrl) {
            updateCloud(id, {updateUrl: newValue.updateUrl});
          }
          if (newValue.checkinInterval !== oldValue.checkinInterval) {
            updateCloud(id, {checkinInterval: newValue.checkinInterval});
          }
          if (newValue.softwareVersionId !== oldValue.softwareVersionId) {
            updateCloud(id, {softwareVersionId: newValue.softwareVersionId});
          }
        }
      }, true);
    }

    function updateCloud(id, changedDictionary) {
      Cloud.prototype$updateAttributes({id: id}, changedDictionary)
        .$promise.then(function(cloud) {}, function (res) {
        toastr.error(res.data.error.message, 'Error');
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
                skip: $scope.currentResellerPage * $scope.resellersPerPage
              }
            }]
          }
        })
        .$promise
        .then(function(clouds) {
          $scope.cloud = clouds[0];
          $scope.cloudId = clouds[0].id;

          $scope.children = clouds[0].resellers;

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


    $scope.goHome = function () {
      $state.go('home');
    }

    if ($stateParams.cloudId) {
      getFilters();
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

    $scope.selectCustomer = function(customer) {
      $state.go('customer', {customerId: (typeof customer === 'string') ? customer : customer.id}, {reload: true});
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
                        Reseller.create($scope.newReseller)
                        .$promise
                        .then(function(reseller) {
                          getCloud();
                        }, function (res) {
                          toastr.error(res.data.error.message, 'Error');
                        });
                        $mdDialog.cancel();
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
                        getSoftwareVersions();
                      }, function (res) {
                        toastr.error(res.data.error.message, 'Error');
                      });
                      $mdDialog.cancel();
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
          order: 'name ASC'
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

  function addTurnServerUrl(model) {
    $mdDialog.show({
      controller: function(scope, $mdDialog){
        $scope.newTurnServerUrl ='';
        scope.create = function(newTurnServerUrl){
          $scope.cloud.turnServerUrls.push(newTurnServerUrl);
        }
      }
    })
  }

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
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
                    $scope.newFilter = {
                      name: '',
                      script: '',
                      owner: true
                    };
                    $scope.create = function() {
                      var script = JSON.stringify($scope.newFilter.script);
                      POSFilter.create({
                        id: '',
                        name: $scope.newFilter.name,
                        description: $scope.newFilter.description,
                        script: script,
                        creatorId: $stateParams.cloudId,
                        creatorType: 'cloud' 
                      })
                      .$promise
                      .then(function(customer) {
                        getFilters();
                      }, function (res) {
                        toastr.error(res.data.error.message, 'Error');
                      });
                      $mdDialog.cancel();
                    };
                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  };

  $scope.actionFilter = function(filter) {
    $mdDialog.show({
      controller: function DialogController($scope, $mdDialog) {
        $scope.newFilter = filter

        if (!$scope.newFilter.parsed_script){
          try {
            $scope.newFilter.script = JSON.parse(filter.script)
          }
          catch(err){
            $scope.newFilter.script = filter.script
          }
          
          $scope.newFilter.parsed_script = true
        }

        $scope.newFilter.$edit = true
        $scope.create = function() {
          var script = JSON.stringify($scope.newFilter.script);
          POSFilter.prototype$updateAttributes({id: filter.id},
          {
            name: $scope.newFilter.name,
            description: $scope.newFilter.description,
            script: script
          })
          .$promise
          .then(function(customer) {
            getFilters();
          }, function (res) {
            toastr.error(res.data.error.message, 'Error');
          });
          $mdDialog.cancel();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.destroy = function() {
          var confirm = $mdDialog.confirm()
            .title('Delete Filter')
            .content('Are you sure you want to delete filter ' + $scope.newFilter.name + '?')
            .ok('Yes')
            .cancel('No');

          $mdDialog.show(confirm).then(function() {
            POSFilter.deleteById($scope.newFilter)
              .$promise
              .then(function(customer) {
                getFilters();
              }, function (res) {
                toastr.error(res.data.error.message, 'Error');
              });
          });


        };
      },
      templateUrl: 'views/filterForm.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
      })
      .then(function(result) {
      }, function() {
    }); 
  };
    
  }]);
