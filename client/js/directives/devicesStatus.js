angular
  .module('app')
  .directive('devicesStatus', function($state) {
    return {
      restrict: 'E',
      templateUrl: '/views/devicesStatus.html',
      scope: {
        device: '='
      },
      link: function (scope, element, attrs){
        scope.vmsLink = scope.$parent.vmsLink;
        scope.listenerLink = scope.$parent.listenerLink;
      }
    }
  });