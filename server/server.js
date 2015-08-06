var loopback = require('loopback');
var jwt = require('jsonwebtoken');
var boot = require('loopback-boot');

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
            'user_type': unpacked_token.app_metadata.user_type,
            'tenant_id': unpacked_token.app_metadata.tenant_id
        };

        var ctx = loopback.getCurrentContext();
        ctx.jwt = jwtToken;

        return next();
    } catch (err) {
        console.log('Error processing jwt token. ' + err);
        return next();
    }
});

app.start = function() {
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
