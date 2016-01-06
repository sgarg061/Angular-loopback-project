var logger = require('../../server/logger');

module.exports = function (Configuration) {
    'use strict';

    Configuration.whatismyip = function (req, cb) {

        var ipAddress = null;
        if (req) {
            ipAddress = req.headers['x-forwarded-for'];
            if (!ipAddress)
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
