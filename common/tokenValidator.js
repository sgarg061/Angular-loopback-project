var logger = require('../server/logger');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Config = require('../config');
var cacheService = require('../server/services/cacheService');

module.exports = {
    validateToken: function (token, cb) {
        'use strict';
        var config = new Config();
        jwt.verify(token, config.auth0PublicKey, function (err, decoded) {
            if (!err) {
                // ensure the token hasn't expired
                var currentTime = Math.round(new Date().getTime()/1000);
                if (decoded.exp < currentTime) {
                    var e = new Error('Expired token.');
                    e.statusCode = 401;
                    cb(e, 'Expired token');
                    return;
                }

                // ensure the token isn't revoked
                var revokedClient = cacheService.getCacheClient('revoked');
                var hashedToken = crypto.createHash('md5').update(token).digest('hex');
                revokedClient.exists(hashedToken, function (err, reply) {
                    if (err) {
                        e = new Error('Error validating token');
                        e.statusCode = 500;
                        cb(e, 'Error validating token');
                    } else {
                        if (reply === 1) {
                            e = new Error('Token revoked');
                            e.statusCode = 401;
                            cb(e, 'token has been revoked');
                        } else {
                            // if successful, add it to the validated token list and set it up to expire once the token is expired
                            addValidToken(hashedToken, decoded.exp, currentTime, cb);
                        }
                    }
                });
            } else {
                var invalidErr = new Error('Invalid authentication token');
                invalidErr.statusCode = 401;
                cb(invalidErr, 'invalid token');
            }
        });
    }
};

function addValidToken(token, tokenExp, currentTime, cb) {
    'use strict';
    var validatedClient = cacheService.getCacheClient('validated');
    validatedClient.exists(token, function (err, reply) {
        if (err) {
            logger.error(err);
            var e = new Error('Error validating token');
            e.statusCode = 500;
            cb(e, 'Error validating token');
            return;
        }

        if (reply === 1) {
            cb(null, 'Valid token');
        } else {
            validatedClient.set(token, tokenExp);
            validatedClient.expire(token, tokenExp - currentTime);
            cb(null, 'Valid token');
        }
    });
}