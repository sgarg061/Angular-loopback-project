var assert = require('assert');
var common = require('./common');
var app    = require('../server');

var deviceGuid = '7DB02DCF-4EA9-4177-A256-42BCFD511E90';
var deviceCheckinData = {
    guid: deviceGuid,
    address: '479 March Road, Kanata, ON, K2K',
    appVersion: '4.0.9',
    location: {
        lng: -75.9087814,
        lat: 45.3376177
    },
    deviceInformation: {
        name: 'NAS #1',
        osVersion: '4.1',
        softwareVersion: '1.0',
        model: 'TS-221',
        firmware: '4.2.0',
        modelName: 'QNAP TS-221 2-bay Personal Cloud NAS',
        localIP: '10.126.140.204',
        size: 1926755254272,
        used: 461314719744,
        deviceCapacity: 1926755254272,
        availableCapacity: 1465440534528,
    },
    posInformation: [
        {
          posId: '48601818-FA21-4E20-984A-A15B08DC5179',
          type: 'pos_type_x',
          connector: 'connector_name_x',
          name: 'POS #1',
          status: 'online'
        },
        {
          posId: 'A5294C38-4C10-7732-31DE-394758AC2343',
          type: 'pos_type_y',
          connector: 'connector_name_y',
          name: 'POS #2',
          status: 'online'
        }
    ],
    cameraInformation: [
        {
          cameraId: 'F206872A-5AF6-4B9B-9649-370D4D704043',
          type: 'camera_type_y',
          name: 'Front Camera',
          status: 'online',
          streams: [
            {
              'id': 'stream1',
              'name': 'stream1 name',
              'earliestSegmentDate': 1450211609000,
              'latestSegmentDate': 1550211609000
            },
            {
              'id': 'stream2',
              'name': 'stream2 name'
            }
          ]
        },
        {
          cameraId: 'A8AA03AA-8A3E-4DBE-8E19-234EA0DD2905',
          type: 'camera_type_z',
          name: 'Back Camera',
          status: 'online'
        }
    ]
};

var deviceId;
var checkin;

