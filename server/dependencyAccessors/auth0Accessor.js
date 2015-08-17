var request = require('request');
var config = require('../../config');

var Auth0Accessor = function () {
};

Auth0Accessor.prototype.login = function (username, password, cb) {
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
};

Auth0Accessor.prototype.createUser = function (email, password, cb) {
    'use strict';
    request({
        url: config.auth0URL + '/api/v2/users',
        method: 'POST',
        form: {
            email: email,
            password: password,
            connection: 'Username-Password-Authentication',
            app_metadata: {
                tenant_id: 15,
                user_type: 'solink'
            }
        },
        auth: {
            bearer: config.createUserToken
        }
    }, function (error, response, body) {
        console.log('user creation!');
        if (error) {
            cb(error, '');
        } else if (response.statusCode !== 201) {
            console.log(body);
            var e = new Error('Unable to create user');
            e.statusCode = response.statusCode;
            cb(e, '');
        } else {
            cb(null, body);
        }
    });
};

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

module.exports = Auth0Accessor;