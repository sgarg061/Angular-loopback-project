
var cacheAccessor = null;

module.exports = {
    initialize: function (accessor) {
        cacheAccessor = accessor;
    },
    getCacheClient: function (name) {
        return cacheAccessor.getConnection(name).client;
    }
};