describe('Checkin after initial device activation', function() {
  it('should activate license and return a new device', function(done) {
    common.json('post', '/api/licenses/activate')
      .send({key: 'ETSHOWDOTHEYWORK'})
      .expect(200)
      .end(function(err, res) {
        if (err) {
          console.log('error! ' + err);
          throw err;
        }
        var activationResponse = res.body;
        deviceId = activationResponse.deviceId;
        assert(deviceId, 'must have a deviceId');
        assert(activationResponse.refreshToken, 'must return a refresh token');
        assert(activationResponse.authToken, 'must return an auth token');
        done();
      });
  });

  it('should checkin a new device and receive configuration information', function(done) {

    deviceCheckinData.id = deviceId;
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;

          assert(res.body.eventServerUrl, 'must have an eventServerUrl');
          assert(res.body.imageServerUrl, 'must have a imageServerUrl');
          assert(res.body.signallingServerUrl, 'must have a signallingServerUrl');
          assert(res.body.updateUrl, 'must have a updateUrl');
          assert(res.body.checkinInterval, 'must have a checkinInterval');
          assert(!res.body.ports, 'must not have any value for ports yet');
          done();
        });
      });
  });

  it('should update device and create cameras, POS devices and deviceLogEntry', function(done) {
    common.login('solink', function (token) {
      common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object');

          assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
          assert.equal(res.body.posDevices.length, 2,'must have 2 POS device associated');
          assert.equal(res.body.logEntries.length, 1, 'must have 1 log entry');
          assert(res.body.lastCheckin, 'must have a lastCheckin');

          checkin = res.body.lastCheckin;

          done();
        });
      });
  });

  it('should result in log entry with all the information', function (done) {
    common.login('solink', function (token) {
      common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object');
          assert.equal(res.body.logEntries.length, 1, 'must have 1 log entry');
          var logEntry = res.body.logEntries[0];

          var getGB = function convertBytesToGB(n) {
                return parseFloat((parseInt(n) / (1024 * 1024 * 1024)).toFixed(2));
          };

          assert(!logEntry.hasOwnProperty('checkinData'));
          assert.equal(logEntry.deviceId, deviceId);
          assert(logEntry.hasOwnProperty('timestamp'));
          assert(logEntry.hasOwnProperty('id'));
          assert.equal(logEntry.guid, deviceCheckinData.guid);
          assert.equal(logEntry.organizationPath, '');
          assert.equal(logEntry.address, deviceCheckinData.address);
          assert.deepEqual(logEntry.location, deviceCheckinData.location);
          assert.deepEqual(logEntry.deviceInformation, deviceCheckinData.deviceInformation);
          assert.deepEqual(logEntry.posInformation, deviceCheckinData.posInformation);
          assert.deepEqual(logEntry.cameraInformation, deviceCheckinData.cameraInformation);
          assert.deepEqual(logEntry.appVersion, deviceCheckinData.appVersion);
          assert.deepEqual(logEntry.deviceModel, deviceCheckinData.deviceInformation.model);
          assert.deepEqual(logEntry.deviceFirmware, deviceCheckinData.deviceInformation.firmware);
          assert.deepEqual(logEntry.diskSize, getGB(deviceCheckinData.deviceInformation.size));
          assert.deepEqual(logEntry.diskSpaceFree, getGB(deviceCheckinData.deviceInformation.availableCapacity));
          assert.deepEqual(logEntry.diskSpaceUsed, getGB(deviceCheckinData.deviceInformation.used));
          done();
        });
      });
  });

  describe('Checkin of existing device', function() {

    it('should allow updated checkin data to be posted', function(done) {

      deviceCheckinData.id = deviceId;

      // set the back camera to an offline state
      deviceCheckinData.cameraInformation[1].status = 'offline';

      common.login('solink', function (token) {
        common.json('post', '/api/devices/' + deviceId + '/checkin', token)
          .send({data: deviceCheckinData})
          .expect(200)
          .end(function(err, res) {
             if (err) throw err;
             app.models.DeviceLogEntry.find({}, function (err, res) {
              var logEntry = res[0];
              assert(logEntry.checkinTime instanceof Date);
              done();
            });
          });
        });
    });

    it('should result in new values, an updated checkin time and another log entry', function(done) {
      common.login('solink', function (token) {
        common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
          .send({})
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert(typeof res.body === 'object');
            assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
            assert.equal(res.body.posDevices.length, 2,'must have 2 POS device associated');
            assert.equal(res.body.cameras[1].status, 'offline', 'camera 2 status must be offline');

            assert.equal(res.body.logEntries.length, 2, 'must have 2 log entries');

            var latestCheckin = res.body.lastCheckin;
            assert(latestCheckin > checkin, 'latest checkin must be later than previous checkin');

            done();
          });
      });
    });
  });
});

describe('Check-in of existing device with missing component', function() {
  it('should not keep the camera missing from the check-in', function(done) {
    // remove the back camera
    deviceCheckinData.cameraInformation = deviceCheckinData.cameraInformation.slice(0,1);
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.cameras.length, 1, 'must have 1 cameras associated');
               assert.equal(res.body.logEntries.length, 3, 'must have 3 log entries');
               assert(res.body.lastCheckin > checkin, 'latest checkin must be later than previous checkin');
               done();
             });
        });
    });
  });

  it('should not keep the POS missing from the check-in', function(done) {
    // remove the 2nd POS
    deviceCheckinData.posInformation = deviceCheckinData.posInformation.slice(0,1);
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.posDevices.length, 1,'must have 1 POS device associated');
               assert.equal(res.body.logEntries.length, 4, 'must have 4 log entries');
               assert(res.body.lastCheckin > checkin, 'latest checkin must be later than previous checkin');
               done();
             });
        });
    });
  });
});

