/*var config = {};

config.auth0URL = 'https://solink.auth0.com';
config.auth0ClientID = '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih';
config.auth0Scope = 'openid email app_metadata offline_access';
config.auth0AWSRole = 'arn:aws:iam::150303506660:role/s3-access-by-tenant';
config.auth0AWSPrincipal = 'arn:aws:iam::150303506660:saml-provider/auth0-provider';

config.jwtSecret = 'IkZnJr_T0M4I9bfNM-LBIITtJrWw1YoQrSe0FNWaOodRH6TJ5L3qig0NDKS_B4yi';
config.createUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQzOTIzNjMzNSwianRpIjoiMTAwMGQ1MzVjYTAzMzY0YTNhYTFlZWVlNTY0MjYxY2UifQ._eDHftt98ozdqy9Z9d9-NITVQOEBAplRAjN2EvrZ9po';

config.validatedTokensRedisLocation = '127.0.0.1';
config.validatedTokensRedisPort = '6379';
config.revokedTokensRedisLocation = '127.0.0.1';
config.revokedTokensRedisPort = '6380';

// LOGGING 
// Note: standard winston log levels include: silly, debug, verbose, info, warn, error
config.log = {'console': {}, 'file': {}};

config.log.console.colorize = true;
config.log.console.level = 'debug'; 
config.log.console.label = 'system';
config.log.file.filename = 'call-home-server.log';
config.log.file.level = 'debug'; 

module.exports = config;*/

//////////////////////////////////


var productionSettings = {
    auth0URL: 'https://solink.auth0.com',
    auth0ClientID: '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih',
    auth0Scope: 'openid email app_metadata offline_access',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/auth0-provider',

    jwtSecret: 'IkZnJr_T0M4I9bfNM-LBIITtJrWw1YoQrSe0FNWaOodRH6TJ5L3qig0NDKS_B4yi',
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQzOTIzNjMzNSwianRpIjoiMTAwMGQ1MzVjYTAzMzY0YTNhYTFlZWVlNTY0MjYxY2UifQ._eDHftt98ozdqy9Z9d9-NITVQOEBAplRAjN2EvrZ9po',

    validatedTokensRedisLocation: 'redis-validate.ppufgb.0001.usw2.cache.amazonaws.com',
    validatedTokensRedisPort: '6379',
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
    auth0Scope: 'openid email app_metadata offline_access',
    auth0AWSRole: 'arn:aws:iam::150303506660:role/s3-access-by-tenant',
    auth0AWSPrincipal: 'arn:aws:iam::150303506660:saml-provider/auth0-provider',

    jwtSecret: 'IkZnJr_T0M4I9bfNM-LBIITtJrWw1YoQrSe0FNWaOodRH6TJ5L3qig0NDKS_B4yi',
    createUserToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwcHRsUENjQVFUSlVVOE5Eb05YNTlYUDlScXQ1cEpteiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQzOTIzNjMzNSwianRpIjoiMTAwMGQ1MzVjYTAzMzY0YTNhYTFlZWVlNTY0MjYxY2UifQ._eDHftt98ozdqy9Z9d9-NITVQOEBAplRAjN2EvrZ9po',

    validatedTokensRedisLocation: '127.0.0.1',
    validatedTokensRedisPort: '6379',
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