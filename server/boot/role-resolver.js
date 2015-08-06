var tokenValidator = require('../../common/tokenValidator');

module.exports = function (app) {
    'use strict';
    var Role = app.models.Role;

    Role.registerResolver('isValidated', function (role, context, cb) {
        var jwt = context.remotingContext.req.jwt;
        if (!jwt) {
            return reject(cb);
        }

        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, !err); // if no err, we are happy.
        });
    });

    Role.registerResolver('isSolink', function (role, context, cb) {
        var jwt = context.remotingContext.req.jwt;
        if (!jwt) {
            return reject(cb);
        }

        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, (!err && jwt.user_type === 'solink'));
        });
    });
};

function reject(cb) {
    'use strict';
    process.nextTick(function () {
        cb(null, false);
    });
}