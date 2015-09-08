
var cacheAccessor = null;

module.exports = {
    initialize: function (accessor) {
    	console.log('hmm');
        cacheAccessor = accessor;
    },
    getCacheClient: function (name) {
        return cacheAccessor.getConnection(name).client;
    }
};