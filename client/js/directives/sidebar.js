angular
  .module('app')
  .directive('sidebar', function() {
    return {
      restrict: 'E',
      templateUrl: "/views/sidebar.html",
      scope: {
        model: "=model",
        type: "=type",
        filterChangedFunction: "=filterChangedFunction",
        reportChangedFunction: "=reportChangedFunction",
        assignFiltersFunction: "=assignFiltersFunction",
        reports: "=reports",
        updateVersionFunction: "=updateVersionFunction",
        addLicenseFunction: "=addLicenseFunction",
        showLicenseFunction: "=showLicenseFunction",
        addFilterFunction: "=addFilterFunction",
        addReportFunction: "=addReportFunction",
        loadFilterFunction: "=loadFilterFunction",
        actionFilterFunction: "=actionFilterFunction",
        actionReportFunction: "=actionReportFunction",
        selectConnectorFunction: "=selectConnectorFunction",
        deleteFunction: "=deleteFunction",
        renameFunction: "=renameFunction",
        canModifyEventUrlFunction: "=canModifyEventUrlFunction",
        canModifyImageServerUrlFunction: "=canModifyImageServerUrlFunction",
        addServerUrlFunction: "=addServerUrlFunction",
        deleteServerUrlFunction: "=deleteServerUrlFunction",
        canModifyCheckinIntervalFunction: "=canModifyCheckinIntervalFunction",
        canModifySignallingServerFunction: "=canModifySignallingServerFunction",
        canModifySoftwareVersionFunction: "=canModifySoftwareVersionFunction",
        createSoftwareVersionFunction: "=createSoftwareVersionFunction",
        softwareVersions: "=softwareVersions",
        defaultSoftwareVersion: "=defaultSoftwareVersion",
        filters: "=filters",
        reports: "=reports",
        children: "=children",
        ownedFilters: "=ownedFilters",
        cascadedFilters: "=cascadedFilters",
        ownedReports: "=ownedReports",
        cascadedReports: "=cascadedReports"
      },
      link: function (scope, element, attrs) {
        scope.openSoftwareVersionForm = scope.$parent.openSoftwareVersionForm,
        scope.addFilter = function(customerId) {
          scope.addFilterFunction(customerId);
        }
        scope.loadFilter = function(owner) {
          scope.loadFilterFunction(owner);
        }
        scope.addReport = function(customerId) {
          scope.addReportFunction(customerId);
        }
        scope.filterChanged = function(filter) {
          scope.filterChangedFunction(filter);
        }
        scope.updateVersion = function(model) {
          scope.updateVersionFunction(model);
        }
        scope.reportChanged = function(filter) {
          scope.reportChangedFunction(filter);
        }
        scope.assignFilters = function(assignee, filters) {
          scope.assignFiltersFunction(assignee, filters);
        }
        scope.actionFilter = function(filterId) {
          scope.actionFilterFunction(filterId);
        }
        scope.actionReport = function(filterId) {
          scope.actionReportFunction(filterId);
        }
        scope.addLicense = function(customerId) {
          scope.addLicenseFunction(customerId);
        }
        scope.addLicense = function(selected) {
          scope.addLicenseFunction(selected);
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
        scope.renameModel = function(model){
          scope.renameFunction(model);
        }
        scope.canModifyEventUrl = function(model) {
          return scope.canModifyEventUrlFunction(model);
        }
        scope.canModifyImageServerUrl = function(model) {
          return scope.canModifyImageServerUrlFunction(model);
        }
        scope.addServerUrl = function(model, url) {
          scope.addServerUrlFunction(model, url);
        }
        scope.deleteServerUrl = function(model, url, deleteUrl) {
          scope.deleteServerUrlFunction (model, url, deleteUrl);
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
        },
        scope.announceClick = function(index) {
          $mdDialog.show(
            $mdDialog.alert()
              .title('You clicked!')
              .textContent('You clicked the menu item at index ' + index)
              .ok('Nice')
              .targetEvent(originatorEv)
          );
          originatorEv = null;
        }
      }
    }
  });