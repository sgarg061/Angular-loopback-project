var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var _ = require('underscore');
var async = require('async');
var _ = require('lodash');
var deviceDataParser = require('../utils/deviceDataParser');

module.exports = function(PosCameraConnector) {
	PosCameraConnector.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

    // PosCameraConnector.observe('access', function limitToTenant(ctx, next) {
    //     var context = loopback.getCurrentContext();
    //     var Customer = PosCameraConnector.app.models.Customer;

    //     if (context && context.get('jwt')) {
    //         var resellerId = context.get('jwt').resellerId;
    //         var tenantId = context.get('jwt').tenantId;
    //         var cloudId = context.get('jwt').cloudId;
    //         var userType = context.get('jwt').userType;

    //         if (userType === 'solink') {
    //             next();
    //         } else if (tenantId) {
    //             if (ctx.query.where) {
    //                 ctx.query.where.assigneeId = tenantId;
    //             } else {
    //                 ctx.query.where = {
    //                     assigneeId: tenantId
    //                 };
    //             }
    //             next();
    //         } else if (resellerId) {
    //             Customer.find({where: {resellerId: resellerId}}, function (err, res) {
    //                 if (err) {
    //                     logger.error('Error querying customers with reseller id ' + resellerId);
    //                     logger.error(err);
    //                     next(err);
    //                 } else {
    //                     var ids = [];
    //                     for (var i = 0; i < res.length; i++) {
    //                         ids.push(res[i].id);
    //                     }

    //                     if (ctx.query.where) {
    //                         ctx.query.where.assigneeId = {inq: ids};
    //                     } else {
    //                         ctx.query.where = {
    //                             assigneeId: {
    //                                 inq: ids
    //                             }
    //                         };
    //                     }
    //                     next();
    //                 }
    //             });
    //         } else if (cloudId) {
    //             cloudPermissions(PosCameraConnector, ctx, cloudId, next);
    //         }
    //     } else {
    //         next();
    //     }


    // });

    // function cloudPermissions(PosCameraConnector, ctx, cloudId, next) {
    //     var Reseller = PosCameraConnector.app.models.Reseller;
    //     var Customer = PosCameraConnector.app.models.Customer;
    //     var ids = [];

    //     Reseller.find({where: {cloudId: cloudId}}, function (err, res) {
    //         if (err) {
    //             logger.error('Error querying resellers with cloud id ' + cloudId);
    //             logger.error(err);
    //             next(err);
    //         } else {
    //             var resellerIds = [];
    //             for (var i = 0; i < res.length; i++) {
    //                 resellerIds.push(res[i].id);
    //             }

    //             var customerIds = [];
    //             async.each(resellerIds, function getCustomerIds(resellerId, cb) {
    //                 Customer.find({where: {resellerId: resellerId}}, function (err, res) {
    //                     if (err) {
    //                         logger.error('Error querying customers with reseller id ' + resellerId);
    //                         logger.error(err);
    //                         cb(err);
    //                     } else {
    //                         for (var i = 0; i < res.length; i++) {
    //                             customerIds.push(res[i].id);
    //                         }
    //                         cb();
    //                     }
    //                 });
    //             }, function (err) {
    //                 if (err) {
    //                     next(err);
    //                 } else {
    //                     if (ctx.query.where) {
    //                         ctx.query.where.assigneeId = {inq: customerIds};
    //                     } else {
    //                         ctx.query.where = {
    //                             assigneeId: {
    //                                 inq: customerIds
    //                             }
    //                         };
    //                     }
    //                     next();
    //                 }
    //             });
    //         }
    //     });
    // }
};
