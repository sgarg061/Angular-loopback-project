var tokenValidator = require('../../common/tokenValidator');
var loopback = require('loopback');

module.exports = function (app) {
    'use strict';
    var Role = app.models.Role;

    Role.registerResolver('isValidated', function (role, context, cb) {
        var ctx = loopback.getCurrentContext();
        var jwt = ctx.get('jwt');
        if (!jwt) {
            return reject(cb);
        }

        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, !err); // if no err, we are happy.
        });
    });

    Role.registerResolver('isSolink', function (role, context, cb) {
        var ctx = loopback.getCurrentContext();
        var jwt = ctx.get('jwt');
        if (!jwt) {
            return reject(cb);
        }

        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, (!err && jwt.userType === 'solink'));
        });
    });
};

function reject(cb) {
    'use strict';
    process.nextTick(function () {
        cb(null, false);
    });
}