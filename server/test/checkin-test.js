var assert = require('assert');
var common = require('./common');

var deviceGuid = '7DB02DCF-4EA9-4177-A256-42BCFD511E90';
var deviceCheckinData = {
    guid: deviceGuid,
    organizationPath: '/Canada/Ontario/Ottawa/TH-1582',
    address: '479 March Road, Kanata, ON, K2K',
    location: {
        longitude: -75.9087814,
        latitude: 45.3376177
    },
    deviceInformation: {
        name: 'NAS #1',
        osVersion: '4.1',
        softwareVersion: '1.0',
        model: 'TS-221',
        modelName: 'QNAP TS-221 2-bay Personal Cloud NAS',
        deviceCapacity: '975922976',
        availableCapacity: '138579052'
    },
    posInformation: [
        {
          posId: '48601818-FA21-4E20-984A-A15B08DC5179',
          type: 'pos_type_x',
          connector: 'connector_name_x',
          name: 'POS #1',
          status: 'online'
        }
    ],
    cameraInformation: [
        {
          cameraId: 'F206872A-5AF6-4B9B-9649-370D4D704043',
          type: 'camera_type_y',
          name: 'Front Camera',
          status: 'online'
        },
        {
          cameraId: 'A8AA03AA-8A3E-4DBE-8E19-234EA0DD2905',
          type: 'camera_type_z',
          name: 'Back Camera',
          status: 'online'
        }
    ]
};

var device;

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
        device = JSON.parse(res.body);
        assert(device.deviceId, 'must have a deviceId');
        
        done();
      });
  });

  var checkin;

  it('should checkin a new device and receive configuration information', function(done) {
    
    deviceCheckinData.id = device.deviceId;

    common.login('solink', function (token) {
      common.json('post', '/api/devices/' + device.deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;

          assert(res.body.eventServerUrl, 'must have an eventServerUrl');
          assert(res.body.imageServerUrl, 'must have a imageServerUrl');
          assert(res.body.signallingServerUrl, 'must have a signallingServerUrl');
          assert(res.body.updateUrl, 'must have a updateUrl');
          assert(res.body.checkinInterval, 'must have a checkinInterval');

          done();
        });
      });
  });

  it('should update device and create cameras, POS devices and deviceLogEntry', function(done) {
    common.login('user', function (token) {
      common.json('get', '/api/devices/' + device.deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object');

          assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
          assert.equal(res.body.posDevices.length, 1,'must have 1 POS device associated');
          assert.equal(res.body.logEntries.length, 1, 'must have 1 log entry');
          assert(res.body.lastCheckin, 'must have a lastCheckin');

          checkin = res.body.lastCheckin;

          done();
        });
      });
  });

describe('Checkin of existing device', function() {

  it('should allow updated checkin data to be posted', function(done) {
    
    deviceCheckinData.id = device.deviceId;

    // set the back camera to an offline state
    deviceCheckinData.cameraInformation[1].status = 'offline';

    common.login('user', function (token) {
      common.json('post', '/api/devices/' + device.deviceId + '/checkin', token)
        .send({data: deviceCheckinData})
        .expect(200)
        .end(function(err, res) {
           if (err) throw err;
          done();
        });
      });
  });

  it('should result in new values, an updated checkin time and another log entry', function(done) {
    common.login('user', function (token) {
      common.json('get', '/api/devices/' + device.deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', token)
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object');
          assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
          assert.equal(res.body.posDevices.length, 1,'must have 1 POS device associated');
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

describe('Modification of inherited values at various locations in the object tree should be reflected in the cofiguration data returned upon checkin', function() {

  it('should return attributes from device when device has overriden value', function(done) {
    
    common.login('user', function (token) {
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


