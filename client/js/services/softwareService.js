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
                  if(_.isEmpty(softwareVersion)){
                    scope.softwareVersion = 'Default: ' + softwareVersionName;
                  } else if(!_.isEmpty(softwareVersion)){
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