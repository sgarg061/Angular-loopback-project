(function(){
	angular.module('uiStateService',[])
	.factory('uiStateService', function(){
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