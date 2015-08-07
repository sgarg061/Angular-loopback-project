var loopback = require('loopback');
var boot = require('loopback-boot');
var Auth0Accessor = require('./dependencyAccessors/auth0Accessor');
var authService = require('./services/authService');

var app = module.exports = loopback();

app.start = function() {
  authService.initialize(new Auth0Accessor());
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
