'use strict';

var assert = require('assert');
var common = require('./common');
var app = require('../server');
var authService = require('../services/authService');

describe('Customer tests', function() {
  this.timeout(5000);

  var validCloud;
  var validCloud2;

  var resellerCloud1;
  var resellerCloud2;

  var softwareVersionId;

  var cloud1User;
  var cloud1UserUsername = 'cloud1user';
  var cloud2User;
  var cloud2UserUsername = 'cloud2user';
  var reseller1User;
  var reseller1UserUsername = 'reseller1user';
  var reseller2User;
  var reseller2UserUsername = 'reseller2user';
  var customerName = 'test customer';

  before(function() {
    // get software version
    app.models.SoftwareVersion.find({}, function (err, res) {
      softwareVersionId = res[0].id;

      // create cloud
       app.models.Cloud.create({
        name: 'customerTestCloud',
        eventServerUrl: 'afsd',
        imageServerUrl: 'asfd',
        signallingServerUrl: 'sdfa',
        updateUrl: 'asdf',
        checkinInterval: 3600,
        softwareVersionId: softwareVersionId,
        email: 'hello@solink.com',
        password: 'test'
      }, function (err, res) {
        if (err) throw err;
        validCloud = res;

        // create second cloud
        app.models.Cloud.create({
          name: 'customerTestCloud2',
          eventServerUrl: 'wefa',
          imageServerUrl: 'wef',
          signallingServerUrl: 'asfd',
          updateUrl: 'asfdadfs',
          checkinInterval: 3600,
          softwareVersionId: softwareVersionId,
          email: 'hello@solink.com',
          password: 'test'
        }, function (err, res) {
          if (err) throw err;
          validCloud2 = res;

          // create reseller under first cloud
          app.models.Reseller.create({
            name: 'reseller 1',
            cloudId: validCloud.id,
            email: 'dodo@solinkcorp.com',
            password: 'hello'
          }, function (err, res) {
            if (err) throw err;
            resellerCloud1 = res;

            // create reseller under second cloud
            app.models.Reseller.create({
              name: 'reseller 2',
              cloudId: validCloud2.id,
              email: 'dodo2@solinkcorp.com',
              password: 'test'
            }, function (err, res) {
              if (err) throw err;
              resellerCloud2 = res;

              // create users
              authService.createUser(cloud1UserUsername, 'test', {
                userType: 'cloud',
                cloudId: validCloud.id
              }, function cloud1Created (err, res) {
                cloud1User = res;
                authService.createUser(cloud2UserUsername, 'test', {
                  userType: 'cloud',
                  cloudId: validCloud2.id
                }, function cloud2Created (err, res) {
                  cloud2User = res;
                  authService.createUser(reseller1UserUsername, 'test', {
                    userType: 'reseller',
                    resellerId: resellerCloud1.id
                  }, function reseller1Created (err, res) {
                    reseller1User = res;
                    authService.createUser(reseller2UserUsername, 'test', {
                      userType: 'reseller',
                      resellerId: resellerCloud2.id
                    }, function reseller2Created (err, res) {
                      reseller2User = res;
                    });
                  });
                });
              });
            });
          });
        });
      });
     });
  });

  describe('POST permissions', function() {

    it('should always be successful for solink users', function(done) {

      common.login('solink', function(token) {
        app.models.Reseller.find({}, function (err, res) {
          var reseller = res[0];
          common.json('post', '/api/customers', token)
          .send({
            id: 'yoohoo',
            name: customerName,
            resellerId: reseller.id
          })
          .expect(200)
          .end(function (err, res) {
            if (err) throw err;

            var customer = res.body;
            assert(typeof customer === 'object');
            assert(customer.name === customerName);

            done();
          });
        });
      });
    });

    it('should be successful for cloud users under their own resellers', function(done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        // create a customer under reseller 1
        common.json('post', '/api/customers', token)
        .send({
          id: 'testingtime',
          name: customerName,
          resellerId: resellerCloud1.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object');
          assert(customer.name === customerName);

          done();
        });
      });
    });

    it('should be successful for reseller users under themselves', function (done) {
      common.login({username: reseller1UserUsername, password: 'test'}, function (token) {
        common.json('post', '/api/customers', token)
        .send({
          id: 'testing',
          name: customerName,
          resellerId: resellerCloud1.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object');
          assert(customer.name === customerName);

          done();
        });
      });
    });

    it('should not be successful for cloud users under another the reseller of another cloud', function(done) {
      common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
        common.json('post', '/api/customers', token)
        .send({
          id: 'testing',
          name: customerName,
          resellerId: resellerCloud1.id
        })
        .expect(401)
        .end(function (err) {
          if (err) throw err;

          done();
        });
      });
    });

    it('should force the resellerId when a reseller tries to create a customer under a different reseller', function (done) {
      common.login({username: reseller1UserUsername, password: 'test'}, function (token) {
        common.json('post', '/api/customers', token)
        .send({
          id: 'testing',
          name: customerName,
          resellerId: resellerCloud2.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object', 'the response is a proper object');
          assert(customer.name === customerName, 'the created customer has the correct name');
          assert(customer.resellerId !== resellerCloud2.id, 'a reseller is not able to force a different reseller ID on a customer');
          assert(customer.resellerId === resellerCloud1.id, 'the correct reseller ID is set');

          done();
        });
      });
    });
  });

  describe('PUT permissions', function() {

    var testCustomer;

    before(function(done) {
      common.login('solink', function (token) {
        common.json('post', '/api/customers', token)
        .send({
          id: 'hello',
          name: customerName,
          resellerId: resellerCloud1.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err)
          {
            throw err;
          }

          testCustomer = res.body;
          done();
        });
      });
    });


    it('should always be successful for solink users', function (done) {
      var testName = 'new name';
      common.login('solink', function (token) {
        common.json('put', '/api/customers/' + testCustomer.id, token)
        .send({
          name: testName,
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object', 'the response is a proper object');
          assert(customer.name === testName, 'the new name was set');

          done();
        });
      });
    });

    it('should allow resellers to update, but not set to a different reseller', function (done) {
      var testName = 'brand new name';
      common.login({username: reseller1UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/customers/' + testCustomer.id, token)
        .send({
          name: testName,
          resellerId: resellerCloud2.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object', 'the response is a proper object');
          assert(customer.name === testName, 'the new name was set');
          assert(customer.resellerId !== resellerCloud2.id, 'the resellerId was not reset');

          done();
        });
      });
    });

    it('should allow cloud users to update the customers of their resellers, but not move between resellers', function (done) {
      var testName = 'cloud user test name';
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/customers/' + testCustomer.id, token)
        .send({
          name: testName,
          resellerId: resellerCloud2.id
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          var customer = res.body;
          assert(typeof customer === 'object', 'the response is a proper object');
          assert(customer.name === testName, 'the new name was set');
          assert(customer.resellerId !== resellerCloud2.id, 'the resellerId was not reset');

          done();
        });
      });
    });

    it('should disallow a cloud user from modifying a customer from another cloud', function (done) {
      var testName = 'cloud user test 2 name';
      common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/customers/' + testCustomer.id, token)
        .send({
          name: testName
        })
        .expect(404)
        .end(function (err) {
          if (err) throw err;

          done();
        });
      });
    });

  });
});