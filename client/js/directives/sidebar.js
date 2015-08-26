angular
  .module('app')
  .directive('sidebar', function() {
    return {
      restrict: 'E',
      templateUrl: "/views/sidebar.html",
      scope: {
        model: "=model",
        type: "=type",
        addLicenseFunction: "=addLicenseFunction",
        showLicenseFunction: "=showLicenseFunction",
        deleteFunction: "=deleteFunction"
      },
      link: function (scope, element, attrs) {
      
        scope.addLicense = function(customerId) {
          scope.addLicenseFunction(customerId);
        }
        scope.showLicense = function(license) {
          scope.showLicenseFunction(license);
        }
        scope.deleteModel = function(model) {
          scope.deleteFunction(model);
        }
        var originatorEv;
        scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
      }
    }
  });