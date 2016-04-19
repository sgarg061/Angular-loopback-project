(function(){
	angular.module('userPersistenceService',[])
	.factory('userPersistenceService', function(){
		var open;

		return {
			toggleOpen:function(){
				open = !open;
			},
			isOpen:function(){
				return open;
			}	
		};
	});
})();