(function() {
    angular.module('filterService', ['angular-jwt'])
    .factory('filterService', function ($mdDialog) {


        return {
            addFilter: function(scope, callback) {
				$mdDialog.show({
					controller: function DialogController(scope, $mdDialog) {
						scope.newFilter = {
							name: '',
							script: '',
							owner: true,
							$title: 'Connector'
						};
						scope.create = function() {
							var script = JSON.stringify(scope.newFilter.script);
							POSFilter.create({
								id: '',
								name: scope.newFilter.name,
								description: scope.newFilter.description,
								script: script,
								creatorId: $stateParams.resellerId,
								creatorType: 'reseller' 
							})
							.$promise
							.then(function(data) {
								callback();
							}, function (res) {
								toastr.error(res.data.error.message, 'Error');
							});
							$mdDialog.cancel();
						};
						scope.cancel = function() {
							$mdDialog.cancel();
						};
					},
					templateUrl: '/views/filterForm.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose:true
				}); 
            }
        };
    });
})();