var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');

describe('Reseller tests', function() {
  'use strict';
  this.timeout(5000);

  describe('Solink, cloud owners, and the reseller in question can query resellers', function() {
    it('should return an error for each other type of user', function(done) {
      
      var invalidLoginTypes = ['user', 'admin'];
      async.each(invalidLoginTypes, function loginWithInvalidType(loginType, cb) {
        common.login(loginType, function (token) {
          common.json('get', '/api/resellers', token)
            .send({})
            .expect(401)
            .end(function (err, res) {
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
        common.json('get', '/api/resellers', token)
        .send({})
        .expect(200) // should be 201.
        .end(function (err, res) {
          if (err) {
            throw err;
          } 
          done();
        });
      });
    });
  });

describe('Solink and cloud users can create new resellers', function() {
  it('should return an error for other types of users', function(done) {

    var invalidLoginTypes = ['user', 'admin', 'reseller'];
    app.models.Cloud.find({}, function (err, res) {
      var cloudId = res[0].id;
      var softwareVersionId = res[0].softwareVersionId;

      async.each(invalidLoginTypes, function loginWithInvalidType(loginType, cb) {
        common.login(loginType, function (token) {
          common.json('post', '/api/resellers', token)
            .send({
              name: 'Reseller 1',
              cloudId: cloudId,
              softwareVersionId: softwareVersionId,
              email: 'cwhiten+failedreseller@solinkcorp.com',
              password: 'test'
            })
            .expect(401)
            .end(function (err, res) {
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
  });

  it('should create successfully with solink credentials', function(done) {
    common.login('solink', function (token) {
      // need a cloud + software version to post.
      app.models.Cloud.find({}, function (err, res) {
        var cloudId = res[0].id;
        var softwareVersionId = res[0].softwareVersionId;

        common.json('post', '/api/resellers', token)
        .send({
          name: 'solink reseller', 
          cloudId: cloudId,
          softwareVersionId: softwareVersionId,
          email: 'cwhiten+solinkreseller@solinkcorp.com',
          password: 'test'
        })
        .expect(200) // should be 201.
        .end(function (err, res) {
          if (err) {
            throw err;
          } 
          done();
        });
      });
    });
  });
});
  
describe('To create or modify a reseller, you must be along its ownership chain', function () {

  var validCloud;
  var softwareVersionId;
  var fakeResellerId = 'not a valid id';
  var fakeCloudId = 'not a real cloud id';

  var cloudUsername = 'cloudCreatingReseller';
  var cloudPassword = 'test';

  before(function() {
    app.models.SoftwareVersion.find({}, function (err, res) {
      softwareVersionId = res[0].id;
       app.models.Cloud.create({
        name: 'resellerOwnershipChainCloud',
        eventServerUrl: 'asdf',
        imageServerUrl: 'asdf',
        signallingServerUrl: 'aerw',
        updateUrl: 'foji',
        checkinInterval: 3600,
        softwareVersionId: softwareVersionId,
        email: 'hello@solink.com',
        password: 'test'
      }, function (err, res) {
        if (err) {
          throw err;
        } else {
          validCloud = res;
        }
      });
     });
  });

  it('should not allow a cloud user to create a reseller with a different cloud id', function (done) {

    // try to create a reseller on a different cloud, fail
    common.login('cloud', function (token) {
      common.json('post', '/api/resellers', token)
        .send({
          name: 'Reseller on another cloud',
          cloudId: fakeCloudId,
          softwareVersionId: softwareVersionId,
          email: 'cwhiten+failedreseller@solinkcorp.com',
          password: 'test',
          id: fakeResellerId
        })
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          var newReseller = res.body;
          assert(typeof newReseller === 'object');
          assert(newReseller.id !== fakeResellerId, 'do not accept client-sent ids');
          assert(newReseller.cloudId !== fakeCloudId, 'ensure that the cloud ID is forced to the id of this user');
          
          done();
        });
    }, {
      userType: 'cloud',
      cloudId: validCloud.id
    });
  });

  it('should allow a cloud user to create a reseller under itself', function (done) {

    authService.createUser(cloudUsername, cloudPassword, {
      userType: 'cloud',
      cloudId: validCloud.id
    }, function userCreated (err, res) {
      common.login({username: cloudUsername, password: cloudPassword}, function (token) {

        common.json('post', '/api/resellers', token)
        .send({
          name: 'Reseller on the same cloud',
          cloudId: validCloud.id,
          softwareVersionId: softwareVersionId,
          email: 'cwhiten+goodreseller@solinkcorp.com',
          password: 'test',
          id: fakeResellerId
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var newReseller = res.body;
          assert(typeof newReseller === 'object');
          assert(newReseller.id !== fakeResellerId, 'do not accept client-sent ids');
          assert(newReseller.cloudId === validCloud.id, 'ensure that the cloud ID is forced to the id of this user');
          
          done();
        });
      });
    });
  });

  it('should not allow a cloud user to change a resellers cloud id', function (done) {
    authService.createUser(cloudUsername, cloudPassword, {
      userType: 'cloud',
      cloudId: validCloud.id
    }, function userCreated (err, res) {
      common.login({username: cloudUsername, password: cloudPassword}, function (token) {
        // first, create the reseller to move
        common.json('post', '/api/resellers', token)
        .send({
          name: 'reseller on the same cloud',
          cloudId: validCloud.id,
          softwareVersionId: softwareVersionId,
          email: 'cwhiten+goodreseller2@solinkcorp.com',
          password: 'test',
          id: fakeResellerId
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var newReseller = res.body;

          // now, try to modify that reseller to change the cloud id
          common.json('put', '/api/reseller/' + newReseller.id, token)
          .send({
            cloudId: '1'
          })
          .expect(404)
          .end(function (err, res) {
            if (err) throw err;

            done();
          });
        });
      });
    });
  });
});
});