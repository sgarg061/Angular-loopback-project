//var redis = require('redis');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
var redisAccessor = require('../server/redisAccessor');
var loopback = require('loopback');

module.exports =  {
    validateToken: function (token, cb) {
        'use strict';
        var ctx = loopback.getCurrentContext();
        jwt.verify(token, new Buffer(config.jwtSecret, 'base64'), function (err, decoded) {
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
                var revokedClient = redisAccessor.getConnection('revoked').client;
                var hashed_token = crypto.createHash('md5').update(token).digest('hex');
                revokedClient.exists(hashed_token, function (err, reply) {
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
                            addValidToken(hashed_token, decoded.exp, currentTime, cb);
                        }
                    }
                });
            } else {
                var invalid_err = new Error('Invalid authentication token');
                invalid_err.statusCode = 401;
                cb(invalid_err, 'invalid token');
            }
        });
    }
};

function addValidToken(token, tokenExp, currentTime, cb) {
    'use strict';
    var validatedClient = redisAccessor.getConnection('validated').client;
    validatedClient.exists(token, function (err, reply) {
        if (err) {
            console.log(err);
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