var loopback = require('loopback');
var config = require('../../config');
var jwt = require('jsonwebtoken');
var tokenValidator = require('../../common/tokenValidator');

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('isValidated', function(role, context, cb) {
    var jwt = context.remotingContext.req.jwt;
    if (!jwt) {
      return reject(cb);
    }

    tokenValidator.validateToken(jwt.token, function (err, msg) {
      return cb(null, !err); // if no err, we are happy.
    });
  });

  Role.registerResolver('isSolink', function(role, context, cb) {
    var jwt = context.remotingContext.req.jwt;
    if (!jwt) {
      return reject(cb);
    }

    tokenValidator.validateToken(jwt.token, function(err, msg) {
      console.log((!err && jwt.user_type === 'solink'));
      return cb(null, (!err && jwt.user_type === 'solink'));
    })
  });


}

function reject(cb) {
  process.nextTick(function() {
    cb(null, false);
  });
}