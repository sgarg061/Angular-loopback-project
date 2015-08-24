angular.module('app').controller('LogoutController', function ($scope, $state, $localStorage) {
	delete $localStorage.token;
    $state.go('login');
});