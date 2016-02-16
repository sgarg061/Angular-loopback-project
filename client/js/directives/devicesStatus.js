angular
  .module('app')
  .directive('devicesStatus', function($state) {
    return {
      restrict: 'E',
      templateUrl: '/views/devicesStatus.html',
      scope: {
        device: '='
      }
    }
  });