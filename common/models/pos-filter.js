var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(PosFilter) {
    'use strict';
	PosFilter.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

	
    PosFilter.observe('access', function limitToTenant(ctx, next) {
        var context = loopback.getCurrentContext();
        var Customer = PosFilter.app.models.Customer;

        if (context && context.get('jwt')) {
            var resellerId = context.get('jwt').resellerId;
            var tenantId = context.get('jwt').tenantId;
            var cloudId = context.get('jwt').cloudId;
            var userType = context.get('jwt').userType;

            if (userType === 'solink') {
                next();
            } else if (tenantId) {
                if (ctx.query.where) {
                    ctx.query.where.customerId = tenantId;
                } else {
                    ctx.query.where = {
                        customerId: tenantId
                    };
                }
                next();
            } else if (resellerId) {
                Customer.find({where: {resellerId: resellerId}}, function (err, res) {
                    if (err) {
                        logger.error('Error querying customers with reseller id ' + resellerId);
                        logger.error(err);
                        next(err);
                    } else {
                        var ids = [];
                        for (var i = 0; i < res.length; i++) {
                            ids.push(res[i].id);
                        }

                        if (ctx.query.where) {
                            ctx.query.where.customerId = {inq: ids};
                        } else {
                            ctx.query.where = {
                                customerId: {
                                    inq: ids
                                }
                            };
                        }
                        next();
                    }
                });
            } else if (cloudId) {
                cloudPermissions(PosFilter, ctx, cloudId, next);
            }
        } else {
            next();
        }


    });


};
