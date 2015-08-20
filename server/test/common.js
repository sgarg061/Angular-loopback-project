var request = require('supertest');
var app = require('../server');
var assert = require('assert');
var authService = require('../services/authService');
var AuthAccessor = require('../dependencyAccessors/fakeAuth0Accessor');
var RedisAccessor = require('../dependencyAccessors/fakeRedisAccessor');
var cacheService = require('../services/cacheService');
var config = require('../../config');
var sampleData = require('../create-sample-data');

const SOLINK_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_PASSWORD = 'test';
const ADMIN_USERNAME = 'cwhiten+1@solinkcorp.com';
const ADMIN_PASSWORD = 'test';
const USER_USERNAME = 'cwhiten+user@solinkcorp.com';
const USER_PASSWORD = 'test';
const CLOUD_USERNAME = 'cwhiten+cloud@solinkcorp.com';
const CLOUD_PASSWORD = 'test';
const RESELLER_USERNAME = 'cwhiten+reseller@solinkcorp.com';
const RESELLER_PASSWORD = 'test';

module.exports = {
    json: function (verb, url, token) {
        var jsonRequest = request(app)[verb](url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        if (token) {
            jsonRequest.set('Authorization', 'Bearer ' + token);
        }
        return jsonRequest;
    },
    login: function (creds, next) {
        var username = '';
        var password = '';
        if (typeof creds === 'object') {
            username = creds.username;
            password = creds.password;
        } else {
            if (creds === 'solink') {
                username = SOLINK_USERNAME;
                password = SOLINK_PASSWORD;
            }
            else if (creds === 'admin') {
                username = ADMIN_USERNAME;
                password = ADMIN_PASSWORD;
            } else if (creds === 'user') {
                username = USER_USERNAME;
                password = USER_PASSWORD;
            } else if (creds === 'cloud') {
                username = CLOUD_USERNAME;
                password = CLOUD_PASSWORD;
            } else if (creds === 'reseller') {
                username = RESELLER_USERNAME;
                password = RESELLER_PASSWORD;
            }
        }

        this.json('post', '/api/auth/login')
            .send({
                username: username,
                password: password
        })
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            var response = JSON.parse(res.body.response);
            assert(typeof response === 'object');
            assert(response.auth_token, 'must have an auth_token');

            next(response.auth_token);
        });
    }
};

before(function(done) {
    authService.initialize(new AuthAccessor());
    RedisAccessor.initialize([
    {
        name: 'revoked',
        port: config.revokedTokensRedisPort,
        address: config.revokedTokensRedisLocation
    },
    {
      name: 'validated',
      port: config.validatedTokensRedisPort,
      address: config.validatedTokensRedisLocation
    }]);

    cacheService.initialize(RedisAccessor);

    sampleData(app, function() {
      done();
    });
});