describe('Override settings', function() {
  it('should set the IP address to the override IP address', function(done) {
    common.login('solink', function (token) {
      common.json('put', '/api/devices/' + deviceId, token)
        .send({overrideIpAddress: 'overriden'})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;

          // now, check in...
          common.json('post', '/api/devices/' + deviceId + '/checkin', token)
            .send({data: deviceCheckinData})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              // now query for the device, and see the ip address is 'overriden'
              common.json('get', '/api/devices/' + deviceId, token)
                .send({})
                .expect(200)
                .end(function (err, res) {
                  if (err) throw err;

                  assert(typeof res.body === 'object');
                  assert.equal(res.body.ipAddress, 'overriden', 'the ip address returned must be set to overriden');
                  done();
                });
            });
        });
    });
  });

  it('should pass down only the vms port in the checkin message', function (done) {
    common.login('solink', function (token) {
      common.json('put', '/api/devices/' + deviceId, token)
        .send({vmsPort: 1234})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          // now check in
          common.json('post', '/api/devices/' + deviceId + '/checkin', token)
            .send({data: deviceCheckinData})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(typeof res.body === 'object');

              var ports = res.body.ports;
              assert.equal(Object.keys(ports).length, 1);
              assert.equal(ports.vms, 1234);
              done();
            });
        });
    });
  });

  it('should pass down all other ports in the checkin message', function (done) {
    var newPorts = {
      vmsPort: 1,
      connectPort: 2,
      uploaderPort: 3,
      listenerPort: 4,
      checkinPort: 5,
      configForwardPort: 6
    };

    common.login('solink', function (token) {
      common.json('put', '/api/devices/' + deviceId, token)
        .send(newPorts)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          common.json('post', '/api/devices/' + deviceId + '/checkin', token)
          .send({data: deviceCheckinData})
          .expect(200)
          .end(function (err, res) {
            assert(typeof res.body === 'object');

            var ports = res.body.ports;
            assert.equal(Object.keys(ports).length, Object.keys(newPorts).length);
            assert.equal(ports.vms, newPorts.vmsPort);
            assert.equal(ports.connect, newPorts.connectPort);
            assert.equal(ports.uploader, newPorts.uploaderPort);
            assert.equal(ports.listener, newPorts.listenerPort);
            assert.equal(ports.checkin, newPorts.checkinPort);
            assert.equal(ports.configForward, newPorts.configForwardPort);
            done();
          });
        });
    });
  });
});

describe('Checkin address format', function () {
  it('should accept string address', function (done) {
    deviceCheckinData.address = 'string address';
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId, token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.address, 'string address');
               done();
             });
        });
    });
  });

  it('should accept json address', function (done) {
    deviceCheckinData.address = {'formatted_address': 'formatted address'};
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId, token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.address, 'formatted address');
               done();
             });
        });
    });
  });

  it('should have unknown address when address property is missing', function (done) {
    delete deviceCheckinData.address;
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId, token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.address, 'Unknown address');
               done();
             });
        });
    });
  });

  it('should have unknown address when formatted address property is missing', function (done) {
    deviceCheckinData.address = {};
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId, token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert.equal(res.body.address, 'Unknown address');
               done();
             });
        });
    });
  });
});

describe('Stream date range format', function () {
  it('should not have values when date is missing', function (done) {
    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;

           common.json('get', '/api/devices/' + deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
             .send({})
             .expect(200)
             .end(function(err, res) {
               if (err) throw err;
               assert(typeof res.body === 'object');
               assert(!res.body.cameras[0].streams[1].hasOwnProperty('earliestSegmentDate'));
               assert(!res.body.cameras[0].streams[1].hasOwnProperty('latestSegmentDate'));
               done();
             });
        });
    });
  });
});

