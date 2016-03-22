'use strict';

var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(Cloud) {

    Cloud.observe('before save', function addId(ctx, next) {
        if (ctx.instance && !ctx.instance.id) {
            ctx.instance.id = uuid.v1();

            if (ctx.isNewInstance) {
                ctx.instance.isValid(function (valid) {
                    if (!valid) {
                        var error = new Error('Invalid cloud');
                        error.statusCode = 400;
                        next(error);
                    } else {
                        // cloud is valid...
                        createCloudUser(ctx.instance, function(err) {
                            ctx.instance.unsetAttribute('password');
                            next(err);
                        });
                    }
                });
            }
        } else {
            next();
        }
    });

    Cloud.observe('access', function cloudPermissions(ctx, next) {
        var context = loopback.getCurrentContext();

        if (context && context.get('jwt')) {
            var cloudId = context.get('jwt').cloudId;
            var customerId = context.get('jwt').tenantId;
            var userType = context.get('jwt').userType;
            var resellerId = context.get('jwt').resellerId;
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
            } else if (resellerId) {
                loopback.getModel('Reseller').findById(resellerId, function (err, res) {
                    if (ctx.query.where) {
                        ctx.query.where.id = res.cloudId;
                    } else {
                        ctx.query.where = {
                            id: res.cloudId
                        };
                    }

                    next();
                });
            } else if (customerId) {
                // get the cloud of this customer id, must be that id.
                loopback.getModel('Customer').findById(customerId, {include: 'reseller'}, function (err, res) {
                    var cloudId = res.toJSON().reseller.cloudId;
                    if (ctx.query.where) {
                        ctx.query.where.id = cloudId;
                    } else {
                        ctx.query.where = {
                            id: cloudId
                        };
                    }
                    next();
                });
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
            cloudId: cloud.id,
            email_verified: true
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

    Cloud.remoteMethod('listUsers', {
        isStatic: false,
        http: {
          verb: 'get',
          path: '/listUsers',
          status: 200,
          errorStatus: 500
        },
        accepts: [],
        returns: {arg: 'users', type: 'Array'}
    });
    Cloud.prototype.listUsers = function (cb) {
    authService.listUsers('cloudId', this.id, function (err, res) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }

      cb(null, res);
    });
  };
};
