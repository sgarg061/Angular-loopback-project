'use strict';
var Config = require('../../config');
var jwt = require('jsonwebtoken');

var users = [
    {
        username: 'cwhiten@solinkcorp.com',
        password: 'test',
        userType: 'solink'
    },
    {
        username: 'cwhiten+1@solinkcorp.com',
        password: 'test',
        userType: 'admin',
        tenantId: '1'
    },
    {
        username: 'cwhiten+user@solinkcorp.com',
        password: 'test',
        userType: 'user',
        tenantId: '1'
    },
    {
        username: 'cwhiten+cloud@solinkcorp.com',
        password: 'test',
        userType: 'cloud',
        cloudId: '1'
    },
    {
        username: 'cwhiten+reseller@solinkcorp.com',
        password: 'test',
        userType: 'reseller',
        resellerId: '1'
    }
];
var FakeAuth0Accessor = function () {
};

FakeAuth0Accessor.prototype.login = function (username, password, cb) {
    var matchingUser = users.filter(function (user) {
        return user.username === username && user.password === password;
    });

    if (matchingUser.length < 1) {
        var e = new Error('Unable to login');
        e.statusCode(401);
        cb(e, 'Failed login');
        return;
    }

    var token = createValidToken(matchingUser[0]);

    var response = {
        authToken: token,
        aws: {
            accessKeyId: 'fakeaccesskey',
            secretAccessKey: 'fakesecretaccesskey',
            sessionToken: 'fakesessiontoken'
        },
        refreshToken: 'a refresh token'
    };
    cb(null, response);
};


FakeAuth0Accessor.prototype.createUser = function (email, password, userData, cb) {
    var newUser = userData;
    newUser.username = email;
    newUser.password = password;

    users.push(newUser);
    cb(null, newUser);
};

function createValidToken (user) {
    var appMetadata = {
        userType: user.userType
    };

    if (user.userType === 'cloud') {
        appMetadata.cloudId = user.cloudId;
    } else if (user.userType === 'reseller') {
        appMetadata.resellerId = user.resellerId;
    } else if (user.tenantId) {
        appMetadata.tenantId = user.tenantId;
    }

    if (user.devices) {
        appMetadata.devices = user.devices;
    }

    var payload = {
        email: user.username,
        email_verified: true,
        app_metadata: appMetadata,
        iss: 'https://solink.auth0.com/',
        sub: 'auth0|55a55f4186416215610a2e22',
        aud: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
        exp: Math.floor(new Date().getTime()/1000) + 3600,
        iat: Math.floor(new Date().getTime()/1000)
    };

    var config = new Config();
    var token = jwt.sign(payload, config.auth0PrivateKey, {algorithm: 'RS256'});
    return token;
}

FakeAuth0Accessor.prototype.setPassword = function (email, oldPassword, newPassword, cb) {
    var matchingUser = users.filter(function (user) {
        return user.username === email;
    });
    if (matchingUser.length !== 1 || matchingUser[0].password !== oldPassword) {
        var e = new Error('Unable to set password');
        e.statusCode = 401;
        cb(e, 'Failed set password');
        return;
    }

    matchingUser[0].password = newPassword;
    var response = {
        response: 'Password successfully updated.'
    };
    cb(null, response);
};

FakeAuth0Accessor.prototype.forgotPassword = function (email, newPassword, cb) {
    var matchingUser = users.filter(function (user) {
        return user.username === email;
    });
    if (matchingUser.length !== 1) {
        var e = new Error('Unable to send forgot password email');
        e.statusCode = 400;
        cb(e, 'Failed send forgot password email');
        return;
    }

    var response = {
        response: 'Forgot password email successfully sent.'
    };
    cb(null, response);
};

FakeAuth0Accessor.prototype.updateMetadata = function () {};

module.exports = FakeAuth0Accessor;