
var authAccessor = null;

module.exports = {
    initialize: function (accessor) {
        authAccessor = accessor;
    },
    login: function (username, password, cb) {
        authAccessor.login(username, password, cb);
    },
    createUser: function (email, password, userData, cb) {
    	authAccessor.createUser(email, password, userData, cb);
    }
};