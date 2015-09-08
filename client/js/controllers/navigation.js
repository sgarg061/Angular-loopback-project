angular.module('app').controller('NavigationController', function($scope, auth) {
	$scope.auth = auth;
	$scope.isAuthenticated = auth.isAuthenticated;
	console.log(JSON.stringify(auth));

	$scope.$on('auth-login-success', function () {
      $scope.isAuthenticated = true;
      $location.path('/shipments');
    });
    $scope.$on('auth-login-failed', function () {
      console.log("There was an error");
    });

});