angular.module('app')
    .controller('MainController', ['$scope', '$rootScope', '$window', 'userService',
    function($scope, $rootScope, $window, userService) {

        $rootScope.$on("$stateChangeStart", function(event, curr, prev){
            var user = userService.getUser();
            if (user && user.userType) {
                $window.Intercom('boot', {
                    app_id: 'p9rbi4pn',
                    email: user.email,
                    created_at: user.createdAt,
                    user_id: user.id
                });
            }
        });
        
}]);