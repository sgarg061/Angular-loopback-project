var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');

describe('Reseller tests', function() {
  'use strict';
  this.timeout(5000);

  describe('Solink, cloud owners, and the reseller in question can query resellers', function() {
    

      var reseller1;
      var reseller2;
      var cust1reseller1;
      var cust2reseller1;
      var cust1reseller2;

      before(function(done) {
        var Cloud = app.models.Cloud;
        var Reseller = app.models.Reseller;
        var Customer = app.models.Customer;
        var Device = app.models.Device;

        Cloud.find({}, function (err, res) {
          var cloud = res[0];

          Reseller.create({
            name: 'reseller 1',
            cloudId: cloud.id,
            email: 'r1@solinkcorp.com',
            password: 'hello'
          }, function (err, res) {
            reseller1 = res;

            Reseller.create({
              name: 'reseller 2',
              cloudId: cloud.id,
              email: 'r2@solinkcorp.com',
              password: 'hello',
            }, function (err, res) {
              reseller2 = res;

              Customer.create({
                name: 'c1',
                resellerId: reseller1.id,
                email: 'c@solinkcorp.com',
                password: 'test'
              }, function (err, res) {
                cust1reseller1 = res;

                Customer.create({
                  name: 'c2',
                  resellerId: reseller1.id
                }, function (err, res) {
                  cust2reseller1 = res;

                  Customer.create({
                    name: 'c3',
                    resellerId: reseller2.id
                  }, function (err, res) {
                    cust1reseller2 = res;

                    authService.createUser('c1-connect', 'test', {
                      userType: 'connect',
                      tenantId: cust1reseller1.id
                    }, function c1connectCreated (err, res) {
                      authService.createUser('c3-connect', 'test', {
                        userType: 'connect',
                        tenantId: cust1reseller2.id
                      }, function c3connectCreated(err, res) {
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      it('should only list resellers, with no leaking customer information, in the direct ownership chain of a customer-level login', function (done) {
        // c1 user should only see r1 and only c1 as a customer
        common.login({username: 'c1-connect', password: 'test'}, function (token) {
          common.json('get', '/api/resellers?filter[include]=customers', token)
            .send({})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;
              console.log('----------');
              console.log(res.body);
              console.log('----------');
              assert(res.body.length === 1, 'should only have access to one reseller');
              var retrievedReseller = res.body[0];
              assert(retrievedReseller.customers.length === 1, 'should only see the customer that i belong to');
              assert(retrievedReseller.name === reseller1.name, 'should be reseller 1s name: ');
              assert(retrievedReseller.customers[0].name === cust1reseller1.name, 'should be the customer that i belong to');

              // c3 should see only r2
              common.login({username: 'c3-connect', password: 'test'}, function (token) {
                common.json('get', '/api/resellers?filter[include]=customers', token)
                  .send({})
                  .expect(200)
                  .end(function (err, res) {
                    if (err) throw err;
                    assert(res.body.length === 1, 'should only have access to one reseller');
                    assert(res.body[0].customers.length === 1, 'should only see the customer that i belong to');
                    retrievedReseller = res.body[0];
                    assert(retrievedReseller.name === reseller2.name, 'should be reseller 1s name');
                    assert(retrievedReseller.customers[0].name === cust1reseller2.name, 'should be the customer that i belong to');

                    done();
                  });
              });
            });
        });
      });

    it('should successfully list all resellers when queried as Solink', function(done) {
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