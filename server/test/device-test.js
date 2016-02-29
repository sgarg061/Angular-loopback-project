var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');
var uuid = require('node-uuid');

describe('Device tests', function() {
  'use strict';
  this.timeout(5000);

  describe('Location filtering', function () {
    var device1Id = uuid.v1();
    var device2Id = uuid.v1();
    var device3Id = uuid.v1();

    var noDeviceMetadataUser;
    var noDeviceMetadataUserUsername = 'nodevicemetadatauser';
    var emptyDeviceMetadataUser;
    var emptyDeviceMetadataUserUsername = 'emptydevicemetadatauser';
    var twoDevicesMetadataUser;
    var twoDevicesMetadataUserUsername = 'twodevicesmetadatauser';

    before(function (done) {
      // create 3 devices
      app.models.Customer.find({}, function (err, res) {
        var cust = res[0];
        app.models.Device.create([
          {id: device1Id, name: 'Device 1', customerId: cust.id},
          {id: device2Id, name: 'Device 2', customerId: cust.id},
          {id: device3Id, name: 'Device 3', customerId: cust.id},
        ], function devicesCreated(err, res) {
          // now create the requisite users...
          authService.createUser(noDeviceMetadataUserUsername, 'test', {
            userType: 'admin',
            tenantId: cust.id
          }, function firstUserCreated (err, res) {
            noDeviceMetadataUser = res;
            authService.createUser(emptyDeviceMetadataUserUsername, 'test', {
              userType: 'admin',
              tenantId: cust.id,
              devices: []
            }, function secondUserCreated (err, res) {
              emptyDeviceMetadataUser = res;
              authService.createUser(twoDevicesMetadataUserUsername, 'test', {
                userType: 'admin',
                tenantId: cust.id,
                devices: [device1Id, device2Id]
              }, function thirdUserCreated (err, res) {
                twoDevicesMetadataUser = res;
                done();
              });
            });
          });
        });
      });
    });

    it('should only return devices defined in a a user\'s token', function (done) {
      common.login({username: twoDevicesMetadataUserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          var devices = res.body;
          assert(devices.length === 2);
          assert(devices.filter(function (d) {
            return d.id === device1Id || d.id === device2Id;
          }).length === 2);
          done();
        });
      });
    });

    it('should return all devices if the devices section of a user\'s token is empty', function (done) {
      common.login({username: emptyDeviceMetadataUserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          var devices = res.body;
          assert(devices.length >= 3); // at least 3 devices have been created for this user.
          // since this user is reused in other tests, can't assert for sure, but this is good enough.
          done();
        });
      });
    });

    it('should return all devices if the devices section of a user\'s token does not exist', function (done) {
      common.login({username: noDeviceMetadataUserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          var devices = res.body;
          assert(devices.length >= 3); // at least 3 devices have been created for this user.
          // since this user is reused in other tests, can't assert for sure, but this is good enough.
          done();
        });
      });
    });
  });

  describe('POST permissions', function() {
    it('should always be successful for solink users', function (done) {
      var deviceName = 'test device';

      common.login('solink', function (token) {
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

  describe('GET permissions', function() {

    var softwareVersionId;
    var cloud1;
    var cloud2;

    var reseller1Cloud1;
    var reseller2Cloud1;
    var reseller1Cloud2;

    var customer1;
    var customer2;
    var customer3;

    var device1;
    var device2;
    var device3;

    var cloud1User;
    var cloud1UserUsername = 'device-test-cloud1user';
    var cloud2User;
    var cloud2UserUsername = 'device-test-cloud2user';
    var reseller1Cloud1User;
    var reseller1Cloud1UserUsername = 'device-test-reseller1user';
    var reseller2Cloud1User;
    var reseller2Cloud1UserUsername = 'device-test-reseller2user';
    var reseller1Cloud2User;
    var reseller1Cloud2UserUsername = 'device-test-reseller3user';

    // set up devices and users for the permission tests
    before(function(done) {
      app.models.SoftwareVersion.find({}, function (err, res) {
        softwareVersionId = res[0].id;

        // create 2 clouds
        app.models.Cloud.create({
          name: 'cloud1',
          eventServerUrl: 'asfd',
          imageServerUrl: 'afds',
          signallingServerUrl: 'asdf',
          updateUrl: 'weaf',
          checkinInterval: 3600,
          softwareVersionId: softwareVersionId,
          email: 'hello@solink.com',
          password: 'test'
        }, function (err, res) {
          if (err) throw err;
          cloud1 = res;

          app.models.Cloud.create({
            name: 'cloud2',
            eventServerUrl: 'asfd',
            imageServerUrl: 'afds',
            signallingServerUrl: 'asdf',
            updateUrl: 'weaf',
            checkinInterval: 3600,
            softwareVersionId: softwareVersionId,
            email: 'hello2@solink.com',
            password: 'test'
          }, function (err, res) {
            if (err) throw err;
            cloud2 = res;

            // 2 resellers in cloud 1, 1 reseller in cloud 2
            app.models.Reseller.create({
              name: 'reseller1',
              cloudId: cloud1.id,
              email: 'hi@solinkcorp.com',
              password: 'hi'
            }, function (err, res) {
              if (err) throw err;
              reseller1Cloud1 = res;

              app.models.Reseller.create({
                name: 'reseller2',
                cloudId: cloud1.id,
                email: 'asdf@sadf.com',
                password: 'asdf'
              }, function (err, res) {
                if (err) throw err;
                reseller2Cloud1 = res;

                app.models.Reseller.create({
                  name: 'reseller3',
                  cloudId: cloud2.id,
                  email: 'asdf@asdf.com',
                  password: 'asfd',
                  test: 'asdf'
                }, function (err, res) {
                  if (err) throw err;
                  reseller1Cloud2 = res;

                  // 1 customer under each reseller
                  app.models.Customer.create({
                    name: 'customer1',
                    resellerId: reseller1Cloud1.id
                  }, function (err, res) {
                    if (err) throw err;
                    customer1 = res;

                    app.models.Customer.create({
                      name: 'customer2',
                      resellerId: reseller2Cloud1.id
                    }, function (err, res) {
                      if (err) throw err;
                      customer2 = res;

                      app.models.Customer.create({
                        name: 'customer3',
                        resellerId: reseller1Cloud2.id
                      }, function (err, res) {
                        if (err) throw err;
                        customer3 = res;

                        // 1 device under each customer
                        app.models.Device.create({
                          name: 'device1',
                          guid: 'device1',
                          customerId: customer1.id
                        }, function (err, res) {
                          if (err) throw err;
                          device1 = res;

                          app.models.Device.create({
                            name: 'device2',
                            guid: 'device2',
                            customerId: customer2.id
                          }, function (err, res) {
                            if (err) throw err;
                            device2 = res;

                            app.models.Device.create({
                              name: 'device3',
                              guid: 'device3',
                              customerId: customer3.id
                            }, function (err, res) {
                              if (err) throw err;
                              device3 = res;

                            // create users (add third reseller!)
                            authService.createUser(cloud1UserUsername, 'test', {
                                userType: 'cloud',
                                cloudId: cloud1.id
                              }, function cloud1Created (err, res) {
                                cloud1User = res;
                                authService.createUser(cloud2UserUsername, 'test', {
                                  userType: 'cloud',
                                  cloudId: cloud2.id
                                }, function cloud2Created (err, res) {
                                  cloud2User = res;
                                  authService.createUser(reseller1Cloud1UserUsername, 'test', {
                                    userType: 'reseller',
                                    resellerId: reseller1Cloud1.id
                                  }, function reseller1Created (err, res) {
                                    reseller1Cloud1User = res;
                                    authService.createUser(reseller2Cloud1UserUsername, 'test', {
                                      userType: 'reseller',
                                      resellerId: reseller2Cloud1.id
                                    }, function reseller2Created (err, res) {
                                      reseller2Cloud1User = res;
                                      authService.createUser(reseller1Cloud2UserUsername, 'test', {
                                        userType: 'reseller',
                                        resellerId: reseller1Cloud2.id
                                      }, function reseller3Created (err, res) {
                                        reseller1Cloud2User = res;

                                        done(); // DONE!
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
                  });
                });
              });
            });
          });
        });
      });
    });

    it('should allow solink users to see all devices', function (done) {
      common.login('solink', function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body[0] === 'object', 'ensure that the result is a set of objects');
          assert(res.body.length >= 3, 'ensure that all 3 devices (plus whatever other tests have added) are visible');

          done();
        });
      });
    });

    it('should allow cloud users to see all devices under them', function (done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body[0] === 'object', 'ensure that the result is a set of objects');
          assert(res.body.length === 2, 'ensure that the 2 devices under the first cloud are visible');

          var deviceNames = res.body.map(function (device) {
            return device.name;
          });

          assert(deviceNames.indexOf(device1.name) > -1, 'ensure that device 1 is in the response');
          assert(deviceNames.indexOf(device2.name) > -1, 'ensure that device 2 is in the response');

          // query as the other cloud now
          common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
            common.json('get', '/api/devices', token)
            .send({})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(typeof res.body[0] === 'object', 'this is a proper object, too');
              assert(res.body.length === 1, 'ensure that only 1 device was returned');

              var deviceName = res.body[0].name;
              assert(deviceName === device3.name, 'ensure that device 3 was returned');
              done();
            });
          });
        });
      });
    });

    it('should allow reseller users to see all devices for their customers', function (done) {
      common.login({username: reseller1Cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/devices', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body[0] === 'object', 'ensure that the result is an object');
          assert(res.body.length === 1, 'only 1 device for each reseller in this test');

          var deviceName = res.body[0].name;
          assert(deviceName === device1.name, 'reseller 1 should see only device 1');

          common.login({username: reseller2Cloud1UserUsername, password: 'test'}, function (token) {
            common.json('get', '/api/devices', token)
            .send({})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(typeof res.body[0] === 'object', 'ensure that the result is an object');
              assert(res.body.length === 1, 'only 1 device for each reseller');

              deviceName = res.body[0].name;
              assert(deviceName === device2.name, 'reseller 2 should only see device 2');

              common.login({username: reseller1Cloud2UserUsername, password: 'test'}, function (token) {
                common.json('get', '/api/devices', token)
                .send('get', '/api/devices', token)
                .send({})
                .expect(200)
                .end(function (err, res) {
                  if (err) throw err;

                  assert(typeof res.body[0] === 'object', 'ensure that the result is an object');
                  assert(res.body.length === 1, 'only 1 device for each reseller');

                  deviceName = res.body[0].name;
                  assert(deviceName === device3.name, 'reseller 3 should only see device 3');

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