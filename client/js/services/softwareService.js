(function() {
    angular.module('dialogBox', ['ngMaterial'])
    .factory('softwareService', function ($mdDialog, toastr, SoftwareVersion, Cloud) {
        return {

          dialog : function (id, newValueSoftwareVersionId, softwareVersionName){
            return ($mdDialog.show({
              controller: function (scope, $mdDialog){
                scope.message = '';
                scope.softwareVersion = '';
                SoftwareVersion.find({filter:{where: {id: newValueSoftwareVersionId}}})
                .$promise
                .then(function(softwareVersion) {
                  if(String(_.isEmpty(softwareVersion)) === 'true'){
                    scope.softwareVersion = 'Default ' + softwareVersionName;
                  } else if(String(_.isEmpty(softwareVersion)) === 'false'){
                    scope.softwareVersion = softwareVersion[0].name;
                    softwareVersionName = softwareVersion[0].name;
                  } else {toastr.error('invalid array');}
                });
                scope.updateVersion = function() {
                  $mdDialog.hide(scope.softwareVersion); 
                }; 
                scope.close = function() {
                  toastr.info('Version not updated since you cancelled')
                  $mdDialog.cancel();
                };
              
              },
              templateUrl: 'views/confirmationMessage.html',
            }));
          },
        };
    });
})();