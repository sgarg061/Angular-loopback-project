var config = require('../../config');
var jwt = require('jsonwebtoken');

var FakeAuth0Accessor = function () {
};

FakeAuth0Accessor.prototype.login = function (username, password, cb) {
    'use strict';

    var token = null;
    if (username === 'cwhiten@solinkcorp.com' && password === 'test') {
        token = createValidToken('solink');
    } else if (username === 'cwhiten+1@solinkcorp.com' && password === 'test') {
        token = createValidToken('admin');
    } else {
        var e = new Error('Unable to login');
        e.statusCode = 401;
        cb(e, 'Failed login');
        return;
    }
    
    console.log('generated fake token: ' + token);
    var response = {
        auth_token: token,
        aws: {
            AccessKeyId: 'fakeaccesskey',
            SecretAccessKey: 'fakesecretaccesskey',
            SessionToken: 'fakesessiontoken'
        }
    };
    cb(null, JSON.stringify(response));
/*
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
    });*/
};
/*
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
*/

function createValidToken (userType) {
    var payload = {
        email: 'cwhiten@solinkcorp.com',
        email_verified: true,
        app_metadata: {
            tenant_id: '1',
            user_type: userType
        },
        iss: 'https://solink.auth0.com/',
        sub: 'auth0|55a55f4186416215610a2e22',
        aud: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
        exp: Math.floor(new Date().getTime()/1000) + 3600,
        iat: Math.floor(new Date().getTime()/1000)
    };

    var token = jwt.sign(payload, new Buffer(config.jwtSecret, 'base64'));
    return token;
}

module.exports = FakeAuth0Accessor;