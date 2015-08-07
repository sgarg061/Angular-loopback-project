var redis = require('redis');

var redisConnections = {};

var RedisConnection = function (name, port, address) {
    'use strict';
    this.name = name;
    this.port = port;
    this.address = address;
    console.log('Creating connection ' + name + ' at ' + address + ':' + port);
    this.client = redis.createClient(port, address, {});

    this.client.on('error', function (error) {
        console.log('WARNING: Unable to create redis connection ' + name + ': ' + error);
    });

    this.client.on('connect', function () {
        console.log('Connection established: ' + name);
    });
};

module.exports = {
    initialize: function (connections) {
        'use strict';
        connections.forEach(function (connection) {
            var newConnection = new RedisConnection(connection.name, connection.port, connection.address);
            redisConnections[connection.name] = newConnection;
        });
    },

    getConnection: function (name) {
        'use strict';
        return redisConnections[name];
    }
};