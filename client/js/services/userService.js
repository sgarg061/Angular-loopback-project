(function() {
    angular.module('customUserService', ['angular-jwt'])
    .factory('userService', function (jwtHelper, $localStorage, $moment) {
        var user = {};

        var loadUserFromToken = function(token) {
            var decodedToken = jwtHelper.decodeToken(token);
            var createdAt = $moment(decodedToken.created_at).unix();

            user = {
                userType: decodedToken.app_metadata.userType,
                resellerId: decodedToken.app_metadata.resellerId,
                cloudId: decodedToken.app_metadata.cloudId,
                email: decodedToken.email,
                id: decodedToken.sub,
                createdAt: createdAt
            };
        };

        return {
            getUserType: function () {
                var token = $localStorage.token;
                if (!user.userType && token) {
                    loadUserFromToken(token);
                }

                return user.userType;
            },
            getResellerId: function () {
                var token = $localStorage.token;
                if (!user.userType && token) {
                    loadUserFromToken(token);
                }
                return user.resellerId;
            },
            getCloudId: function () {
                var token = $localStorage.token;
                if (!user.userType && token) {
                    loadUserFromToken(token);
                }
                return user.cloudId;
            },
            loadUser: function (token) {
                loadUserFromToken(token);
            },
            getUser: function() {
                return user;
            }
        };
    });
})();