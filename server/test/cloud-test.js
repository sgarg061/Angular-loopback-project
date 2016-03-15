'use strict';

var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');

describe('Cloud tests', function() {
  this.timeout(5000);

  describe('Only solink can query clouds', function() {
    it('should return an error for each other type of user', function(done) {

      var invalidLoginTypes = ['reseller', 'user', 'admin'];
      async.each(invalidLoginTypes, function loginWithInvalidType(loginType, cb) {
        common.login(loginType, function (token) {
          common.json('get', '/api/clouds', token)
            .send({})
            .expect(401)
            .end(function (err) {
              if (err) {
                cb(err);
              } else {
                cb();
              }
            });
        });
      }, function (err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    it('should successfully list clouds when queried as Solink', function(done) {
      common.login('solink', function (token) {
        common.json('get', '/api/clouds', token)
        .send({})
        .expect(200)
        .end(function (err) {
          if (err) {
            throw err;
          }

          done();
        });
      });
    });

    it('should return OK but not return anybody elses clouds when queried as a cloud user', function(done) {
      common.login('cloud', function (token) {
        common.json('get', '/api/clouds', token)
          .send({})
          .expect(200)
          .end(function (err, res) {
            if (err) throw err;

            assert(res.body.length === 0, 'should not return any cloud data');
            done();
          });
      });
    });
  });

  describe('Only Solink can create new clouds', function() {
    it('should return an error for each other type of user', function(done) {

      var invalidLoginTypes = ['cloud', 'reseller', 'user', 'admin'];
      async.each(invalidLoginTypes, function loginWithInvalidType(loginType, cb) {
        common.login(loginType, function (token) {
          common.json('post', '/api/clouds', token)
            .send({
              name: 'sample cloud',
              serverUrl: 'http://test.xyz',
              imageServerUrl: 'http://image.xyz',
              updateUrl: 'http://update.xyz',
              signallingServerUrl: 'http://signal.xyz',
              checkinInterval: 3600,
              email: 'newsamplecloud@solinkcorp.com',
              password: 'test'
            })
            .expect(401)
            .end(function (err) {
              if (err) {
                cb(err);
              } else {
                cb();
              }
            });
        });
      }, function (err) {
        if (err) {
          throw err;
        }
        done();
      });
    });

    it('should successfully create a cloud when queried as Solink', function(done) {
      common.login('solink', function (token) {
        // need a software version to post.
        app.models.SoftwareVersion.find({}, function (err, res) {
          var softwareVersionId = res[0].id;

          common.json('post', '/api/clouds', token)
          .send({
            name: 'sample cloud',
            eventServerUrl: 'http://test.xyz',
            imageServerUrl: 'http://image.xyz',
            updateUrl: 'http://update.xyz',
            signallingServerUrl: 'http://signal.xyz',
            checkinInterval: 3600,
            softwareVersionId: softwareVersionId,
            email: 'newsamplecloud@solinkcorp.com',
            password: 'test'
          })
          .expect(200) // should be 201.
          .end(function (err) {
            if (err) {
              throw err;
            }

            done();
          });
        });
      });
    });

  });
});