'use strict';

var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var async = require('async');

module.exports = function(SearchFilter) {
	SearchFilter.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
    if (ctx.instance) {
      ctx.instance.lastUpdated = Date();
    }

    next();
  });

  SearchFilter.observe('after delete', (ctx, next) => {
    // delete associated connectors
    var Connector = SearchFilter.app.models.SearchFilterConnector;
    const whereClause = {
      filterId: ctx.where.id
    };
    Connector.destroyAll(whereClause)
    .then(() => {
      next();
    })
    .catch((err) => {
      logger.error('Error deleting report connectors', err);
      next();
    });
  });

  SearchFilter.observe('access', function limitToTenant(ctx, next) {
    var context = loopback.getCurrentContext();
    var Customer = SearchFilter.app.models.Customer;
    var Reseller = SearchFilter.app.models.Reseller;

    if (context && context.get('jwt')) {
      var resellerId = context.get('jwt').resellerId;
      var tenantId = context.get('jwt').tenantId;
      var cloudId = context.get('jwt').cloudId;
      var userType = context.get('jwt').userType;

      if (userType === 'solink') {
        next();
      } else if (cloudId) {
        cloudPermissions(SearchFilter, ctx, cloudId, next);
      } else if (resellerId) {
        Reseller.find({ where: {id: resellerId}, fields: ['cloudId']}, (err, res) => {
          if (err) {
            logger.error('Error querying reseller with id ' + resellerId);
            logger.error(err);
            next(err);
          } else {
            var ids = [resellerId];
            if (res.length && res[0].cloudId) {
              ids.push(res[0].cloudId);
              Customer.find({ where: {resellerId: resellerId}, fields: ['id']}, (errCustomer, resCustomer) => {
                if (errCustomer) {
                  logger.error('Error querying customer with tenantId ' + tenantId);
                  logger.error(errCustomer);
                  next(errCustomer);
                } else {
                  for (var i = 0; i < resCustomer.length; i++) {
                    ids.push(resCustomer[i].id);
                  }

                  if (ctx.query.where) {
                    ctx.query.where.creatorId = {inq: ids};
                  } else {
                    ctx.query.where = {
                      creatorId: {inq: ids}
                    };
                  }
                }
              });
            } else {
              logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
            }

            next();
          }
        });
      } else if (tenantId) {
        var ids = [tenantId];
        Customer.find({ where: {id: tenantId}, fields: ['resellerId']}, (err, res) => {
          if (err) {
            logger.error('Error querying reseller with id ' + tenantId);
            logger.error(err);
            next(err);
          } else if (res.length && res[0].resellerId) {
            ids.push(res[0].resellerId);

            Reseller.find({ where: {id: res[0].resellerId}, fields: ['cloudId']}, function (errReseller, resReseller) {
              if (errReseller) {
                logger.error('Error querying reseller with id ' + tenantId);
                logger.error(errReseller);
                next(errReseller);
              } else if (resReseller.length && resReseller[0].cloudId) {
                ids.push(resReseller[0].cloudId);
                if (ctx.query.where) {
                  ctx.query.where.creatorId = {inq: ids};
                } else {
                  ctx.query.where = {
                    creatorId: {inq: ids}
                  };
                }
              } else {
                logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
              }
            });
          } else {
            logger.error('Customer or reseller was not fetched with tenantId ' + tenantId);
          }

          next();
        });
      } else {
        next();
      }
    } else {
      // this case is for internal tests hitting the internal PersistedModel API directly
      next();
    }
  });

  function cloudPermissions(SearchFilter, ctx, cloudId, next) {
    var Reseller = SearchFilter.app.models.Reseller;
    var Customer = SearchFilter.app.models.Customer;
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
              ctx.query.where.creatorId = {inq: ids};
            } else {
              ctx.query.where = {
                creatorId: {
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

};
