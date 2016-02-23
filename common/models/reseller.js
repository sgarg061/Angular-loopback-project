var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');
var _ = require('lodash');

module.exports = function(Reseller) {

  Reseller.observe('before save', function addId(ctx, next) {
    resellerAccessPermissions(ctx, function permissionsGranted(err) {
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
                var error = new Error ('Invalid reseller');
                error.statusCode = 400;
                next(error);
              } else {
                // reseller is valid...
                createResellerUser(ctx.instance, function (err) {
                  ctx.instance.unsetAttribute('password');
                  next(err);
                });
              }
            });
          }
        } else {
          next();
        }
      }
    });
  });

  Reseller.observe('access', function resellerPermissions(ctx, next) {
    resellerAccessPermissions(ctx, next);
  });

  Reseller.validatesPresenceOf('email', {message: 'Please provide an email address for this reseller account'});

  Reseller.remoteMethod('getOwnership', {
    accepts: {arg: 'id', type: 'string', required: true},
    returns: {arg: 'ownershipProperties', type: 'Object'}
  });

  Reseller.remoteMethod('listUsers', {
    isStatic: false,
    http: {
      verb: 'get',
      path: '/listUsers',
      status: 200,
      errorStatus: 500
    },
    accepts: [],
    returns: {arg: 'users', type: 'Array'}
  });

  Reseller.prototype.listUsers = function (cb) {
    authService.listUsers('resellerId', this.id, function (err, res) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }

      cb(null, res);
    });
  };


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

function resellerAccessPermissions(ctx, next) {
  var context = loopback.getCurrentContext();
  if (!context) {
    // triggered by a test or server-side code
    return next();
  }

  if (context.get('jwt')) {
    var resellerId = context.get('jwt').resellerId;
    var cloudId = context.get('jwt').cloudId;
    var userType = context.get('jwt').userType;
    var customerId = context.get('jwt').tenantId;

    switch (userType) {
      case 'solink':
        return next();
      case 'admin':
      case 'connect':
      case 'standard':
        console.log('i am a connect...');
        // only allow read for reseller
        loopback.getModel('Customer').findById(customerId, function (err, customer) {
          console.log('here is my customer...', customer);
          if (err) {
            return next(err);
          } else {
            var merged = _.merge({temp: 'temp'}, ctx.query.where);
            ctx.query.where = _.merge(merged, {id: customer.resellerId});
            delete ctx.query.where.temp;// this is a weird work around.  _.merge not working as expected
            return next();
          }
        });
        break;
      case 'reseller':
        if (ctx.isNewInstance) {
          // resellers cannot create new resellers
          var e = new Error('Unauthorized');
          e.statusCode = 401;
          return next(e);
        } else {
          // resellers cannot change reseller or cloud IDs
          if (ctx.data && ctx.data.id) {
            delete ctx.data.id;
          }
          ctx.query.where = _.merge(ctx.query.where, {id: resellerId});
        }
        return next();

      case 'cloud':
        if (ctx.isNewInstance) {
          // cloud users can only create resellers under their own domain
          ctx.instance.cloudId = cloudId;
          ctx.instance.id = null;
        } else {
          // cloud users cannot modify the reseller or cloud id
          if (ctx.data && ctx.data.cloudId) {
            delete ctx.data.cloudId;
          }
          if (ctx.data && ctx.data.id) {
            delete ctx.data.id;
          }
        }
        return next();
      default:
        var error = new Error('Unauthorized');
        error.statusCode = 401;
        return next(error);
    }
  } else {
    var unauthError = new Error('Unauthorized');
    unauthError.statusCode = 401;
    return next(unauthError);
  }
}

function createResellerUser(reseller, next) {
  var userData = {
    userType: 'reseller',
    resellerId: reseller.id,
    email_verified: true
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