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
config.log = {'system': {'console': {}, 'file': {}}, 'customer': {'console': {}, 'file': {}}};

config.log.system.console.colorize = true;
config.log.system.console.level = 'debug'; 
config.log.system.console.label = 'system';
config.log.system.file.filename = 'call-home-system.log';
config.log.system.file.level = 'debug'; 

config.log.customer.console.colorize = true;
config.log.customer.console.level = 'warn';
config.log.customer.console.label = 'customer';
config.log.customer.file.filename = 'call-home-customer.log';
config.log.customer.file.level = 'info'; 


module.exports = config;