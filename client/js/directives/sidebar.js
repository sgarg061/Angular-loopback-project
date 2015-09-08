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
        deleteFunction: "=deleteFunction",
        canModifyEventUrlFunction: "=canModifyEventUrlFunction",
        canModifyImageServerUrlFunction: "=canModifyImageServerUrlFunction",
        canModifyCheckinIntervalFunction: "=canModifyCheckinIntervalFunction",
        canModifySoftwareVersionFunction: "=canModifySoftwareVersionFunction",
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
        scope.canModifyEventUrl = function(model) {
          return scope.canModifyEventUrlFunction(model);
        }
        scope.canModifyImageServerUrl = function(model) {
          return scope.canModifyImageServerUrlFunction(model);
        }
        scope.canModifyCheckinInterval = function(model) {
          return scope.canModifyCheckinIntervalFunction(model);
        }
        scope.canModifySoftwareVersion = function(model) {
          return scope.canModifySoftwareVersionFunction(model);
        }
        var originatorEv;
        scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
      }
    }
  });