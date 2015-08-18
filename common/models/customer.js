var uuid = require('node-uuid');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(Customer) {
	Customer.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

	Customer.remoteMethod('getOwnership', {
        accepts: {arg: 'id', type: 'string', required: true},
        returns: {arg: 'ownershipProperties', type: 'Object'}
    });

    Customer.observe('access', function customerPermissions(ctx, next) {
        var context = loopback.getCurrentContext();

        if (context && (!context.get('jwt') || context.get('jwt').userType === 'solink')) {
            // querying as a test or as solink
            next();
        } else if (context && context.get('jwt') && context.get('jwt').tenantId) {
            // querying with a customer's credentials
            var tenantId = context.get('jwt').tenantId;
            if (ctx.query.where) {
                ctx.query.where.id = tenantId;
            } else {
                ctx.query.where = {
                    id: tenantId
                };
            }
            next();
        } else if (context && context.get('jwt') && context.get('jwt').resellerId) {
            var resellerId = context.get('jwt').resellerId;
            if (ctx.query.where) {
                ctx.query.where.resellerId = resellerId;
            } else {
                ctx.query.where = {
                    resellerId: resellerId
                };
            }
            next();
        } else if (context && context.get('jwt') && context.get('jwt').cloudId) {
            var cloudId = context.get('jwt').cloudId;
            var Reseller = Customer.app.models.Reseller;

            Reseller.find({where: {cloudId: cloudId}}, function (err, res) {
                if (err) {
                    logger.error('Error querying resellers with cloud id ' + cloudId);
                    logger.error(err);
                    next(err);
                } else {
                    var ids = [];
                    for (var i = 0; i < res.length; i++) {
                        ids.push(res[i].id);
                    }

                    if (ctx.query.where) {
                        ctx.query.where.resellerId = {inq: ids};
                    } else {
                        ctx.query.where = {
                            resellerId: {
                                inq: ids
                            }
                        };
                    }
                    next();
                }
            });
        }
    });

    Customer.getCloud = function (id, cb) {
        var error;

        var Cloud = Customer.app.models.Cloud;
        Customer.getReseller(id, function (err, res) {
            if (err) {
                cb(err, -1);
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find reseller for customer ' + id);
                    error.statusCode = 404;
                    cb(error, -1);
                } else if (res.length > 1) {
                    error = new Error('Duplicate resellers found for customer ' + id);
                    error.statusCode = 422;
                    cb(error, -1);
                } else {
                    Cloud.find({where: {id: res.cloudId}}, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving cloud for customer ' + id), -1);
                        } else {
                            if (res.length < 1) {
                                error = new Error('Unable to find cloud for customer' + id);
                                error.statusCode = 404;
                                cb(error, -1);
                            } else if (res.length > 1) {
                                error = new Error('Duplicate clouds found for customer ' + id);
                                error.statusCode = 422;
                                cb(error, -1);
                            } else {
                                cb(null, res);
                            }
                        }
                    });
                }
            }
        });
    };

    Customer.getReseller = function(id, cb) {
        var error;
        var Reseller = Customer.app.models.Reseller;

        Customer.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving customer ownership'));
            } else {
                if (res.length < 1) {
                    error = new Error('Unable to find customer ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate customers found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    var resellerId = res[0].resellerId;
                    Reseller.find({where: {id: resellerId}}, function (err, res) {
                        if (err) {
                            logger.error(err);
                            cb(new Error('Error while retrieving reseller for customer ' + id));
                        } else if (res.length < 1) {
                            error = new Error('Unable to find reseller for customer ' + id);
                            error.statusCode = 404;
                            cb(error, -1);
                        } else if (res.length > 1) {
                            error = new Error('Duplicate resellers for customer ' + id);
                            error.statusCode = 422;
                            cb(error, -1);
                        } else {
                            cb(null, res);
                        }
                    });
                }
            }
        });
    };

    Customer.getOwnership = function (id, cb) {
        var error;
        Customer.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving customer ownership'));
            } else {
                if (res.length < 1) {
                    error = new Error('Unable to find customer ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate customers found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    Customer.app.models.Reseller.getOwnership(res[0].resellerId, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving reseller ownership'));
                        } else {
                        	var ownershipProperties = res;
                        	ownershipProperties.customerId = id;
                        	cb(null, ownershipProperties);
                        }
                    });
                }
            }
        });
    };
};