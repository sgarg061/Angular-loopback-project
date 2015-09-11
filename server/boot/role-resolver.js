var tokenValidator = require('../../common/tokenValidator');
var loopback = require('loopback');
var logger = require('../logger');

module.exports = function (app) {
    'use strict';
    var Role = app.models.Role;

    Role.registerResolver('isValidated', function (role, context, cb) {
        var ctx = loopback.getCurrentContext();
        var jwt = ctx.get('jwt');
        if (!jwt) {
            return unauthorized(cb);
        }
        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, !err); // if no err, we are happy.
        });
    });

    Role.registerResolver('isSolink', function (role, context, cb) {
        var ctx = loopback.getCurrentContext();
        var jwt = ctx.get('jwt');
        if (!jwt) {
            return unauthorized(cb);
        }
        tokenValidator.validateToken(jwt.token, function (err, msg) {
            return cb(null, (!err && jwt.userType === 'solink'));
        });
    });

    Role.registerResolver('isOwner', function (role, context, cb) {
        var ctx = loopback.getCurrentContext();
        var jwt = ctx.get('jwt');
        if (!jwt) {
            return unauthorized(cb);
        }

        tokenValidator.validateToken(jwt.token, function (err, msg) {
            if (err) {
                logger.error('Error validating token');
                logger.error(err);
                cb(err, false);
            } else {
                if (jwt.userType === 'solink') {
                    cb(null, true);
                } else {
                    switch (context.modelName) {
                    case 'Reseller':
                        return isOwnerOfReseller(context, jwt, cb);
                    case 'Cloud':
                        return isOwnerOfCloud(context, jwt, cb);
                    case 'Device':
                        return isOwnerOfDevice(context, jwt, cb);
                    case 'Customer':
                        return isOwnerOfCustomer(context, jwt, cb);
                    case 'License':
                    return isOwnerOfLicense(context, jwt, cb);
                    default:
                        invalidMethod(cb);
                    }
                }
            }
        });
    });
};

function isOwnerOfDevice(context, token, cb) {
    switch (context.remotingContext.req.method) {
        case 'POST':
            // must be a reseller or cloud to post.
            cb(null, (['cloud', 'reseller'].indexOf(token.userType) > -1));
            break;
        case 'PUT':
            if (token.userType === 'cloud') {
                context.model.getCloud(context.remotingContext.instance.id, function (err, cloud) {
                    if (err) {
                        logger.error(err);
                        cb(err, false);
                    } else {
                        cb(null, token.cloudId === cloud.id);
                    }
                });
                break;
            } else if (token.userType === 'reseller') {
                context.model.getReseller(context.remotingContext.instance.id, function (err, reseller) {
                    if (err) {
                        logger.error(err);
                        cb(err, false);
                    } else {
                        cb(null, token.resellerId === reseller.id);
                    }
                });
                break;
            } else {
                unauthorized(cb);
                break;
            }
            break;
        default:
            invalidMethod(cb);
            break;
    }
}

function isOwnerOfCustomer(context, token, cb) {
    switch (context.remotingContext.req.method) {
        case 'POST':
            cb(null, true);
            break;
        case 'PUT':
            if (token.userType === 'cloud') {
                context.model.getCloud(context.remotingContext.instance.id, function (err, cloud) {
                    if (err) {
                        logger.error(err);
                        cb(err, false);
                    } else {
                        cb(null, token.cloudId === cloud.id);
                    }
                });
                break;
            } else if (token.userType === 'reseller') {
                cb(null, token.resellerId === context.remotingContext.instance.resellerId);
                break;
            } else {
                unauthorized(cb);
                break;
            }
            break;
        default:
            invalidMethod(cb);
            break;
    }
}

function isOwnerOfLicense(context, token, cb) {
    var Customer = loopback.getModel('Customer');

    switch (context.remotingContext.req.method) {
        case 'POST':
            var licenseCustomerId = context.remotingContext.req.body.customerId;
            if (token.userType === 'cloud') {
                // ensure that we are creating on a customer that we own...
                console.log(context.remotingContext.instance);
                Customer.findById(licenseCustomerId, {
                    include: {
                        relation: 'reseller',
                        scope: {
                            include: {
                                relation: 'cloud',
                                scope: {
                                    where: {id: token.cloudId}
                                }
                            }
                        }
                    }
                }, function (err, res) {
                    console.log('woot');
                    console.log(res);
                    if (err) {
                        unauthorized(cb);
                    } else {
                        cb(null, true);
                    }
                });
            } else if (token.userType === 'reseller') {
                Customer.findById(licenseCustomerId, function (err, res) {
                    if (err) {
                        unauthorized(cb);
                    } else {
                        cb(null, res.resellerId === token.resellerId);
                    }
                });
            } else {
                unauthorized(cb);
            }
            break;
        default:
            invalidMethod(cb);
            break;
    }
}

function isOwnerOfCloud(context, token, cb) {
    switch (context.remotingContext.req.method) {
        case 'POST':
            logger.error('ERROR: Only Solink users can create new clouds');
            unauthorized(cb);
            break;
        case 'PUT':
            if (token.userType !== 'cloud') {
                unauthorized(cb);
            } else {
                context.model.cloudId = token.cloudId;
                cb(null, context.remotingContext.instance.cloudId === token.cloudId);
            }
            break;
        case 'GET':
            if (token.userType !== 'cloud') {
                unauthorized(cb);
            } else {
                // must be a cloud user to call GET
                cb(null, token.cloudId);
            }
            break;
        default:
            invalidMethod(cb);
            break;
    }
}

function isOwnerOfReseller(context, token, cb) {
    switch (context.remotingContext.req.method) {
        case 'POST':
            if (token.userType !== 'cloud') {
                unauthorized(cb);
            } else {
                context.model.cloudId = token.cloudId;
                cb(null, true);
            }
            break;
        case 'PUT':
            // needs to be a cloud user to modify a reseller
            if (token.userType !== 'cloud') {
                unauthorized(cb);
            } else if (!token.cloudId) {
                unauthorized(cb);
            } else {
                cb(null, context.remotingContext.instance.cloudId === token.cloudId);
            }
            break;

        case 'GET':
            if (token.userType === 'cloud') {
                cb(null, token.cloudId);
            } else if (token.userType === 'reseller') {
                cb(null, token.resellerId);
            } else {
                cb(null, false);
            }
            break;
        default:
            invalidMethod(cb);
            break;
            
    }
}

function unauthorized(cb) {
    var error = new Error('Unauthorized');
    error.statusCode = 401;
    cb(error, false);
}

function invalidMethod(cb) {
    var error = new Error('Invalid method');
    error.statusCode= 405;
    cb(error, false);
}