describe('Modification of inherited values at various locations in the object tree should be reflected in the cofiguration data returned upon checkin', function() {

  it('should return attributes from device when device has overriden value', function(done) {

    common.login('solink', function (token) {
      common.json('get', '/api/SoftwareVersions/', token).send().end(function (err, res) {
        var versions = res.body;
        console.log('software versions: ' + JSON.stringify(versions));

        common.json('get', '/api/devices?filter[where][guid]='+deviceGuid, token).send().end(function (err, res) {
          var device = res.body[0];
          deviceCheckinData.id = device.id;

          common.json('get', '/api/customers/?filter[where][id]=' + device.customerId + '&filter[include]=reseller', token).send().end(function (err, res) {
            var customer = res.body[0];
            var reseller = customer.reseller;

            common.json('get', '/api/clouds/?filter[where][id]=' + reseller.cloudId, token).send().end(function (err, res) {
              var cloud = res.body[0];

              /*****************/

              common.json('put', '/api/clouds/' + cloud.id, token).send(
                {softwareVersionId: versions[7].id, checkinInterval:7000, eventServerUrl:'7000', imageServerUrl:'7000'}).end(function (err, res) {
                common.json('post', '/api/devices/' + device.id + '/checkin', token).send({data: deviceCheckinData}).end(function (err, res) {

                  assert.equal(res.body.eventServerUrl, '7000', 'eventServerUrl must be inherited from cloud');
                  assert.equal(res.body.imageServerUrl, '7000', 'imageServerUrl must be inherited from cloud');
                  assert.equal(res.body.updateUrl, versions[7].url, 'updateUrl must be inherited from cloud');
                  assert.equal(res.body.checkinInterval, 7000, 'checkinInterval must be inherited from cloud');

                  common.json('put', '/api/resellers/' + reseller.id, token).send(
                    {softwareVersionId: versions[6].id, checkinInterval:6000, eventServerUrl:'6000', imageServerUrl:'6000'}).end(function (err, res) {
                    common.json('post', '/api/devices/' + device.id + '/checkin', token).send({data: deviceCheckinData}).end(function (err, res) {

                      assert.equal(res.body.eventServerUrl, '6000', 'eventServerUrl must be inherited from reseller');
                      assert.equal(res.body.imageServerUrl, '6000', 'imageServerUrl must be inherited from reseller');
                      assert.equal(res.body.updateUrl, versions[6].url, 'updateUrl must be inherited from reseller');
                      assert.equal(res.body.checkinInterval, 6000, 'checkinInterval must be inherited from reseller');

                      common.json('put', '/api/customers/' + customer.id, token).send(
                        {softwareVersionId: versions[5].id, checkinInterval:5000, eventServerUrl:'5000', imageServerUrl:'5000'}).end(function (err, res) {
                        common.json('post', '/api/devices/' + device.id + '/checkin', token).send({data: deviceCheckinData}).end(function (err, res) {

                          assert.equal(res.body.eventServerUrl, '6000', 'eventServerUrl must be inherited from reseller');
                          assert.equal(res.body.imageServerUrl, '6000', 'imageServerUrl must be inherited from reseller');
                          assert.equal(res.body.updateUrl, versions[5].url, 'updateUrl must be inherited from customer');
                          assert.equal(res.body.checkinInterval, 5000, 'checkinInterval must be inherited from customer');

                          common.json('put', '/api/devices/' + device.id, token).send(
                            {softwareVersionId: versions[4].id, checkinInterval:4000, eventServerUrl:'4000', imageServerUrl:'4000'}).end(function (err, res) {
                            common.json('post', '/api/devices/' + device.id + '/checkin', token).send({data: deviceCheckinData}).end(function (err, res) {

                              assert.equal(res.body.eventServerUrl, '6000', 'eventServerUrl must be inherited from reseller');
                              assert.equal(res.body.imageServerUrl, '6000', 'imageServerUrl must be inherited from reseller');
                              assert.equal(res.body.updateUrl, versions[4].url, 'updateUrl must be set to device softwareVersionId.url');
                              assert.equal(res.body.checkinInterval, 4000, 'checkinInterval must be set to device checkinInterval');

                              done();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
              /*****************/

            });
          });
        });
      });
    });

  });

});



