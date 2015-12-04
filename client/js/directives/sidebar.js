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
        addFilterFunction: "=addFilterFunction",
        selectConnectorFunction: "=selectConnectorFunction",
        deleteFunction: "=deleteFunction",
        canModifyEventUrlFunction: "=canModifyEventUrlFunction",
        canModifyImageServerUrlFunction: "=canModifyImageServerUrlFunction",
        canModifyCheckinIntervalFunction: "=canModifyCheckinIntervalFunction",
        canModifySignallingServerFunction: "=canModifySignallingServerFunction",
        canModifySoftwareVersionFunction: "=canModifySoftwareVersionFunction",
        createSoftwareVersionFunction: "=createSoftwareVersionFunction",
        softwareVersions: "=softwareVersions",
        filters: "=filters"
      },
      link: function (scope, element, attrs) {
        scope.openSoftwareVersionForm = scope.$parent.openSoftwareVersionForm,
        scope.addFilter = function(customerId) {
          scope.addFilterFunction(customerId);
        }
        scope.addLicense = function(customerId) {
          scope.addLicenseFunction(customerId);
        }
        scope.showLicense = function(license) {
          scope.showLicenseFunction(license);
        }
        scope.selectConnector = function(connector) {
          scope.selectConnectorFunction(connector);
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
        scope.canModifySignallingServer = function(model) {
          return scope.canModifySignallingServerFunction(model);
        }
        scope.canModifySoftwareVersion = function(model) {
          return scope.canModifySoftwareVersionFunction(model);
        }
        scope.createSoftwareVersion = function(model) {
          return scope.createSoftwareVersionFunction(model);
        }
        var originatorEv;
        scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
      }
    }
  });