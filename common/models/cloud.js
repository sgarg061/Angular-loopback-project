var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(Cloud) {

    Cloud.observe('before save', function addId(ctx, next) {
        if (ctx.instance && !ctx.instance.id) {
            ctx.instance.id = uuid.v1();
            if (!ctx.instance.password) {
                var error = new Error('Password not provided for cloud account');
                error.statusCode = 400;
                next(error);
            } else {
                next();
            }
        } else {
            next();
        }
    });

    Cloud.observe('after save', function createUser(ctx, next) {
        if (ctx.isNewInstance) {
            createCloudUser(ctx.instance, next);
        } else {
            next();
        }
    });

    Cloud.observe('access', function cloudPermissions(ctx, next) {
        var context = loopback.getCurrentContext();

        if (context && context.get('jwt')) {
            var cloudId = context.get('jwt').cloudId;
            
            if (context.get('jwt').userType === 'solink') {
                next();
            } else if (cloudId) {
                if (ctx.query.where) {
                    ctx.query.where.id = cloudId;
                } else {
                    ctx.query.where = {
                        cloudId: cloudId
                    };
                }
                next();
            } else {
                var error = new Error('Unauthorized');
                error.statusCode = 401;
                next(error);
            }
        } else {
            next();
        }

    });

    function createCloudUser(cloud, next) {
        var userData = {
            userType: 'cloud',
            cloudId: cloud.id
        };

        authService.createUser(cloud.email, cloud.password, userData, function (err, res) {
            if (err) {
                logger.error('Could not create cloud user');
                logger.error(err);
                next(err);
            } else {
                logger.info('Created new cloud user ' + cloud.email);
                logger.info(res);
                cloud.unsetAttribute('password');
                next();
            }
        });
    }

    Cloud.validatesPresenceOf('email', {message: 'Please provide an email address for this cloud account'});
};
