var config = {};

config.auth0URL = 'https://solink.auth0.com';
config.auth0ClientID = '5R9iDKiQ7nYCGOJaBDrPbesMwnkGj7ih';
config.auth0Scope = 'openid email app_metadata';
config.auth0AWSRole = 'arn:aws:iam::150303506660:role/s3-access-by-tenant';
config.auth0AWSPrincipal = 'arn:aws:iam::150303506660:saml-provider/auth0-provider';

config.jwtSecret = 'IkZnJr_T0M4I9bfNM-LBIITtJrWw1YoQrSe0FNWaOodRH6TJ5L3qig0NDKS_B4yi';

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

module.exports = config;