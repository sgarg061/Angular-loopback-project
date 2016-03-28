angular.module('app').controller('LoginController', function($scope, $state, Auth, $localStorage, $location, toastr, blockUI, userService) {

  function successAuth(res, headers) {
    blockUI.stop();
    var result = JSON.parse(JSON.stringify(res));
    $localStorage.token = result.response.authToken;
    userService.loadUser(result.response.authToken);
    if ($localStorage.redirect !== $localStorage.defaultPath && $localStorage.redirect !== undefined){
      $location.path($localStorage.redirect);
      $localStorage.redirect = null;
    } else {
      $state.go('home');
    }
  }

  function errorAuth(res) {
    blockUI.stop();
    console.log('errorAuth res: ' + res);
    toastr.error(res.data.error.status === 401 ? "Invalid username or password" : res.data.error.message, 'Error');
  }

  $scope.login = function () {
    var formData = {
      username: $scope.username,
      password: $scope.password
    };
    
    // Block the user interface until the login succeeds or fails
    blockUI.start('Logging in...');

    Auth.login(formData, successAuth, errorAuth);
    
  };


});