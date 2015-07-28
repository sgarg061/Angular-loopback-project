angular.module('app').controller('LogoutController', function (auth, $scope, $location, store) {
  auth.signout();
  $scope.$parent.message = '';
  store.remove('profile');
  store.remove('token');
  $scope.$parent.message = '';
  $location.path('/login');
});