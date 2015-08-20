var assert = require('assert');
var common = require('./common');

describe('License tests', function() {
  'use strict';
  this.timeout(5000);

  describe('Device activation fails with invalid license', function() {
    it('should return an error', function(done) {
      common.json('post', '/api/licenses/activate')
        .send({key: 'ABCDABCDABC'})
        .expect(400)
        .end(function(err, res) {
          if (err) {
            console.log('error! ' + err);
            throw err;
          }
          done();
        });
    });
  });

  describe('Device activation succeeds with valid license', function() {
    var device;
    it('should activate license and return a new device', function (done) {
      common.json('post', '/api/licenses/activate')
        .send({key: 'ABCDABCDABCD'})
        .expect(200)
        .end(function(err, res) {
          if (err) {
            console.log('error! ' + err);
            throw err;
          }
          device = JSON.parse(res.body);
          assert(device.deviceId, 'must have a deviceId');
          
          done();
        });
    });
  });

  describe('Creating a license cannot be done with a standard admin account', function() {
    it('should return an unauthorized http response', function(done) {
      common.login('admin', function (token) {
        common.json('post', '/api/licenses', token)
          .send({customerId: 1})
          .expect(401)
          .end(function (err, res) {
            if (err) throw err;
            done();
          });
      });
    });
  });

  describe('Creating a license cannot be done with a standard user account', function() {
    it('should return an unauthorized http response', function(done) {
      common.login('user', function (token) {
        common.json('post', '/api/licenses', token)
          .send({customerId: 1})
          .expect(401)
          .end(function (err, res) {
            if (err) throw err;
            done();
          });
      });
    });
  });

  describe('Creating a license cannot be done without a token', function() {
    it('should return an unauthorized http response', function(done) {
      common.json('post', '/api/licenses')
        .send({customerId: 1})
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });
  });


  describe('Creating a license succeeds with correct setup', function() {
    it('should create a new license and device, plus use a new random license key', function(done) {
      common.login('solink', function (token) {
        // first, count the number of devices so we can check that they increment later on.
        common.json('get', '/api/devices/count', token)
          .send({})
          .expect(200)
          .end(function (err, res) {
            if (err) {
              console.log('error count devices: ' + err);
              throw err;
            }
            var countBeforeLicenseCreation = res.body.count;
            common.json('post', '/api/licenses', token)
              .send({
                customerId: '1',
                key: 'ABCDABCDABCD'
              })
              .expect(200) // TODO: this should really be 201... why is loopback returning 200?
              .end(function (err, res) {
                if (err) {
                  console.log('error creating license: ' + err);
                  throw err;
                }
                assert(res.body.id, 'must have created a new id');
                assert(res.body.username, 'must return a username');
                assert(res.body.password, 'must return a password');
                assert(res.body.customerId, 'must return a customer ID');
                assert(res.body.deviceId, 'must return a device ID');
                assert.notEqual(res.body.key, 'ABCDABCDABCD', 'the key must be randomly generated, not the one passed in');

                // get device count afterwards, to ensure a new device was created.
                common.json('get', '/api/devices/count', token)
                  .send({})
                  .expect(200)
                  .end(function (err, res) {
                    if (err) {
                      console.log('error counting devices: ' + err);
                      throw err;
                    }
                    var countAfterLicenseCreation = res.body.count;
                    assert.equal(countAfterLicenseCreation, countBeforeLicenseCreation + 1, 'must have 1 new device');
                  });
                done();
              });
          });
      });
    });
  });
});