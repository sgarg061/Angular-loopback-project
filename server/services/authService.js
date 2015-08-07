
var authAccessor = null;

module.exports = {
    initialize: function (accessor) {
        authAccessor = accessor;
    },
    login: function (username, password, cb) {
        authAccessor.login(username, password, cb);
    }
};