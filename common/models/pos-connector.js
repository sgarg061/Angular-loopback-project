var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var _ = require('underscore');
var async = require('async');
var _ = require('lodash');
var deviceDataParser = require('../utils/deviceDataParser');

module.exports = function(PosConnector) {
	PosConnector.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

 //    PosConnector.observe('access', function limitToTenant(ctx, next) {
 //        var context = loopback.getCurrentContext();
 //        var Customer = PosConnector.app.models.Customer;
 //        var Reseller = PosConnector.app.models.Reseller;

 //        if (context && context.get('jwt')) {
 //            var resellerId = context.get('jwt').resellerId;
 //            var tenantId = context.get('jwt').tenantId;
 //            var cloudId = context.get('jwt').cloudId;
 //            var userType = context.get('jwt').userType;

 //            if (userType === 'solink') {
 //                next();
 //            }
 //            else if (cloudId){
 //                if (ctx.query.where) {
 //                    ctx.query.where.assigneeId = cloudId;
 //                } else {
 //                    ctx.query.where = {
 //                        assigneeId: cloudId
 //                    };
 //                }
 //                next();            	
 //            }

 //            else if (resellerId){

	// 	        Reseller.find({ where: {id: resellerId}, fields: ['cloudId']}, function (err, res) {
	// 	            if (err) {
	// 	                logger.error('Error querying reseller with id ' + resellerId);
	// 	                logger.error(err);
	// 	                next(err);
	// 	            } else {
	// 	            	var ids = [resellerId];
	// 	            	if (res.length && res[0].cloudId) {
	// 	            		ids.push(res[0].cloudId);
	// 				        Customer.find({ where: {resellerId: resellerId}, fields: ['id']}, function (errCustomer, resCustomer) {
	// 							if (errCustomer) {
	// 				                logger.error('Error querying customer with tenantId ' + tenantId);
	// 				                logger.error(errCustomer);
	// 				                next(errCustomer);
	// 				            } else {
	// 				            	for (var i = 0; i < resCustomer.length; i++) {
	// 				            		ids.push(resCustomer[i].id);
	// 				            	}
	// 								if (ctx.query.where) {
	// 									ctx.query.where.assigneeId = {inq: ids}
	// 								} else {
	// 									ctx.query.where = {
	// 										assigneeId: {inq: ids}
	// 									};
	// 								}
	// 				            }
	// 				        })
	// 	            	}
	// 	            	else{
	// 		                logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
	// 	            	}

	// 					next();  
	// 	            }
	// 	        });
 //            }
 //            else if (tenantId) {

	// 			var ids = [tenantId];
	// 	        Customer.find({ where: {id: tenantId}, fields: ['resellerId']}, function (err, res) {
	// 	            if (err) {
	// 	                logger.error('Error querying reseller with id ' + tenantId);
	// 	                logger.error(err);
	// 	                next(err);
	// 	            } else if (res.length && res[0].resellerId) {
	//             		ids.push(res[0].resellerId);

	// 					Reseller.find({ where: {id: res[0].resellerId}, fields: ['cloudId']}, function (errReseller, resReseller) {
	// 			            if (errReseller) {
	// 			                logger.error('Error querying reseller with id ' + tenantId);
	// 			                logger.error(errReseller);
	// 			                next(errReseller);
	// 			            } else if (resReseller.length && resReseller[0].cloudId) {
	// 			            	ids.push(resReseller[0].cloudId);
	// 							if (ctx.query.where) {
	// 								ctx.query.where.assigneeId = {inq: ids}
	// 							} else {
	// 								ctx.query.where = {
	// 									assigneeId: {inq: ids}
	// 								};
	// 							}
	// 			            }
	// 			            else{
	// 			                logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
	// 			            }
	// 			        });
	//             	}
	//             	else{
	// 	                logger.error('Customer or reseller was not fetched with tenantId ' + tenantId);
	//             	}

	// 				next();
	// 	        });
 //            }
 //            else {
	//             next();
	//         }
	// 	}
	// });
}