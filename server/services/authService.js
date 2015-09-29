
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
    },
    refresh: function (token, cb) {
    	authAccessor.refresh(token, cb);
    },
    setPassword: function (email, password, cb) {
        authAccessor.setPassword(email, password, cb);
    }
};