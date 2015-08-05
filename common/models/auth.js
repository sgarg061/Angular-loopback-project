var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var loopback = require('loopback');
var tokenValidator = require('../tokenValidator');

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
        console.log('validation request has come from solink. validating...');
        tokenValidator.validateToken(token, cb);
    }

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
        tokenValidator.validateToken(token, function (err, msg) {
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