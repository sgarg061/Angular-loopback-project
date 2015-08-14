var assert = require('assert');
var common = require('./common');

const SOLINK_ADMIN_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_ADMIN_PASSWORD = 'test';
const SOLINK_USER_USERNAME = 'cwhiten+1@solinkcorp.com';
const SOLINK_USER_PASSWORD = 'test';



describe('REST', function() {

  this.timeout(10000);

  describe('Expected Usage', function() {

    // token to be used for all authenticated calls
    var authToken;

    describe('Login', function() {

        it('should login with a valid username/password combination and return a token', function(done) {
          common.json('post', '/api/auth/login')
            .send({
              username: SOLINK_ADMIN_USERNAME,
              password: SOLINK_ADMIN_PASSWORD
            })
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              var response = JSON.parse(res.body.response);
              assert(typeof response === 'object');
              assert(response.auth_token, 'must have an auth_token');

              authToken = response.auth_token;
              done();
            });
        });
      });

    describe('Invalid Login', function() {
      it('should not log in with an invalid username/password combination', function(done) {
        common.json('post', '/api/auth/login')
          .send({
            username: SOLINK_ADMIN_USERNAME,
            password: 'wrong password'
          })
          .expect(401)
          .end(function(err, res) {
            if (err) throw err;
            done();
          });
      });
    });


    describe('Validate Token', function() {

        var userToken;

        // log the user in order to get a token
        it('should login with a valid username/password combination and return a token', function(done) {
          common.json('post', '/api/auth/login')
            .send({
              username: SOLINK_USER_USERNAME,
              password: SOLINK_USER_PASSWORD
            })
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              var response = JSON.parse(res.body.response);

              assert(typeof response === 'object');
              assert(response.auth_token, 'must have an auth_token');

              userToken = response.auth_token;
              done();
            });
        });

        // now validate the user token. Note we are using the authToken to make the call
        it('should validate a valid token successfully', function(done) {
          common.json('post', '/api/auth/validate', authToken)
            .send({
              token: userToken
            })
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              assert(res.body.response === 'Valid token');
              done();
            });
        });

        it('should not validate with a non-solink token', function(done) {
          common.json('post', '/api/auth/validate', userToken)
            .send({
              token: userToken
            })
            .expect(401)
            .end(function(err, res) {
              if (err) throw err;
              done();
            });
        });

      });

    describe('Initial Device Activation', function() {

      var device;
      it('should activate license and return a new device', function(done) {
        common.json('post', '/api/licenses/activate', authToken)
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

      it('should checkin a new device', function(done) {
        
        deviceCheckinData.id = device.deviceId;

        common.json('post', '/api/devices/' + device.deviceId + '/checkin', authToken)
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

      it('device, cameras, POS devices and deviceLogEntry should have been created after initial checkin', function(done) {
        common.json('get', '/api/devices/' + device.deviceId + '?filter[include]=cameras&filter[include]=posDevices&filter[include]=logEntries', authToken)
          .send({})
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert(typeof res.body === 'object');
            assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
            assert.equal(res.body.posDevices.length, 1,'must have 1 POS device associated');
            assert.equal(res.body.logEntries.length, 1, 'must have 1 log entry');

            done();
          });
      });

      it('should checkin an existing device', function(done) {
        
        deviceCheckinData.id = device.deviceId;

        // set the back camera to an offline state
        // console.log('deviceCheckinData.cameraInformation: ' + deviceCheckinData.cameraInformation);
        deviceCheckinData.cameraInformation[1].status = 'offline';

        common.json('post', '/api/devices/' + device.deviceId + '/checkin', authToken)
          .send({data: deviceCheckinData})
          .expect(200)
          .end(function(err, res) {
             if (err) throw err;
            done();
          });
      });

      it('device, cameras and POS count should remain the same after subsequent checkin but new record values should be reflected', function(done) {
        common.json('get', '/api/devices/' + device.deviceId + '?filter[include]=cameras&filter[include]=posDevices', authToken)
          .send({})
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert(typeof res.body === 'object');
            assert.equal(res.body.cameras.length, 2, 'must have 2 cameras associated');
            assert.equal(res.body.posDevices.length, 1,'must have 1 POS device associated');
            assert.equal(res.body.cameras[1].status, 'offline', 'camera 2 status must be offline');

            done();
          });
      });
    });

  describe('List Devices', function() {
    var userToken;

    // log the user in order to get a token
    it('should login with a valid username/password combination and return a token', function(done) {
      common.json('post', '/api/auth/login')
        .send({
          username: SOLINK_USER_USERNAME,
          password: SOLINK_USER_PASSWORD
        })
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          var response = JSON.parse(res.body.response);

          assert(typeof response === 'object');
          assert(response.auth_token, 'must have an auth_token');

          userToken = response.auth_token;
          done();
        });
    });

    it('should allow device listing with an authenticated token', function(done) {
      common.json('get', '/api/devices', userToken)
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          assert(res.body.length > 0, 'must have returned at least one device');
          assert(typeof res.body[0] === 'object'); 
          done();
        });
    });

    it('should disallow device listing without a token', function(done) {
      common.json('get', '/api/devices')
        .send({})
        .expect(401)
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
    });
   
    });
});

});