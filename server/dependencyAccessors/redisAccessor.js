var logger = require('../logger');
var redis = require('redis');

var redisConnections = {};

var RedisConnection = function (name, port, address) {
    'use strict';
    this.name = name;
    this.port = port;
    this.address = address;
    logger.debug('Creating connection ' + name + ' at ' + address + ':' + port);
    this.client = redis.createClient(port, address, {});

    this.client.on('error', function (error) {
        logger.error('WARNING: Unable to create redis connection ' + name + ': ' + error);
    });

    this.client.on('connect', function () {
        logger.debug('Connection established: ' + name);
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