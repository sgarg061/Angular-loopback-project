var loopback = require('loopback');
var jwt = require('jsonwebtoken');
var boot = require('loopback-boot');
var redisAccessor = require('./redisAccessor');
var config = require('../config');

var app = module.exports = loopback();

app.use(loopback.context());
app.use(function jwtMiddleware (req, res, next) {
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
        var unpacked_token = jwt.decode(token);
        
        var jwtToken = {
            'token': token,
            'userType': unpacked_token.app_metadata.user_type,
            'tenantId': unpacked_token.app_metadata.tenant_id
        };
        var ctx = loopback.getCurrentContext();
        ctx.set('jwt', jwtToken);

        return next();
    } catch (err) {
        console.log('Error processing jwt token. ' + err);
        return next();
    }
});

function initializeRedis() {
    redisAccessor.initialize([
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
    initializeRedis();
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
  if (require.main === module)
    app.start();
});
