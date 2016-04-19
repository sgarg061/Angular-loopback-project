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


//http://maffrigby.com/maintaining-session-info-in-angularjs-when-you-refresh-the-page/
// ngApp.factory("userPersistenceService", [
// 	"$cookies", function($cookies) {
// 		var item, name;

// 		return {
// 			setCookieData: function(name, item) {
// 				item = item;
// 				$cookies.put(name, item);
// 			},
// 			getCookieData: function(name) {
// 				item = $cookies.get(name);
// 				return item;
// 			},
// 			clearCookieData: function(name) {
// 				name = "";
// 				$cookies.remove(name);
// 			}
// 		}
// 	}
// ]);
