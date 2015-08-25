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
        logger.debug('Validating token: ' + token);
        logger.debug('validation request has come from solink. validating...');
        tokenValidator.validateToken(token, cb);
    };

    Auth.login = function (username, password, cb) {
        logger.debug('Logging in with username ' + username);
        authService.login(username, password, cb);
    };

    Auth.refresh = function(token, cb) {
        authService.refresh(token, cb);
    };

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
            accepts: {arg: 'token', type: 'string'},
            returns: {arg: 'auth_token', type: 'string'}
        }
    );
};