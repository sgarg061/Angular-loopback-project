(function() {
    angular.module('softwareServiceTest', ['ngMaterial'])
    .factory('softwareService', function ($mdDialog, toastr, SoftwareVersion) {
        return {
          
            findVersion: function(id, newValueSoftwareVersionId, cb){
              return  SoftwareVersion.find({filter:{where: {id: newValueSoftwareVersionId}}});  
              
            },
            close: function (cb) {
                toastr.info('Canceled update. No changes made');
                $mdDialog.cancel();
                cb();
            },
        };
    });
})();