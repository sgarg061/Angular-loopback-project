var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');

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
          console.log('TIME TO TRY TO CREATE A USER UNSUCESSFULLY' + loginType);
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
  
  // TODO: verify permissions across clouds
});