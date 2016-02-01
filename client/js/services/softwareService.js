(function() {
    angular.module('dialogBox', ['ngMaterial'])
    .factory('softwareService', function ($mdDialog, toastr, SoftwareVersion, Cloud) {
        return {

          dialog : function (id, newValueSoftwareVersionId){
            return ($mdDialog.show({
              controller: function (scope, $mdDialog){
                scope.message = '';
                scope.softwareVersion = '';
                SoftwareVersion.find({filter:{where: {id: newValueSoftwareVersionId}}})
                .$promise
                .then(function(softwareVersion) {
                  if(String(_.isEmpty(softwareVersion)) === 'false'){
                    scope.softwareVersion = softwareVersion[0].name;
                  } else{toastr.error('invalid array');}
                });
                scope.updateVersion = function() {
                 $mdDialog.hide(); 
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