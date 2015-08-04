var request = require('supertest');
var app = require('../server');
var assert = require('assert');


var sampleData = require('../create-sample-data');

const SOLINK_ADMIN_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_ADMIN_PASSWORD = 'test';
const SOLINK_USER_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_USER_PASSWORD = 'test';

before(function(done) {
  sampleData(app, function() {
    done();
  });
});

function json(verb, url, token) {
    var jsonRequest = request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    if (token) {
      jsonRequest.set('Authorization', 'Bearer ' + token);
    }
    return jsonRequest;
}

describe('REST', function() {

  this.timeout(5000);

  describe('Expected Usage', function() {


    // token to be used for all authenticated calls
    var authToken;

    describe('POST /api/auth/login', function() {

        it('should login with a valid username/password combination and return a token', function(done) {
          json('post', '/api/auth/login')
            .send({
              username: SOLINK_ADMIN_USERNAME,
              password: SOLINK_ADMIN_PASSWORD
            })
            .expect(200)
            .end(function(err, res) {
              var response = JSON.parse(res.body.response);

              assert(typeof response === 'object');
              assert(response.auth_token, 'must have an auth_token');

              authToken = response.auth_token;
              done();
            });
        });
      });

    describe('POST /api/auth/validate', function() {

        it('should validate an valid token successfully', function(done) {
          json('post', '/api/auth/validate', authToken)
            .send({
              token: authToken
            })
            .expect(200)
            .end(function(err, res) {
              assert(res.body.response == 'Valid token');
              done();
            });
        });
      });

    describe('POST /api/devices', function() {

        it('should create a new device', function(done) {
          json('post', '/api/devices', authToken)
            .send({
              id: '1234',
              name: 'Device ABC',
              locationId: '4567'
            })
            .expect(200)
            .end(function(err, res) {
              assert(typeof res.body === 'object');
              assert(res.body.id, 'must have an id');

              done();
            });
        });
      });

    describe('GET /api/devices', function() {
        it('should return a list of all devices', function(done) {
          json('get', '/api/devices', authToken)
            .expect(200)
            .end(function(err, res) {
              assert(Array.isArray(res.body));
              assert(res.body.length);

              done();
            });
        });
      });

    

  });
});