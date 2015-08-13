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
    } else if (username === 'cwhiten+user@solinkcorp.com' && password === 'test') {
        token = createValidToken('user');
    } else if (username === 'cwhiten+cloud@solinkcorp.com' && password === 'test') {
        token = createValidToken('cloud');
    } else if (username === 'cwhiten+reseller@solinkcorp.com' && password === 'test') {
        token = createValidToken('reseller');
    } else {
        var e = new Error('Unable to login');
        e.statusCode = 401;
        cb(e, 'Failed login');
        return;
    }

    var response = {
        auth_token: token,
        aws: {
            AccessKeyId: 'fakeaccesskey',
            SecretAccessKey: 'fakesecretaccesskey',
            SessionToken: 'fakesessiontoken'
        }
    };
    cb(null, JSON.stringify(response));
};


FakeAuth0Accessor.prototype.createUser = function (email, password, userData, cb) {
    'use strict';
    cb(null, '');
};

function createValidToken (userType) {
    var appMetadata = {
        user_type: userType
    };

    if (userType === 'cloud') {
        appMetadata.cloud_id = '1';
    } else if (userType === 'reseller') {
        appMetadata.reseller_id = '1';
    } else {
        appMetadata.tenant_id = '1';
    }

    var payload = {
        email: 'cwhiten@solinkcorp.com',
        email_verified: true,
        app_metadata: appMetadata,
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