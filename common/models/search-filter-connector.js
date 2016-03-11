var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var _ = require('underscore');
var async = require('async');
var _ = require('lodash');
var deviceDataParser = require('../utils/deviceDataParser');

module.exports = function(SearchFilterConnector) {
  SearchFilterConnector.observe('before save', function addId(ctx, next) {
    if (ctx.instance && !ctx.instance.id) {
      ctx.instance.id = uuid.v1();
    }
    next();
  });

  SearchFilterConnector.observe('access', function limitToTenant(ctx, next) {
    var context = loopback.getCurrentContext();
    var Customer = SearchFilterConnector.app.models.Customer;
    var Reseller = SearchFilterConnector.app.models.Reseller;

    if (context && context.get('jwt')) {
      var resellerId = context.get('jwt').resellerId;
      var tenantId = context.get('jwt').tenantId;
      var cloudId = context.get('jwt').cloudId;
      var userType = context.get('jwt').userType;

      if (userType === 'solink') {
        next();
      }
      else if (cloudId){
        cloudPermissions(SearchFilterConnector, ctx, cloudId, next);
      }

      else if (resellerId) {

        Reseller.find({ where: {id: resellerId}, fields: ['cloudId']}, function (err, res) {
          if (err) {
            logger.error('Error querying reseller with id ' + resellerId);
            next(err);
          } else {
            var ids = [resellerId];
            if (res.length && res[0].cloudId) {
              ids.push(res[0].cloudId);
              Customer.find({ where: {resellerId: resellerId}, fields: ['id']}, function (errCustomer, resCustomer) {
                if (errCustomer) {
                  logger.error('Error querying customer with tenantId ' + tenantId);
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
            } else{
              logger.error('Reseller or cloud was not fetched with resellerId ' + resellerId);
            }

            next();
          }
        });
      } else if (tenantId) {
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
      } else {
        next();
      }
    } else {
      next();
    }
  });



  function cloudPermissions(SearchFilterConnector, ctx, cloudId, next) {
    var Reseller = SearchFilterConnector.app.models.Reseller;
    var Customer = SearchFilterConnector.app.models.Customer;
    var ids = [cloudId];

    Reseller.find({where: {cloudId: cloudId}}, function (err, res) {
      if (err) {
        logger.error('Error querying resellers with cloud id ' + cloudId);
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

  SearchFilterConnector.observe('access', function(ctx, next) {
    ctx.query.include = _.merge(ctx.query.include, {
      relation: 'query',
      scope: {
        fields: ['id', 'filter', 'name', 'description', 'lastUpdated']
      }
    });
    next();
  });

  SearchFilterConnector.prototype.toJSON = function() {
    var connector = this.toObject(false, true, false);
    delete connector.id;
    delete connector.filterId;
    delete connector.assigneeId;
    delete connector.assigneeType;
    return connector;
  };

};