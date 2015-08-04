var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var redis = require('redis');
var crypto = require('crypto');
var loopback = require('loopback');

module.exports = function (Auth) {
    'use strict';

    Auth.disableRemoteMethod('create', true);
    Auth.disableRemoteMethod('upsert', true);
    Auth.disableRemoteMethod('updateAll', true);
    Auth.disableRemoteMethod('updateAttributes', false);

    Auth.disableRemoteMethod('find', true);
    Auth.disableRemoteMethod('findById', true);
    Auth.disableRemoteMethod('findOne', true);

    Auth.disableRemoteMethod('deleteById', true);

    Auth.disableRemoteMethod('confirm', true);
    Auth.disableRemoteMethod('count', true);
    Auth.disableRemoteMethod('exists', true);
    Auth.disableRemoteMethod('resetPassword', true);

    Auth.disableRemoteMethod('__count__accessTokens', false);
    Auth.disableRemoteMethod('__create__accessTokens', false);
    Auth.disableRemoteMethod('__delete__accessTokens', false);
    Auth.disableRemoteMethod('__destroyById__accessTokens', false);
    Auth.disableRemoteMethod('__findById__accessTokens', false);
    Auth.disableRemoteMethod('__get__accessTokens', false);
    Auth.disableRemoteMethod('__updateById__accessTokens', false);

    Auth.disableRemoteMethod('createChangeStream', true);

    Auth.validate = function (token, cb) {
        console.log('Validating token: ' + token);
        
        callComesFromPlatform(function (err) {
            if (err) {
                console.log('validation request invalid');
                err.statusCode = 401;
                cb(err, 'Invalid authorization token');
            } else {
                console.log('validation request has come from solink. validating...');
                validateToken(token, cb);
            }
        });
    };

    Auth.login = function (username, password, cb) {
        console.log('Logging in with creds ' + username + ':' + password);
        authenticateWithAuth0(username, password, cb);
    };

    Auth.remoteMethod(
        'validate',
        {
            accepts: {arg: 'token', type: 'string', required: true},
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'response', type: 'string'}
        }
    );

    Auth.remoteMethod(
        'login',
        {
            accepts: [
                {arg: 'username', type: 'string'},
                {arg: 'password', type: 'string'}
            ],
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'response', type: 'string'}
        }
    );
};

function callComesFromPlatform(cb) {
    'use strict';
    var ctx = loopback.getCurrentContext();
    var authorization_header = ctx.get('http').req.headers.authorization;
    var auth_parts = authorization_header.split(' ');

    if (auth_parts.length !== 2) {
        var invalid_format_error = new Error('Invalid authorization token format');
        invalid_format_error.statusCode = 400;
        cb(invalid_format_error);
    } else {
        var token = auth_parts[1];

        // is the auth token even valid?
        validateToken(token, function (err, msg) {
            if (err) {
                console.log('error validating auth token. ' + err + ' - ' + msg);
                var invalid_token_error = new Error('Authorization token invalid');
                invalid_token_error.statusCode = 401;
                cb(invalid_token_error);
            } else {
                // ok, the auth token is valid.  is it 'solink'?
                try {
                    var unpacked_token = jwt.decode(token);
                    console.log('User type: ' + unpacked_token.app_metadata.user_type);
                    if (unpacked_token.app_metadata.user_type === 'solink') {
                        // valid response!
                        cb(null);
                    } else {
                        var unauthorized_error = new Error('Unauthorized');
                        unauthorized_error.statusCode = 401;
                        cb(unauthorized_error);
                    }
                } catch (error) {
                    console.log(error);
                    var exception = new Error('Exception when decoding auth token');
                    exception.statusCode = 500;
                    cb(exception);
                }
            }
        });
    }
}

function validateToken(token, cb) {
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

function authenticateWithAuth0(username, password, cb) {
    'use strict';
    request({
        url: config.auth0URL + '/oauth/ro',
        method: 'POST',
        form: {
            username: username,
            password: password,
            client_id: config.auth0ClientID,
            connection: 'Username-Password-Authentication',
            grant_type: 'password',
            scope: config.auth0Scope
        }
    }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var token_info = JSON.parse(body);
            var token = token_info.id_token;

            authenticateWithAWS(token, cb);
        } else {
            var e = new Error('Unable to login');
            e.statusCode = res.statusCode;
            cb(e, 'Failed login');
        }
    });
}

function authenticateWithAWS(token, cb) {
    'use strict';
    request({
        url: config.auth0URL + '/delegation',
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            id_token: token,
            client_id: config.auth0ClientID,
            role: config.auth0AWSRole,
            principal: config.auth0AWSPrincipal,
            api_type: 'aws'
        }
    }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var token_info = JSON.parse(body);
            var creds = token_info.Credentials;
            var response = {
                auth_token: token,
                aws: {
                    AccessKeyId: creds.AccessKeyId,
                    SecretAccessKey: creds.SecretAccessKey,
                    SessionToken: creds.SessionToken
                }
            };
            cb(null, JSON.stringify(response));
        } else {
            var e = new Error('Unable to login');
            e.statusCode = res.statusCode;
            cb(e, 'Failed login');
        }

    });
}