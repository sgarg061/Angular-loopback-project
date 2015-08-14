var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(Reseller) {

    Reseller.observe('before save', function addId(ctx, next) {
        if (ctx.instance && !ctx.instance.id) {
            ctx.instance.id = uuid.v1();
            if (!ctx.instance.password) {
                var error = new Error('Password not provided for reseller account');
                error.statusCode = 400;
                next(error);
            } else {
                createResellerUser(ctx.instance, next);
            }
        } else {
            next();
        }
    });

    Reseller.observe('access', function resellerPermissions(ctx, next) {
        var context = loopback.getCurrentContext();

        if (context && (!context.get('jwt') || context.get('jwt').userType === 'solink')) {
            return next();
        } else if (context && context.get('jwt') && context.get('jwt').resellerId) {
            var resellerId = context.get('jwt').resellerId;

            if (ctx.query.where) {
                ctx.query.where.id = resellerId;
            } else {
                ctx.query.where = {
                    resellerId: resellerId
                };
            }
            next();
        } else if (context && context.get('jwt') && context.get('jwt').cloudId) {
            // resellerId must be in list of this cloud's
            var cloudId = context.get('jwt').cloudId;

            if (ctx.query.where) {
                ctx.query.where.cloudId = cloudId;
            } else {
                ctx.query.where = {
                    cloudId: cloudId
                };
            }
            next();
        }
    });

    function createResellerUser(reseller, next) {
        var userData = {
            userType: 'reseller',
            resellerId: reseller.id
        };

        authService.createUser(reseller.email, reseller.password, userData, function (err, res) {
            if (err) {
                logger.error('Could not create reseller user');
                logger.error(err);
                next(err);
            } else {
                logger.info('Created new reseller user ' + reseller.email);
                logger.info(res);
                reseller.unsetAttribute('password');
                next();
            }
        });
    }

    Reseller.validatesPresenceOf('email', {message: 'Please provide an email address for this reseller account'});

    Reseller.remoteMethod('getOwnership', {
        accepts: {arg: 'id', type: 'string', required: true},
        returns: {arg: 'ownershipProperties', type: 'Object'}
    });

    Reseller.getOwnership = function (id, cb) {
        var error;

        Reseller.find({where: {id: id}}, function (err, res) {
            if (err) {
                logger.log('Error retrieving reseller with id ' + id);
                logger.error(err);
                cb(new Error('Error while retrieving reseller ownership'));
            } else {
                if (res.length < 1) {
                    error = new Error('Unable to find reseller ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate resellers found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    Reseller.app.models.Cloud.find({where: {id: res[0].cloudId}}, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving cloud'));
                        } else {
                            if (res.length < 0) {
                                error = new Error('Unable to find cloud ' + id);
                                error.statusCode = 404;
                                cb(error);
                            } else if (res.length > 1) {
                                error = new Error('Duplicate clouds found with id ' + id);
                                error.statusCode = 422;
                                cb(error);
                            } else {
                                var ownershipProperties = {
                                    cloudId: res[0].id,
                                    resellerId: id
                                };
                                cb(null, ownershipProperties);
                            }
                        }
                    });
                }
            }
        });
    };
};