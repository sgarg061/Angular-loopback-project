var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');

describe('Device tests', function() {
  'use strict';
  this.timeout(5000);

  describe('POST permissions', function() {
    it('should always be successful for solink users', function(done) {
      var deviceName = 'test device';

      common.login('solink', function(token) {
        common.json('post', '/api/devices', token)
          .send({
            id: 'yoohoo',
            guid: 'whatis this',
            name: deviceName,
            customerId: 'a customer'
          })
          .expect(200)
          .end(function (err, res) {
            if (err) throw err;

            var device = res.body;
            assert(typeof device === 'object');
            assert(device.name === deviceName);

            done();
          });
      });
    });

    // TODO: what are the permissions required around devices?
    // I suspect they should only be creatable through license creation,
    // but we should verify...
  });
});