(function() {
  angular.module('intercom', ['ngMaterial'])
  .factory('intercomService', function ($window, toastr, SoftwareVersion, userService) {
      return {
        logSoftwareVersion: function (softwareVersion, defaultSoftwareVersion, level, userId) {
          var softwareVersionName;
          SoftwareVersion.find({where:{id:softwareVersion}}, function (softwareversion) {
            if (!_.isEmpty(softwareversion)) {
              var version = softwareversion.filter(function (index) {return index.id === softwareVersion});
              if (_.isEmpty(version)) {
                var version = softwareversion.filter(function (index) {return index.id === defaultSoftwareVersion.id});
              }
            }
            if (!softwareVersion) {
              softwareVersionName = 'Default: ' + version[0].name;
            } else {
              softwareVersionName = version[0].name;
            }
            if ($window.Intercom) {
              $window.Intercom('trackEvent', 'software-version-update',  {
                name: softwareVersionName,
                id: softwareVersion,
                email: userService.getUser().email,
                level: level,
                userId: userId
              });
            }
            $window.Intercom('update');
          });
        }
      }
    })
  })();