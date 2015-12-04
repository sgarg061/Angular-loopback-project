var fs = require('fs');
var path = require('path');

var productionSettings = {
    auth0URL: 'https://solink-test.auth0.com',
    auth0ClientID: 'apgeIHLz2aSl1PyHUET1jpy3VCL4HAEe',
    auth0Scope: 'openid email app_metadata offline_access created_at',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/int-s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/int-auth0-provider',

    auth0PublicKey: fs.readFileSync('private/solink-test.pem', {encoding: 'utf8'}),
    auth0PrivateKey: fs.readFileSync('private/solink-test.priv', {encoding: 'utf8'}),
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJoU0ZYZG9idUs0Z2lQSTZwR2pQeWVMQzVpVm5ldGdIQiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQ0NDkzMDUzOSwianRpIjoiYzEzZjQwZWRjYWNjODUyYzAxMDdkMDkzMDg4NzI5NjkifQ.W4xjNLtQhKeEHRogZ-F_5GvDgjETsdKAE7nGOYJ2uG8',
    updateUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJoU0ZYZG9idUs0Z2lQSTZwR2pQeWVMQzVpVm5ldGdIQiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSIsInVwZGF0ZSJdfX0sImlhdCI6MTQ0NDkzMDU3NSwianRpIjoiYjgxZGExMTJkNDgzZjNhMWJhZGI4MjBiNmQyMmMzYzkifQ.tg-lMy1slCEekgrRGJ1d1nrqDtTU4fjPRESNB8_S88w',

    revokedTokensRedisLocation: 'redis-revoked.ppufgb.0001.usw2.cache.amazonaws.com',
    revokedTokensRedisPort: '6379',
    log: {
        console: {
            colorize: true,
            level: 'debug',
            label: 'system'
        },
        file: {
            filename: 'call-home-server',
            level: 'debug'
        }
    }
};

var developmentSettings = {
    auth0URL: 'https://solink-test.auth0.com',
    auth0ClientID: 'apgeIHLz2aSl1PyHUET1jpy3VCL4HAEe',
    auth0Scope: 'openid email app_metadata offline_access created_at',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/int-s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/int-auth0-provider',

    auth0PublicKey: fs.readFileSync('private/solink-test.pem', {encoding: 'utf8'}),
    auth0PrivateKey: fs.readFileSync('private/solink-test.priv', {encoding: 'utf8'}),
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJoU0ZYZG9idUs0Z2lQSTZwR2pQeWVMQzVpVm5ldGdIQiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQ0NDkzMDUzOSwianRpIjoiYzEzZjQwZWRjYWNjODUyYzAxMDdkMDkzMDg4NzI5NjkifQ.W4xjNLtQhKeEHRogZ-F_5GvDgjETsdKAE7nGOYJ2uG8',
    updateUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJoU0ZYZG9idUs0Z2lQSTZwR2pQeWVMQzVpVm5ldGdIQiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSIsInVwZGF0ZSJdfX0sImlhdCI6MTQ0NDkzMDU3NSwianRpIjoiYjgxZGExMTJkNDgzZjNhMWJhZGI4MjBiNmQyMmMzYzkifQ.tg-lMy1slCEekgrRGJ1d1nrqDtTU4fjPRESNB8_S88w',

    privateKey: fs.readFileSync(path.join(__dirname, 'private/privatekey.pem')).toString(),
    certificate: fs.readFileSync(path.join(__dirname, 'private/certificate.pem')).toString(),

    revokedTokensRedisLocation: '127.0.0.1',
    revokedTokensRedisPort: '6380',
    log: {
        console: {
            colorize: true,
            level: 'debug',
            label: 'system'
        },
        file: {
            filename: 'call-home-server',
            level: 'debug'
        }
    }
};

module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return productionSettings;
        default:
            return developmentSettings;
    }
};
