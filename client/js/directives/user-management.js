angular
  .module('app')
  .directive('userManagement', ['$state', 'Auth', '$mdDialog', function($state, Auth, $mdDialog) {
    return {
      restrict: 'E',
      templateUrl: '/views/user-management.html',
      scope: {
        users: '=users',
        devices: '=devices'
      },
      link: function (scope, element, attrs) {
        console.log('alright, ', scope.devices);
        scope.selectedUser = null;
        scope.selectedDevices = [];
        scope.shouldDefaultToHD = false;
        scope.shouldPlayWebRTC = false;
        scope.userSort = {
          column: '',
          descending: false
        };

        scope.changeUserSorting = function (column) {
          var sort = scope.userSort;

          if (sort.column === column) {
            sort.descending = !sort.descending;
          } else {
            sort.column = column;
            sort.descending = false;
          }
        };

        scope.selectUser = function (user) {
          scope.selectedUser = user;
          console.log('selected User', user);
          // TODO set selected devices
          scope.selectedDevices = [];
          if (scope.selectedUser.app_metadata.devices) {
            scope.selectedUser.app_metadata.devices.forEach(function (id) {
              scope.selectedDevices.push.apply(scope.selectedDevices, scope.devices.filter(function (d) {
                return d.id === id;
              }));
            });
          }
          scope.shouldPlayWebRTC = user.app_metadata.wrtc === 'true';
          scope.shouldDefaultToHD = user.app_metadata.defaultToHD === 'true';
        };

        scope.saveUser = function () {
          console.log('selected devices', scope.selectedDevices);
          var appMetadata = {};
          appMetadata.wrtc = scope.shouldPlayWebRTC;
          appMetadata.defaultToHD = scope.shouldDefaultToHD;
          appMetadata.devices = scope.selectedDevices.map(function (device) {
            return device.id;
          });

          if (appMetadata.devices.length === 0) {
            appMetadata.devices =  null;// auth0 won't let us pass in an empty array.
          }

          console.log('updating', scope.selectedUser);
          console.log('with ', appMetadata);
          // update user metadata
          Auth.updateUserMetadata({
            id: scope.selectedUser.user_id,
            metadata: appMetadata
          })
            .$promise
            .then(function (res) {
              console.log('response:', res);
              for (var i = 0; i < scope.users.length; i++) {
                if (scope.users[i].user_id === scope.selectedUser.user_id) {
                  scope.users[i] = res.response;
                  break;
                }
              }

              scope.selectedUser = null;
            })
            .catch(function (err) {
              toastr.error('Error updating user' + err);
            });
        }

        scope.devicesSearch = function (query) {
          var lowercaseQuery = query.toLowerCase();
          var results = query ?
            scope.devices.filter(function (d) {
              return d.name.toLowerCase().indexOf(lowercaseQuery) !== -1;
            }) : [];

            return results;
        };

        scope.isSelected = function (device) {
          return scope.selectedDevices.map(function (d) {
            return d.id;
          }).filter(function (id) {
            return device.id === id;
          }).length > 0;
        };

        scope.selectDevice = function (device) {
          scope.selectedDevices.push(device);
        };

        scope.openMenu = function ($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        scope.deleteUser = function () {
          // delete
          scope.selectedUser = null;
        };

        scope.setPassword = function (user) {
          $mdDialog.show({
            templateUrl: 'views/setPassword.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            controller: function (scope, $mdDialog) {
              scope._setPassword = function () {
                console.log('setting a password hurray', scope.userPassword);
                console.log('hmm', user);
                //console.log('bah?', selectedUser);
                console.log('err', scope);
              };

              scope.close = function () {
                $mdDialog.cancel();
              };
            }
          })
            .then(function (result) {
              console.log('done...', result);
            });
        };
      }
    }
  }]);