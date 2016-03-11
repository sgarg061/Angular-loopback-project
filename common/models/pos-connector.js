'use strict';

var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var async = require('async');

module.exports = function(POSConnector) {
	POSConnector.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

    POSConnector.observe('access', function limitToTenant(ctx, next) {
        var context = loopback.getCurrentContext();
        var Customer = POSConnector.app.models.Customer;
        var Reseller = POSConnector.app.models.Reseller;

        if (context && context.get('jwt')) {
            var resellerId = context.get('jwt').resellerId;
            var tenantId = context.get('jwt').tenantId;
            var cloudId = context.get('jwt').cloudId;
            var userType = context.get('jwt').userType;

            if (userType === 'solink') {
                next();
            }
            else if (cloudId){
                cloudPermissions(POSConnector, ctx, cloudId, next);
            }

            else if (resellerId){

		        Reseller.find({ where: {id: resellerId}, fields: ['cloudId']}, function (err, res) {
		            if (err) {
		                logger.error('Error querying reseller with id ' + resellerId);
		                logger.error(err);
		                next(err);
		            } else {
		            	var ids = [resellerId];
		            	if (res.length && res[0].cloudId) {
		            		ids.push(res[0].cloudId);
					        Customer.find({ where: {resellerId: resellerId}, fields: ['id']}, function (errCustomer, resCustomer) {
								if (errCustomer) {
					                logger.error('Error querying customer with tenantId ' + tenantId);
					                logger.error(errCustomer);
					                next(errCustomer);
					            } else {
					            	for (var i = 0; i < resCustomer.length; i++) {
					            		ids.push(resCustomer[i].id);
					            	}
									if (ctx.query.where) {
										ctx.query.where.assigneeId = {inq: ids};
									} else {
										ctx.query.where = {
											assigneeId: {inq: ids}
										};
									}
					            }
					        });
		            	}
		            	else{
			                logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
		            	}

						next();
		            }
		        });
            }
            else if (tenantId) {
				if (ctx.query.where) {
					ctx.query.where.assigneeId = tenantId;
					ctx.query.where.assigneeType = 'customer';
				} else {
					ctx.query.where = {
						assigneeId: tenantId,
						assigneeType: 'customer'
					};
				}
				next();
            }
            else {
	            next();
	        }
		}
	});



    function cloudPermissions(POSConnector, ctx, cloudId, next) {
        var Reseller = POSConnector.app.models.Reseller;
        var Customer = POSConnector.app.models.Customer;
        var ids = [cloudId];

        Reseller.find({where: {cloudId: cloudId}}, function (err, res) {
            if (err) {
                logger.error('Error querying resellers with cloud id ' + cloudId);
                logger.error(err);
                next(err);
            } else {
            	var resellerIds = [];
                for (var i = 0; i < res.length; i++) {
                	resellerIds.push(res[i].id);
                    ids.push(res[i].id);
                }

                async.each(resellerIds, function getCustomerIds(resellerId, cb) {
                    Customer.find({where: {resellerId: resellerId}}, function (err, res) {
                        if (err) {
                            logger.error('Error querying customers with reseller id ' + resellerId);
                            logger.error(err);
                            cb(err);
                        } else {
                            for (var i = 0; i < res.length; i++) {
                                ids.push(res[i].id);
                            }
                            cb();
                        }
                    });
                }, function (err) {
                    if (err) {
                        next(err);
                    } else {
                        if (ctx.query.where) {
                            ctx.query.where.assigneeId = {inq: ids};
                        } else {
                            ctx.query.where = {
                                assigneeId: {
                                    inq: ids
                                }
                            };
                        }
                        next();
                    }
                });
            }
        });
    }


    POSConnector.prototype.toJSON = function() {
        var connector = this.toObject(false, true, false);
        delete connector.assigneeId;
        delete connector.assigneeType;
        return connector;
    };

};