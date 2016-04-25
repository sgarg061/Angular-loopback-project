angular.module('app').controller('LogoutController', function ($scope, $state, $localStorage, $window) {
	delete $localStorage.token;
	$window.Intercom('shutdown');
    $state.go('login');
});