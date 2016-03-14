(function() {
    angular.module('filterService', ['angular-jwt'])
    .factory('filterService', function (jwtHelper, $localStorage, $moment, $mdDialog, POSFilter, SearchFilter, toastr) {
        var user = {};

        return {
            addFilter: function (userType, userId, callback) {
				$mdDialog.show({
					controller: function DialogController($scope, $mdDialog) {
						$scope.newFilter = {
							name: '',
							script: '',
							owner: true,
							$title: 'Connector'
						};
						$scope.create = function() {
							var script = JSON.stringify($scope.newFilter.script);
							POSFilter.create({
								id: '',
								name: $scope.newFilter.name,
								description: $scope.newFilter.description,
								script: script,
								creatorId: userId,
								creatorType: userType 
							})
							.$promise
							.then(function(data) {
								callback();
							}, function (res) {
								toastr.error(res.data.error.message, 'Error');
							});
							$mdDialog.cancel();
						};
						$scope.cancel = function() {
							$mdDialog.cancel();
						};
					},
					templateUrl: 'views/filterForm.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose:true
				});
            },
	        actionFilter: function(filter,callback){
				$mdDialog.show({
					controller: function DialogController($scope, $mdDialog) {
						$scope.newFilter = filter

						if (!$scope.newFilter.parsed_script){
							try {
								$scope.newFilter.script = JSON.parse(filter.script)
							}
							catch(err){
								$scope.newFilter.script = filter.script
							}

							$scope.newFilter.parsed_script = true
						}

						$scope.newFilter.$edit = true
						$scope.newFilter.$title = 'Connector'
						$scope.create = function() {
							var script = JSON.stringify($scope.newFilter.script);
							POSFilter.prototype$updateAttributes({id: filter.id},
							{
								name: $scope.newFilter.name,
								description: $scope.newFilter.description,
								script: script
							})
							.$promise
							.then(function(customer) {
								callback();
							}, function (res) {
								toastr.error(res.data.error.message, 'Error');
							});
							$mdDialog.cancel();
						};
						$scope.cancel = function() {
							$mdDialog.cancel();
						};
						$scope.destroy = function() {
							var confirm = $mdDialog.confirm()
							.title('Delete ' + $scope.newFilter.$title)
							.content('Are you sure you want to delete ' + $scope.newFilter.name + '?')
							.ok('Yes')
							.cancel('No');

							$mdDialog.show(confirm).then(function() {
								POSFilter.deleteById($scope.newFilter)
								.$promise
								.then(function(customer) {
									callback();
								}, function (res) {
									toastr.error(res.data.error.message, 'Error');
								});
							});


						};
					},
					templateUrl: 'views/filterForm.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose:true
				}); 
	        },

			addReport: function  (userType, userId, callback) {
				console.log('adding report', userType, userId);
				$mdDialog.show({
					controller: function DialogController($scope, $mdDialog) {
						$scope.newFilter = {
							name: '',
							filter: '{}',
							owner: true,
							$title: 'Report'
						};
						$scope.create = function() {
							try{
								var script = JSON.parse($scope.newFilter.filter);
							}
							catch(err){
								$scope.newFilter.$error = true;
							}
							if (script) {
								SearchFilter.create({
									id: '',
									name: $scope.newFilter.name,
									description: $scope.newFilter.description,
									filter: script,
									creatorId: userId,
									creatorType: userType
								})
								.$promise
								.then(function(customer) {
									callback();
								}, function (res) {
									toastr.error(res.data.error.message, 'Error');
								});
								$mdDialog.cancel();
							}
						};
						$scope.cancel = function() {
						$mdDialog.cancel();
						};
					},
					templateUrl: 'views/filterForm.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose:true
				}); 
			},

			actionReport: function  (filter,callback) {

				$mdDialog.show({
					controller: function DialogController($scope, $mdDialog) {
						$scope.newFilter = filter
						$scope.newFilter.$edit = true
						$scope.newFilter.$title = 'Report'
						$scope.create = function() {

							try{
								var script = JSON.parse($scope.newFilter.filter);
							}
							catch(err){
								$scope.newFilter.$error = true;
							}

							if (script) {
								SearchFilter.prototype$updateAttributes({id: filter.id},
								{
									name: $scope.newFilter.name,
									description: $scope.newFilter.description,
									filter: script
								})
								.$promise
								.then(function(customer) {
									callback();
								}, function (res) {
									toastr.error(res.data.error.message, 'Error');
								});
								$mdDialog.cancel();
							}
						};
						$scope.cancel = function() {
							$mdDialog.cancel();
						};
						$scope.destroy = function() {
							var confirm = $mdDialog.confirm()
							.title('Delete ' + $scope.newFilter.$title)
							.content('Are you sure you want to delete ' + $scope.newFilter.name + '?')
							.ok('Yes')
							.cancel('No');

							$mdDialog.show(confirm).then(function() {
								SearchFilter.deleteById($scope.newFilter)
								.$promise
								.then(function(customer) {
									callback();
								}, function (res) {
									toastr.error(res.data.error.message, 'Error');
								});
							});


						};
					},
					templateUrl: 'views/filterForm.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose:true
				}); 
			}

        }
    });
})();