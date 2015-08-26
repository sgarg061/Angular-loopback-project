angular.module('app').controller('LoginController', function($scope, $state, Auth, $localStorage, toastr, blockUI) {
  
  $scope.username = "cwhiten@solinkcorp.com";
  $scope.password = "test";

  function successAuth(res, headers) {
    blockUI.stop();
    var result = JSON.parse(JSON.stringify(res));
    $localStorage.token = result.response.auth_token;
    $state.go('cloud');
  }

  function errorAuth(res) {
    blockUI.stop();
    console.log('errorAuth res: ' + JSON.stringify(res));
    toastr.error(res.data.error.status === 401 ? "Invalid username or password" : res.data.error.message, 'Error');
  }

  $scope.login = function () {
    var formData = {
      username: $scope.username,
      password: $scope.password
    };

    console.log('login.js username: ' + $scope.username + ' password: ' + $scope.password);

    // Block the user interface until the login succeeds or fails
    blockUI.start('Logging in...');

    Auth.login(formData, successAuth, errorAuth);
    
  };


});