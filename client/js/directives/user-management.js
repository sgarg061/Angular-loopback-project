angular
  .module('app')
  .directive('userManagement', ['$state', 'Auth', '$mdDialog', 'toastr', function($state, Auth, $mdDialog, toastr) {
    return {
      restrict: 'E',
      templateUrl: '/views/user-management.html',
      scope: {
        users: '=users',
        devices: '=devices',
        userTypes: '=userTypes',
        userKey: '=userKey',
        userValue: '=userValue'
      },
      link: function (scope, element, attrs) {
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
          Auth.deleteUser({
            id: scope.selectedUser.user_id
          })
          .$promise
          .then(function (res) {
            for (var i = 0; i < scope.users.length; i++) {
              if (scope.users[i].user_id === scope.selectedUser.user_id) {
                scope.users.splice(i, 1); // remove the element
                break;
              }
            }
            scope.selectedUser = null;
          })
          .catch(function (err) {
            toastr.error('Error deleting user');
            console.error(err);
          });

        };

        scope.setPassword = function (user) {
          $mdDialog.show({
            templateUrl: 'views/setPassword.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            controller: function (scope, $mdDialog) {
              scope._setPassword = function () {
                Auth.forceSetPassword({
                  id: user.user_id,
                  password: scope.userPassword
                })
                .$promise
                .then(function (res) {
                  toastr.success('Password successfully set');
                  $mdDialog.cancel();
                })
                .catch(function (err) {
                  console.log('error:', err);
                  toastr.error('Could not set password');
                });
              };

              scope.close = function () {
                $mdDialog.cancel();
              };
            }
          })
          .then(function (result) {
          });
        };

        // TODO: inject user types into the directive and pass them through the template
        scope.createUser = function (userTypes, userKey, userValue) {
          $mdDialog.show({
            templateUrl: 'views/createUser.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            scope: scope.$new(),
            controller: function (scope, $mdDialog) {
              scope.userTypes = userTypes;
              scope.newUser = {
                userType: userTypes[0]
              };

              scope._createUser = function () {
                Auth.createUser({
                  email: scope.newUser.email,
                  password: scope.newUser.password,
                  userType: scope.newUser.userType,
                  orgId: userValue
                })
                  .$promise
                  .then(function (res) {
                    var newUser = JSON.parse(res.response);
                    toastr.success('User successfully created');
                    scope.users.push(newUser);
                    $mdDialog.cancel();
                  })
                  .catch(function (err) {
                    toastr.error('Error creating user: ' + err.statusText);
                  });
              };

              scope.closeCreateUser = function() {
                $mdDialog.cancel();
              };
            }
          });
        };
      }
    }
  }]);