'use strict';
var assert = require('assert');
var common = require('./common');
var app = require('../server');
var authService = require('../services/authService');

var reseller = 'reseller';
var resellerId = reseller;
var cloud = 'cloud';
var cloudId = cloud;
var customer = 'customer';
var customerId = customer;
describe('User tests', function () {
  this.timeout(5000);

  before(function (done) {
    // create users to play with.
    app.models.Reseller.find({}, function (err, res) {
      var r = res[0];
      resellerId = r.id;

      common.login('solink', function (token) {
        authService.createUser(reseller, 'test', {
          userType: 'reseller',
          resellerId: resellerId
        }, function resellerCreated (err, res) {
          authService.createUser(cloud, 'test', {
            userType: 'cloud',
            cloudId: cloudId
          }, function cloudCreated(err, res) {
            done();
          });
        });
      });
    });
  });

  describe('Update metadata tests', function () {

  });

  describe('Delete tests', function () {

  });

  describe('Force set password tests', function () {

  });

  describe('Create user tests', function () {
    it('should not allow resellers to create cloud users', function (done) {
      common.login({username: reseller, password: 'test'}, function (token) {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'dodo@dood.com',
          password: 'asfd',
          userType: 'cloud',
          orgId: resellerId
        })
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create solink users', function (done) {
      common.login({username: reseller, password: 'test'}, function (token) {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'solink',
          orgId: '1'
        })
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create other resellers', function (done) {
      common.login({username: reseller, password: 'test'}, function (token) {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'reseller',
          orgId: 'asfd'
        })
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create users for customers they do not own', function (done) {
      common.login({username: reseller, password: 'test'}, function (token) {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'admin',
          orgId: 'asdzzzzf'
        })
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
      });
    });
  });
});