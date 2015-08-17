var assert = require('assert');
var common = require('./common');


var deviceCheckinData = {
    guid: '7DB02DCF-4EA9-4177-A256-42BCFD511E90',
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

describe('Checkin after initial device activation', function() {

  var device;
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

    common.login('user', function (token) {
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
