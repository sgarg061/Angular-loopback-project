'use strict';
var sio_jwt = require('socketio-jwt');
var redis = require('socket.io-redis');
var Config = require('../../config');

var io = null;
module.exports = {
  initialize: function (server) {
    // hook up socket.io
    io = require('socket.io').listen(server);

    var config = new Config();
    io.use(sio_jwt.authorize({
      secret: config.auth0PublicKey,
      handshake: true
    }));
    io.adapter(redis({host: config.socketRedisLocation, port: config.socketRedisPort}));

    io.on('error', function (err) {
      console.log('error');
      console.log(err);
    });

    io.on('connection', function (socket) {
      socket.on('disconnect', function () {
      });

      socket.on('error', function (err) {
        console.log('error:', err);
      })
    });
  },

  publish: function (channel, data) {
    io.sockets.emit(channel, data);
  }
};