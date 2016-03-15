'use strict';

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
  refresh: function (refreshToken, jwt, cb) {
    authAccessor.refresh(refreshToken, jwt, cb);
  },
  setPassword: function (email, oldPassword, newPassword, cb) {
    authAccessor.setPassword(email, oldPassword, newPassword, cb);
  },
  forgotPassword: function (email, newPassword, cb) {
   authAccessor.forgotPassword(email, newPassword, cb);
  },
  listUsers: function (type, id, cb) {
    authAccessor.listUsers(type, id, cb);
  },
  updateMetadata: function (id, appMetadata, userMetadata, cb) {
    authAccessor.updateMetadata(id, appMetadata, userMetadata, cb);
  },
  getUser: function (id, cb) {
    authAccessor.getUser(id, cb);
  },
  forceSetPassword: function (id, password, cb) {
    authAccessor.forceSetPassword(id, password, cb);
  },
  deleteUser: function (id, cb) {
    authAccessor.deleteUser(id, cb);
  }
};