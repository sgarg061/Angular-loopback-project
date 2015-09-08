var logger = require('../logger');
var redis = require('redis');

var redisConnections = {};

var FakeRedisClient = function() {

};

FakeRedisClient.prototype.exists = function(val, cb) {
    cb(null, 0);
};

FakeRedisClient.prototype.set = function(val, exp) {
    return;
};

FakeRedisClient.prototype.expire = function(val, time) {
    return;
};

var FakeRedisConnection = function (name, port, address) {
    'use strict';
    this.name = name;
    this.port = port;
    this.address = address;
    this.client = new FakeRedisClient();
};

module.exports = {
    initialize: function (connections) {
        'use strict';
        connections.forEach(function (connection) {
            var newConnection = new FakeRedisConnection(connection.name, connection.port, connection.address);
            redisConnections[connection.name] = newConnection;
        });
    },

    getConnection: function (name) {
        'use strict';
        return redisConnections[name];
    }
};