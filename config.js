var fs = require('fs');

var productionSettings = {
    auth0URL: 'https://solink.auth0.com',
    auth0ClientID: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
    auth0Scope: 'openid email app_metadata offline_access created_at',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/auth0-provider',

    auth0PublicKey: fs.readFileSync('solink.pem', {encoding: 'utf8'}),
    auth0PrivateKey: fs.readFileSync('solink.priv', {encoding: 'utf8'}),
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQzOTIzNjMzNSwianRpIjoiMTAwMGQ1MzVjYTAzMzY0YTNhYTFlZWVlNTY0MjYxY2UifQ._eDHftt98ozdqy9Z9d9-NITVQOEBAplRAjN2EvrZ9po',
    updateUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInVwZGF0ZSIsInJlYWQiXX19LCJpYXQiOjE0NDM0NzMwMzgsImp0aSI6ImNjZDBhMWI2NjFkNTRlY2QwYTA4YWQxYTc2ODdkZDUzIn0.pyc7JEe6RIdUcgsouvQMNv1kwq_kMO7xLSv8U9UWXng',

    revokedTokensRedisLocation: 'redis-revoked.ppufgb.0001.usw2.cache.amazonaws.com',
    revokedTokensRedisPort: '6379',
    log: {
        console: {
            colorize: true,
            level: 'debug',
            label: 'system'
        },
        file: {
            filename: 'call-home-server.log',
            level: 'debug'
        }
    }
};

var developmentSettings = {
    auth0URL: 'https://solink.auth0.com',
    auth0ClientID: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
    auth0Scope: 'openid email app_metadata offline_access created_at',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/auth0-provider',

    auth0PublicKey: fs.readFileSync('solink.pem', {encoding: 'utf8'}),
    auth0PrivateKey: fs.readFileSync('solink.priv', {encoding: 'utf8'}),
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQzOTIzNjMzNSwianRpIjoiMTAwMGQ1MzVjYTAzMzY0YTNhYTFlZWVlNTY0MjYxY2UifQ._eDHftt98ozdqy9Z9d9-NITVQOEBAplRAjN2EvrZ9po',
    updateUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInVwZGF0ZSIsInJlYWQiXX19LCJpYXQiOjE0NDM0NzMwMzgsImp0aSI6ImNjZDBhMWI2NjFkNTRlY2QwYTA4YWQxYTc2ODdkZDUzIn0.pyc7JEe6RIdUcgsouvQMNv1kwq_kMO7xLSv8U9UWXng',

    revokedTokensRedisLocation: '127.0.0.1',
    revokedTokensRedisPort: '6380',
    log: {
        console: {
            colorize: true,
            level: 'debug',
            label: 'system'
        },
        file: {
            filename: 'call-home-server.log',
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