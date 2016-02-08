var uuid = require('node-uuid');
var logger = require('../../server/logger');
var loopback = require('loopback');
var authService = require('../../server/services/authService');

module.exports = function(Customer) {

  Customer.observe('before save', function addId(ctx, next) {
    customerAccessPermissions(ctx, function permissionsGranted(err) {
      if (err) {
        var error = new Error('Unauthorized');
        error.statusCode = 401;
        next(error);
      } else {
        if (ctx.instance && !ctx.instance.id) {
          ctx.instance.id = uuid.v1();

          if (ctx.isNewInstance) {
            ctx.instance.isValid(function (valid) {
              if (!valid) {
                var error = new Error('Invalid customer');
                error.statusCode = 400;
                next(error);
              } else {
                // customer is valid
                createCustomerAdminUser(ctx.instance, function (err) {
                  ctx.instance.unsetAttribute('password');
                  next(err);
                });
              }
            });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    });
  });

  Customer.remoteMethod('getOwnership', {
    accepts: {arg: 'id', type: 'string', required: true},
    returns: {arg: 'ownershipProperties', type: 'Object'}
  });

  Customer.remoteMethod('listUsers', {
    http: {verb: 'get', status: 200, errorStatus: 500},
    accepts: {arg: 'id', type: 'string', required: true},
    returns: {arg: 'users', type: 'Array'}
  });

  // this one should probably belong to a users model..
  Customer.remoteMethod('updateUserMetadata', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'metadata', type: 'object'}
    ],
    http: {verb: 'put', status: 200, errorStatus: 500},
    returns: {arg: 'response', type: 'object'}
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

  Customer.updateUserMetadata = function (id, metadata, cb) {
    var error;

    authService.updateMetadata(id, metadata, function (err, res) {
      return cb(err, res);
    });
  };

  Customer.listUsers = function (id, cb) {
    var error;
    Customer.find({where: {id: id}}, function (err, res) {
      if (err) {
        return cb(new Error('Error while retrieving users'));
      }

      if (res.length < 1) {
        error = new Error('Unable to find customer ' + id);
        error.statusCode = 404;
        return cb(error);
      }

      if (res.length > 1) {
        error = new Error('Duplicate customers found with id ' + id);
        error.statusCode = 422;
        return cb(error);
      }

      authService.listUsers('tenantId', id, function (err, res) {
        if (err) {
          logger.error(err);
          cb(err, null);
        }
        cb(err, res);
      });
    });
  };
};

function customerAccessPermissions(ctx, next) {
  var error;
  var context = loopback.getCurrentContext();
  if (context && context.get('jwt')) {
    var resellerId = context.get('jwt').resellerId;
    var cloudId = context.get('jwt').cloudId;
    var userType = context.get('jwt').userType;

    if (userType === 'solink') {
      next();
    } else if (resellerId) {
      if (ctx.isNewInstance) {
        ctx.instance.resellerId = resellerId;
        if (ctx.instance.id) {
          ctx.instance.id = null;
        }
      } else {
        // resellers cannot change reseller IDs
        if (ctx.data.resellerId) {
          delete ctx.data.resellerId;
        }
        if (ctx.data.id) {
          delete ctx.data.id;
        }
      }
      next();
    } else if (cloudId) {
      if (ctx.isNewInstance) {
        // cloud users can only create customers for resellers under their own domain
        var Reseller = ctx.Model.app.models.Reseller;
        Reseller.find({where: {id: ctx.instance.resellerId}}, function (err, res) {
          if (err) {
            logger.error('Error validating that the cloud is customer is being attached to a valid reseller');
            logger.error(err);
            next(err);
          } else {
            if (res.length < 1) {
              error = new Error('Reseller not found');
              error.statusCode = 404;
              next(error);
            } else {
              if (res[0].cloudId === cloudId) {
                if (ctx.instance.id) {
                  ctx.instance.id = null;
                }
                next();
              } else {
                error = new Error('Not authorized to attach this customer to this reseller');
                error.statusCode = 401;
                next(error);
              }
            }
          }
        });
      } else {
        // cloud users cannot modify the reseller or customer id
        if (ctx.data.resellerId) {
          delete ctx.data.resellerId;
        }

        if (ctx.data.id) {
          delete ctx.data.id;
        }
        next();
      }
    } else {
      error = new Error('Unauthorized');
      error.statusCode = 401;
      next(error);
    }
  } else {
    next();
  }
}

function createCustomerAdminUser(customer, next) {
    var userData = {
        userType: 'admin',
        customerId: customer.id,
        email_verified: true
    };

    authService.createUser(customer.email, customer.password, userData, function (err, res) {
        if (err) {
            logger.error('Could not create customer user');
            logger.error(err);
            next(err);
        } else {
            logger.info('Created new customer user ' + customer.email);
            logger.info(res);
            customer.unsetAttribute('password');
            next();
        }
    });
}
