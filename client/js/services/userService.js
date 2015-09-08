(function() {
    angular.module('customUserService', ['angular-jwt'])
    .factory('userService', function (jwtHelper, $localStorage) {
        var userType;
        var cloudId;
        var resellerId;

        var loadUserFromToken = function(token) {
            var decodedToken = jwtHelper.decodeToken(token);
            userType = decodedToken.app_metadata.userType;

            resellerId = decodedToken.app_metadata.resellerId;
            cloudId = decodedToken.app_metadata.cloudId;
        };

        return {
            getUserType: function () {
                if (!userType) {
                    loadUserFromToken($localStorage.token);
                }

                return userType;
            },
            getResellerId: function () {
                if (!userType) {
                    loadUserFromToken($localStorage.token);
                }
                return resellerId;
            },
            getCloudId: function () {
                if (!userType) {
                    loadUserFromToken($localStorage.token);
                }
                return cloudId;
            },
            loadUser: function (token) {
                loadUserFromToken(token);
            }
        };
    });
})();