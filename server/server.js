var loopback = require('loopback');
var jwt = require('jsonwebtoken');
var boot = require('loopback-boot');
var Auth0Accessor = require('./dependencyAccessors/auth0Accessor');
var RedisAccessor = require('./dependencyAccessors/redisAccessor');
var authService = require('./services/authService');
var cacheService = require('./services/cacheService');
var config = require('../config');
var loopbackConsole = require('loopback-console');

var app = module.exports = loopback();

app.use(loopback.context());
app.use(function jwtMiddleware (req, res, next) {
    'use strict';
    try {
        var authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next();
        }
        var authParts = authorizationHeader.split(' ');

        if (authParts.length !== 2) {
            return next(); // invalid token. nothing to attach.
        }
        
        var token = authParts[1];
        var unpackedToken = jwt.decode(token);
        
        var jwtToken = {
            token: token,
            userType: unpackedToken.app_metadata.user_type
        };
        if (unpackedToken.app_metadata.tenant_id) {
            jwtToken.tenantId = unpackedToken.app_metadata.tenant_id;
        }

        if (unpackedToken.app_metadata.reseller_id) {
            jwtToken.resellerId = unpackedToken.app_metadata.reseller_id;
        }

        if (unpackedToken.app_metadata.cloud_id) {
            jwtToken.cloudId = unpackedToken.app_metadata.cloud_id;
        }

        var ctx = loopback.getCurrentContext();
        ctx.set('jwt', jwtToken);

        return next();
    } catch (err) {
        console.log('Error processing jwt token. ' + err);
        return next();
    }
});

function initializeRedis() {
    'use strict';
    RedisAccessor.initialize([
    {
        name: 'revoked',
        port: config.revokedTokensRedisPort,
        address: config.revokedTokensRedisLocation
    },
    {
        name: 'validated',
        port: config.validatedTokensRedisPort,
        address: config.validatedTokensRedisLocation
    }]);
}

app.start = function() {
    'use strict';
    authService.initialize(new Auth0Accessor());
    initializeRedis();
    cacheService.initialize(RedisAccessor);
    // start the web server
    return app.listen(function() {
       app.emit('started');
       console.log('Web server listening at: %s', app.get('url'));
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
  if (loopbackConsole.activated()) {
  loopbackConsole.start(app,
    // loopback-console config
    {
      prompt: 'call-home-server # ',
      // ...
    });
} else if (require.main === module)
      app.start();
});
