angular.module('app').controller('RootController', function($scope, auth) {

  auth.profilePromise.then(function() {
    $scope.$parent.message = 'Welcome ' + auth.profile.name + '!';
  });

  $scope.auth = auth;

});