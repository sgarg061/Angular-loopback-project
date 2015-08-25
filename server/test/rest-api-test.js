var assert = require('assert');
var common = require('./common');

const SOLINK_ADMIN_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_ADMIN_PASSWORD = 'test';
const SOLINK_USER_USERNAME = 'cwhiten+1@solinkcorp.com';
const SOLINK_USER_PASSWORD = 'test';



describe('REST', function() {

  this.timeout(10000);

  describe('Expected Usage', function() {

    // token to be used for all authenticated calls
    var authToken;

    describe('Login', function() {

      it('should login with a valid username/password combination and return a token', function(done) {
        common.json('post', '/api/auth/login')
          .send({
            username: SOLINK_ADMIN_USERNAME,
            password: SOLINK_ADMIN_PASSWORD
          })
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            var response = JSON.parse(res.body.response);
            assert(typeof response === 'object');
            assert(response.auth_token, 'must have an auth_token');

            authToken = response.auth_token;
            done();
          });
      });
    });

    describe('Invalid Login', function() {
      it('should not log in with an invalid username/password combination', function(done) {
        common.json('post', '/api/auth/login')
          .send({
            username: SOLINK_ADMIN_USERNAME,
            password: 'wrong password'
          })
          .expect(401)
          .end(function(err, res) {
            if (err) throw err;
            done();
          });
      });
    });


    describe('Validate Token', function() {
      it('should validate a valid token successfully', function(done) {
        common.login('solink', function (token) {
          common.json('post', '/api/auth/validate')
            .send({
              token: token
            })
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              assert(res.body.response === 'Valid token');
              done();
            });
          });
      });

      it('should not validate with a bad token', function(done) {
        common.json('post', '/api/auth/validate')
          .send({
            token: 'notavalidjwt'
          })
          .expect(401)
          .end(function(err, res) {
            if (err) throw err;
            done();
          });
      });
    });


    describe('List Devices', function() {
      var userToken;

      // log the user in order to get a token
      it('should login with a valid username/password combination and return a token', function(done) {
        common.json('post', '/api/auth/login')
          .send({
            username: SOLINK_USER_USERNAME,
            password: SOLINK_USER_PASSWORD
          })
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            var response = JSON.parse(res.body.response);

            assert(typeof response === 'object');
            assert(response.auth_token, 'must have an auth_token');

            userToken = response.auth_token;
            done();
        });
      });

      it('should allow device listing with an authenticated token', function(done) {
        common.json('get', '/api/devices', userToken)
          .send({})
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert(res.body.length > 0, 'must have returned at least one device');
            assert(typeof res.body[0] === 'object'); 
            done();
          });
      });

      it('should disallow device listing without a token', function(done) {
        common.json('get', '/api/devices')
          .send({})
          .expect(401)
          .end(function(err, res) {
            if (err) throw err;
            done();
          });
      });
   
    });

  });

});