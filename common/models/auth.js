var logger = require('../../server/logger');
var jwt = require('jsonwebtoken');
var loopback = require('loopback');
var tokenValidator = require('../tokenValidator');
var authService = require('../../server/services/authService');

module.exports = function (Auth) {
  'use strict';

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

  Auth.updateUserMetadata = function (id, metadata, cb) {
    // TODO: verify permissions!
    authService.updateMetadata(id, metadata, function (err, res) {
      return cb(err, res);
    });
  };

  Auth.forceSetPassword = function(id, newPassword, cb) {
    logger.debug('Forcing a set password of user ' + id);

    var unauthorizedError = new Error('Unauthorized');
    unauthorizedError.statusCode = 401;

    var context = loopback.getCurrentContext();
    if (context && context.get('jwt')) {
      var jwt = context.get('jwt');
      var userType = jwt.userType;
      if (['solink', 'cloud', 'reseller'].indexOf(userType) < 0) {
        return cb(unauthorizedError, null);
      }

      authService.getUser(id, function (err, user) {
        if (err) {
          return cb(err, null);
        }

        // lost the context... reset it.  TODO: investigate why this happens
        context.set('jwt', jwt);

        switch (user.app_metadata.userType) {
          case 'admin':
          case 'standard':
            var tenantId = user.app_metadata.tenantId;
            if (userType === 'solink') {
              // just do it
              changePassword(id, newPassword, cb);
            } else if (userType === 'reseller') {
              var resellerId = jwt.resellerId;
              // query for customer, make sure customer.resellerId === resellerId
              Auth.app.models.Customer.findOne({where: {id: tenantId}}, function (err, customer) {
                if (err) {
                  logger.error('Error retrieving customer for force password:', err);
                  return cb(err, null);
                }

                if (!customer) {
                  var error = new Error('Customer not found');
                  error.statusCode = 404;
                  return cb(error, null);
                }

                if (customer.resellerId !== resellerId) {
                  return cb(unauthorizedError, null);
                } else {
                  changePassword(id, newPassword, cb);
                }
              });
            } else if (userType === 'cloud') {
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
                  logger.error('Error retrieving customer for force password:', err)
                  return cb(err, null);
                }

                if (!customer) {
                  var error = new Error('Customer not found');
                  error.statusCode = 404;
                  return cb(error, null);
                }

                if (customer.reseller().cloudId !== cloudId) {
                  return cb(unauthorizedError, cb);
                } else {
                  changePassword(id, newPassword, cb);
                }
              });
            } else {
              // something terribly wrong
              return cb(unauthorizedError, null);
            }
            break;

          case 'reseller':
            // TODO: check for ownership
            // implement this at a later date
            return cb(unauthorizedError, null);
            break;

          case 'cloud':
            // TODO: check for ownership
            // implement this at a later date
            return cb(unauthorizedError, null);
            break;

          default:
            return cb(unauthorizedError, null);
        }
      });
    } else {
      return cb(unauthorizedError, null);
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
      {arg: 'metadata', type: 'object'}
    ],
    http: {verb: 'put', status: 200, errorStatus: 500},
    returns: {arg: 'response', type: 'object'}
  });

  Auth.remoteMethod('forceSetPassword', {
    accepts: [
      {arg: 'id', type: 'string'},
      {arg: 'password', type: 'string'}
    ],
    http: {verb: 'get', status: 200, errorStatus: 500},
    returns: {arg: 'resposne', type: 'object'}
  });
};