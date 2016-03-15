'use strict';

var logger = require('../../server/logger');
var loopback = require('loopback');
var tokenValidator = require('../tokenValidator');
var authService = require('../../server/services/authService');

module.exports = function (Auth) {
  Auth.disableRemoteMethod('create', true);
  Auth.disableRemoteMethod('upsert', true);
  Auth.disableRemoteMethod('updateAll', true);
  Auth.disableRemoteMethod('updateAttributes', false);

  Auth.disableRemoteMethod('find', true);
  Auth.disableRemoteMethod('findById', true);
  Auth.disableRemoteMethod('findOne', true);

  Auth.disableRemoteMethod('deleteById', true);

  Auth.disableRemoteMethod('confirm', true);
  Auth.disableRemoteMethod('count', true);
  Auth.disableRemoteMethod('exists', true);
  Auth.disableRemoteMethod('resetPassword', true);

  Auth.disableRemoteMethod('__count__accessTokens', false);
  Auth.disableRemoteMethod('__create__accessTokens', false);
  Auth.disableRemoteMethod('__delete__accessTokens', false);
  Auth.disableRemoteMethod('__destroyById__accessTokens', false);
  Auth.disableRemoteMethod('__findById__accessTokens', false);
  Auth.disableRemoteMethod('__get__accessTokens', false);
  Auth.disableRemoteMethod('__updateById__accessTokens', false);

  Auth.disableRemoteMethod('createChangeStream', true);

  Auth.validate = function (token, cb) {
    tokenValidator.validateToken(token, cb);
  };

  Auth.login = function (username, password, cb) {
    logger.debug('Logging in with username ' + username);
    authService.login(username, password, cb);
  };

  Auth.refresh = function(refreshToken, jwt, cb) {
    authService.refresh(refreshToken, jwt, cb);
  };

  Auth.setpassword = function(email, oldPassword, newPassword, cb) {
    logger.debug('Changing password of user ' + email);
    authService.setPassword(email, oldPassword, newPassword, cb);
  };

  Auth.forgotpassword = function(email, newPassword, cb) {
    logger.debug('Forgot password of user ' + email);
    authService.forgotPassword(email, newPassword, cb);
  };

  Auth.updateUserMetadata = function (id, appMetadata, userMetadata, cb) {
    // there is a common pattern here across these Auth methods.
    // Refactor whenever time
    logger.debug('Updating user ' + id);

    var unauthorizedError = new Error('Unauthorized');
    unauthorizedError.statusCode = 401;

    var context = loopback.getCurrentContext();
    if (context && context.get('jwt')) {
      var jwt = context.get('jwt');
      var userType = jwt.userType;

      if (userType === 'standard' || userType === 'admin') {
        // users can only modify themselves, and only a small portion of themselves.
        authService.getUser(id, function (err, user) {
          if (err) {
            return cb(err, null);
          }

          context.set('jwt', jwt);
          if (user.app_metadata.tenantId !== jwt.tenantId) {
            return cb(unauthorizedError, null);
          }

          // users can't update their own app metadata. pass through null
          authService.updateMetadata(id, null, userMetadata, function (err, res) {
            return cb(err, res);
          });
        });
      }
      else if (!isCallHomeLevelUserType(userType)) {
        return cb(unauthorizedError, null);
      } else {
        authService.getUser(id, function (err, user) {
          if (err) {
            return cb(err, null);
          }

          // lost the context... reset it.  TODO: investigate why this happens
          context.set('jwt', jwt);

          canModifyUser(user, function(canModify) {
            if (canModify) {
              // don't allow for modifying userType or tenantId/resellerId/cloudId right now.
              delete appMetadata.userType;
              delete appMetadata.tenantId;
              delete appMetadata.resellerId;
              delete appMetadata.cloudId;

              authService.updateMetadata(id, appMetadata, userMetadata, function (err, res) {
                return cb(err, res);
              });
            } else {
              return cb(unauthorizedError, null);
            }
          });
        });
      }
    } else {
      return cb(unauthorizedError, null);
    }
  };

  Auth.deleteUser = function (id, cb) {
    logger.debug('Deleting user ' + id);

    var unauthorizedError = new Error('Unauthorized');
    unauthorizedError.statusCode = 401;

    var context = loopback.getCurrentContext();
    if (context && context.get('jwt')) {
      var jwt = context.get('jwt');
      var userType = jwt.userType;
      if (!isCallHomeLevelUserType(userType)) {
        return cb(unauthorizedError, null);
      }

      authService.getUser(id, function (err, user) {
        if (err) {
          return cb(err, null);
        }

        // lost the context... reset it.  TODO: investigate why this happens
        context.set('jwt', jwt);

        canModifyUser(user, function(canModify) {
          if (canModify) {
            return authService.deleteUser(id, cb);
          } else {
            return cb(unauthorizedError, null);
          }
        });
      });
    } else {
      return cb(unauthorizedError, null);
    }
  };

  Auth.forceSetPassword = function (id, newPassword, cb) {
    logger.debug('Forcing a set password of user ' + id);

    var unauthorizedError = new Error('Unauthorized');
    unauthorizedError.statusCode = 401;

    var context = loopback.getCurrentContext();
    if (context && context.get('jwt')) {
      var jwt = context.get('jwt');
      var userType = jwt.userType;
      if (!isCallHomeLevelUserType(userType)) {
        return cb(unauthorizedError, null);
      }

      authService.getUser(id, function (err, user) {
        if (err) {
          return cb(err, null);
        }

        // lost the context... reset it.  TODO: investigate why this happens
        context.set('jwt', jwt);

        canModifyUser(user, function(canModify) {
          if (canModify) {
            changePassword(id, newPassword, cb);
          } else {
            return cb(unauthorizedError, null);
          }
        });
      });
    } else {
      return cb(unauthorizedError, null);
    }
  };

  Auth.createUser = function(email, password, userType, orgId, cb) {
    logger.info('Create user request for ' + email);

    var unauthorizedError = new Error('Unauthorized');
    unauthorizedError.statusCode = 401;

    var fakeUser = {
      app_metadata: {
        userType: userType
      }
    };
    var userData = {
      userType: userType,
      email_verified: true
    };
    var orgKey = '';
    // map type -> orgid to get an object
    switch (userType) {
      case 'admin':
      case 'standard':
        orgKey = 'tenantId';
        fakeUser.app_metadata['tenantId'] = orgId;
        userData['customerId'] = orgId;
        break;
      case 'reseller':
        orgKey = 'resellerId';
        fakeUser.app_metadata['resellerId'] = orgId;
        userData['resellerId'] = orgId;
        break;
      case 'cloud':
        orgKey = 'cloudId';
        fakeUser.app_metadata['cloudId'] = orgId;
        userData['cloudId'] = orgId;
        break;
      default:
        return cb(unauthorizedError, null);
    }
    // check if they have permissions to create on that object
    // use a fake user and re-use our existing 'canModifyUser' function
    canModifyUser(fakeUser, function(canModify) {
      if (!canModify) {
        return cb(unauthorizedError, null);
      } else {
        // then, create
        authService.createUser(email, password, userData, function (err, res) {
          if (err) {
            logger.error('Could not create user' + err);
            return cb(err, null);
          } else {
            logger.info('Successfully created new user ' + email);
            return cb(null, res);
          }
        });
      }
    });
  };

  function isCallHomeLevelUserType(userType) {
    return ['solink', 'cloud', 'reseller'].indexOf(userType) > -1;
  }

  function canModifyUser(user, cb) {
    try {
      var context = loopback.getCurrentContext();
      var jwt = context.get('jwt');
      var userType = jwt.userType;

      switch (user.app_metadata.userType) {
        case 'admin':
        case 'standard':
          var tenantId = user.app_metadata.tenantId;
          switch (userType) {
            case 'solink':
              return cb(true);
            case 'reseller':
              var resellerId = jwt.resellerId;
              // query for customer, make sure customer.resellerId === resellerId
              Auth.app.models.Customer.findOne({where: {id: tenantId}}, function (err, customer) {
                if (err) {
                  logger.error('Error retrieving customer for force password:', err);
                  return cb(false);
                }

                if (!customer) {
                  var error = new Error('Customer not found');
                  error.statusCode = 404;
                  return cb(false);
                }

                if (customer.resellerId !== resellerId) {
                  return cb(false);
                } else {
                  return cb(true);
                }
              });
              break;
            case 'cloud':
              // check that customer matching tenantId's reseller matches this cloudid
              var cloudId = jwt.cloudId;
              Auth.app.models.Customer.findOne({
                where: {id: tenantId},
                include: {
                  relation: 'reseller',
                  scope: {
                    fields: ['id', 'name', 'cloudId']
                  }
                }
              }, function (err, customer) {
                if (err) {
                  logger.error('Error retrieving customer for force password:', err);
                  return cb(false);
                }

                if (!customer) {
                  var error = new Error('Customer not found');
                  error.statusCode = 404;
                  return cb(false);
                }

                if (customer.reseller().cloudId !== cloudId) {
                  return cb(false);
                } else {
                  return cb(true);
                }
              });
              break;
            default:
              return cb(false);
          }
          break;
        case 'reseller':
          switch (userType) {
            case 'solink':
              return cb(true);
            case 'reseller':
              // must have matching id
              resellerId = user.app_metadata.resellerId;
              var myResellerId = jwt.resellerId;
              return cb(resellerId === myResellerId);
            case 'cloud':
              // reseller must have cloudid that matches me
              cloudId = jwt.cloudId;
              Auth.app.models.Reseller.findOne({
                where: {id: user.app_metadata.resellerId}
              }, function (err, reseller) {
                if (err) {
                  logger.error('Error retrieving reseller to create user:', err);
                  return cb(false);
                }

                if (!reseller) {
                  var error = new Error('Reseller not found');
                  error.statusCode = 404;
                  return cb(false);
                }

                return cb(reseller.cloudId === cloudId);
              });
              break;
            default:
              return cb(false);
          }
          break;
        case 'cloud':
          // TODO: check for ownership
          // implement this at a later date
          return cb(false);

        default:
          return cb(false);
      }
    } catch (err) {
      console.log(err);
      return cb(false);
    }
  }

  function changePassword(id, password, cb) {
    authService.forceSetPassword(id, password, cb);
  }

  Auth.remoteMethod(
    'validate',
    {
      accepts: {arg: 'token', type: 'string', required: true},
      http: {verb: 'post', status: 200, errorStatus: 500},
      returns: {arg: 'response', type: 'string'}
    }
    );

  Auth.remoteMethod(
    'login',
    {
      accepts: [
      {arg: 'username', type: 'string'},
      {arg: 'password', type: 'string'}
      ],
      http: {verb: 'post', status: 200, errorStatus: 401},
      returns: {arg: 'response', type: 'Array'}
    }
    );

  Auth.remoteMethod(
    'refresh',
    {
      accepts: [
      {arg: 'refreshToken', type: 'string'},
      {arg: 'jwtToken', type: 'string'}
      ],
      returns: {arg: 'response', type: 'string'}
    }
    );

  Auth.remoteMethod(
    'setpassword',
    {
      accepts: [
      {arg: 'email', type: 'string', required: true},
      {arg: 'oldPassword', type: 'string', required: true},
      {arg: 'newPassword', type: 'string', required: true}
      ],
      http: {verb: 'post', status: 202, errorStatus: 401},
      returns: {arg: 'response', type: 'Array'}
    }
    );

  Auth.remoteMethod(
    'forgotpassword',
    {
      accepts: [
      {arg: 'email', type: 'string', required: true},
      {arg: 'newPassword', type: 'string', required: true}
      ],
      http: {verb: 'post', status: 200, errorStatus: 400},
      returns: {arg: 'response', type: 'Array'}
    }
    );

  Auth.remoteMethod('updateUserMetadata', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'appMetadata', type: 'object'},
      {arg: 'userMetadata', type: 'object'}
    ],
    http: {verb: 'put', status: 200, errorStatus: 500},
    returns: {arg: 'response', type: 'object'}
  });

  Auth.remoteMethod('forceSetPassword', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'password', type: 'string'}
    ],
    http: {verb: 'put', status: 200, errorStatus: 500},
    returns: {arg: 'response', type: 'object'}
  });

  Auth.remoteMethod('deleteUser', {
    accepts: [
      {arg: 'id', type: 'string'},
    ],
    http: {verb: 'delete', status: 204, errorStatus: 500},
    returns: {arg: 'response', type: 'string'}
  });

  Auth.remoteMethod('createUser', {
    accepts: [
      {arg: 'email', type: 'string'},
      {arg: 'password', type: 'string'},
      {arg: 'userType', type: 'string'},
      {arg: 'orgId', type: 'string'}
    ],
    http: {verb: 'post', status: 201, errorStatus: 500},
    returns: {arg: 'response', type: 'object'}
  });
};