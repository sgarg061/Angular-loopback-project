'use strict';

var redisConnections = {};

var FakeRedisClient = function() {

};

FakeRedisClient.prototype.exists = function(val, cb) {
    cb(null, 0);
};

FakeRedisClient.prototype.set = function() {
    return;
};

FakeRedisClient.prototype.expire = function() {
    return;
};

var FakeRedisConnection = function (name, port, address) {
    this.name = name;
    this.port = port;
    this.address = address;
    this.client = new FakeRedisClient();
};

module.exports = {
    initialize: function (connections) {
        connections.forEach(function (connection) {
            var newConnection = new FakeRedisConnection(connection.name, connection.port, connection.address);
            redisConnections[connection.name] = newConnection;
        });
    },

    getConnection: function (name) {
        return redisConnections[name];
    }
};