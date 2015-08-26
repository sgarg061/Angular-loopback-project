var request = require('request');
var Config = require('../../config');

var Auth0Accessor = function () {
};

Auth0Accessor.prototype.login = function (username, password, cb) {
    'use strict';
    var config = new Config();
    request({
        url: config.auth0URL + '/oauth/ro',
        method: 'POST',
        form: {
            username: username,
            password: password,
            client_id: config.auth0ClientID,
            connection: 'Username-Password-Authentication',
            grant_type: 'password',
            scope: config.auth0Scope,
            device: 'call-home'
        }
    }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var tokenInfo = JSON.parse(body);
            var token = tokenInfo.id_token;
            var refreshToken = tokenInfo.refresh_token;

            authenticateWithAWS(token, refreshToken, cb);
        } else {
            var e = new Error('Unable to login');
            e.statusCode = res.statusCode;
            cb(e, 'Failed login');
        }
    });
};

Auth0Accessor.prototype.refresh = function (refreshToken, cb) {
    'use strict';
    var config = new Config();
    request({
        url: config.auth0URL + '/delegation',
        method: 'POST',
        form: {
            client_id: config.auth0ClientID,
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            refresh_token: refreshToken,
            api_type: 'app'
        }
    }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var tokenInfo = JSON.parse(body);
            var token = tokenInfo.id_token;
            cb(null, token);
        } else {
            var e = new Error('Unable to use refresh token');
            e.statusCode = res.statusCode;
            cb(e, 'Failed refresh');
        }
    });
};

Auth0Accessor.prototype.createUser = function (email, password, userData, cb) {
    'use strict';
    var config = new Config();

    var userCreationForm = {
        email: email,
        password: password,
        connection: 'Username-Password-Authentication',
        app_metadata: {
            tenantId: userData.customerId ? userData.customerId : 'none',
            resellerId: userData.resellerId,
            cloudId: userData.cloudId,
            userType: userData.userType
        }
    };

    if (userData.email_verified) {
        userCreationForm.email_verified = true;
    }

    request({
        url: config.auth0URL + '/api/v2/users',
        method: 'POST',
        form: userCreationForm,
        auth: {
            bearer: config.createUserToken
        }
    }, function (error, response, body) {
        if (error) {
            cb(error, '');
        } else if (response.statusCode !== 201) {
            var e = new Error('Unable to create user');
            e.statusCode = response.statusCode;
            cb(e, '');
        } else {
            cb(null, body);
        }
    });
};

function authenticateWithAWS(token, refreshToken, cb) {
    'use strict';
    var config = new Config();
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
                refresh_token: refreshToken,
                aws: {
                    accessKeyId: creds.AccessKeyId,
                    secretAccessKey: creds.SecretAccessKey,
                    sessionToken: creds.SessionToken
                }
            };
            cb(null, response);
        } else {
            var e = new Error('Unable to login');
            e.statusCode = res.statusCode;
            cb(e, 'Failed login');
        }
    });
}

module.exports = Auth0Accessor;