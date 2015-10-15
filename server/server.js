var loopback = require('loopback');
var jwt = require('jsonwebtoken');
var boot = require('loopback-boot');
var Auth0Accessor = require('./dependencyAccessors/auth0Accessor');
var RedisAccessor = require('./dependencyAccessors/redisAccessor');
var authService = require('./services/authService');
var cacheService = require('./services/cacheService');
var Config = require('../config');
var loopbackConsole = require('loopback-console');
var models = require('./model-config.json');

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
            userType: unpackedToken.app_metadata.userType
        };
        if (unpackedToken.app_metadata.tenantId) {
            jwtToken.tenantId = unpackedToken.app_metadata.tenantId;
        }

        if (unpackedToken.app_metadata.resellerId) {
            jwtToken.resellerId = unpackedToken.app_metadata.resellerId;
        }

        if (unpackedToken.app_metadata.cloudId) {
            jwtToken.cloudId = unpackedToken.app_metadata.cloudId;
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
    var config = new Config();
    RedisAccessor.initialize([
    {
        name: 'revoked',
        port: config.revokedTokensRedisPort,
        address: config.revokedTokensRedisLocation
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

// Update all collection schemas to model definitions
function autoUpdateAll() {
    Object.keys(models).forEach(function(model) {
        if(models[model].dataSource === 'callHomeDb') {
            app.dataSources.callHomeDb.autoupdate(model, function(err) {
                if(err) throw err;
            });
        }
    });
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    if(app.dataSources.callHomeDb.connected) {
      autoUpdateAll();
    } else {
      // if not connected yet, wait. this prevents "possible EventEmitter memory leak detected" warnings.
      // see https://github.com/strongloop/loopback/issues/1186
      app.dataSources.callHomeDb.once('connected', function() {
        autoUpdateAll();
      });
    }

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
