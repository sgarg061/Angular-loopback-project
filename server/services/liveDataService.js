'use strict';

var socketAccessor = null;
module.exports = {
  initialize: function (server, accessor) {
    socketAccessor = accessor;
    socketAccessor.initialize(server);
  },

  publish: function (channel, data) {
    socketAccessor.publish(channel, data);
  }
};