var logger = require('../../server/logger');

module.exports = function (Configuration) {
    'use strict';

    Configuration.whatismyip = function (req, cb) {

        var ipAddress = 'no ip detected';
        if (req) {
            ipAddress = req.connection.remoteAddress;
        }
        logger.info('Returning ip address ' + ipAddress);

        cb(null, ipAddress);
    };

    Configuration.remoteMethod(
        'whatismyip',
        {
            accepts: {arg: 'req', type: 'object', http: {source: 'req'}},
            http: {verb: 'get', status: 200, errorStatus: 500},
            returns: {type: 'string', root: true}
        }
    );
};
