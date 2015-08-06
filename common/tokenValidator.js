var redis = require('redis');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports =  {
    validateToken: function (token, cb) {
        'use strict';
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
                var client = redis.createClient(config.revokedTokensRedisPort, config.revokedTokensRedisLocation, {});
                client.on('error', function (error) {
                    console.log(error);
                    cb(error, 'Error communicating with token cache');
                });

                client.on('connect', function () {
                    var hashed_token = crypto.createHash('md5').update(token).digest('hex');
                    client.exists(hashed_token, function (err, reply) {
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
    var client = redis.createClient(config.validatedTokensRedisPort, config.validatedTokensRedisLocation, {});
    client.on('error', function (error) {
        console.log(error);
        var err = new Error('Error communicating with token cache');
        err.statusCode = 500;
        cb(err, 'Error communicating with token cache');
    });

    client.on('connect', function () {
        client.exists(token, function (err, reply) {
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
                client.set(token, tokenExp);
                client.expire(token, tokenExp - currentTime);
                cb(null, 'Valid token');
            }
        });
    });
}