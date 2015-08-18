// LoginCtrl.js
angular.module('app').controller('LoginController', function($scope, $state, auth) {
  
  $scope.signin = function() {
    $scope.$parent.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      connection: 'Username-Password-Authentication',
      popup: false,
      username: $scope.username,
      password: $scope.password,
      authParams: {
        scope: 'openid profile' // This is if you want the full JWT
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      $scope.$parent.message = '';
      $state.go('cloud');
      $scope.loading = false;
    }, function(err) {
      console.log("Error :(", err);
      $scope.$parent.message = 'invalid credentials';
      $scope.loading = false;
    });
  }

});