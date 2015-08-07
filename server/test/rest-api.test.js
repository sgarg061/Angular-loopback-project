var request = require('supertest');
var app = require('../server');
var assert = require('assert');
var authService = require('../services/authService');
var authAccessor = require('../dependencyAccessors/fakeAuth0Accessor');


var sampleData = require('../create-sample-data');

const SOLINK_ADMIN_USERNAME = 'cwhiten@solinkcorp.com';
const SOLINK_ADMIN_PASSWORD = 'test';
const SOLINK_USER_USERNAME = 'cwhiten+1@solinkcorp.com';
const SOLINK_USER_PASSWORD = 'test';

before(function(done) {
  sampleData(app, function() {
    authService.initialize(new authAccessor());
    done();
  });
});

function json(verb, url, token) {
    var jsonRequest = request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    if (token) {
      jsonRequest.set('Authorization', 'Bearer ' + token);
    }
    return jsonRequest;
}

describe('REST', function() {

  this.timeout(10000);

  describe('Expected Usage', function() {

    // token to be used for all authenticated calls
    var authToken;

    describe('Login', function() {

        it('should login with a valid username/password combination and return a token', function(done) {
          json('post', '/api/auth/login')
            .send({
              username: SOLINK_ADMIN_USERNAME,
              password: SOLINK_ADMIN_PASSWORD
            })
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;
              var response = JSON.parse(res.body.response);
              console.log('response: ');
              console.log(response);
              assert(typeof response === 'object');
              assert(response.auth_token, 'must have an auth_token');

              authToken = response.auth_token;
              done();
            });
        });
      });

    describe('Invalid Login', function() {
      it('should not log in with an invalid username/password combination', function(done) {
        json('post', '/api/auth/login')
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
          json('post', '/api/auth/login')
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
          json('post', '/api/auth/validate', authToken)
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
          json('post', '/api/auth/validate', userToken)
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
        json('post', '/api/licenses/activate', authToken)
          .send({key: 'MAGN-ETSH-OWDO-THEY-WORK'})
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            device = JSON.parse(res.body);
            assert(device.deviceId, 'must have a deviceId');
            
            done();
          });
      });

      it('should checkin a new device', function(done) {
        json('post', '/api/devices/' + device.deviceId + '/checkin', authToken)
          .send({data: {
                  id: device.deviceId,
                  guid: '7DB02DCF-4EA9-4177-A256-42BCFD511E90',
                  locationName: 'Tim Hortons',
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
                        id: '48601818-FA21-4E20-984A-A15B08DC5179',
                        type: 'pos_type_x',
                        connector: 'connector_name_x',
                        name: 'POS #1',
                        status: 'online'
                      }
                  ],
                  cameraInformation: [
                      {
                        id: 'F206872A-5AF6-4B9B-9649-370D4D704043',
                        type: 'camera_type_y',
                        name: 'Front Camera',
                        status: 'online'
                      },
                      {
                        id: 'A8AA03AA-8A3E-4DBE-8E19-234EA0DD2905',
                        type: 'camera_type_z',
                        name: 'Back Camera',
                        status: 'offline'
                      }
                  ]
                }
          })
          .expect(200)
          .end(function(err, res) {
            if (err) throw err;
            assert(typeof res.body === 'object');
            console.log('res: ' + res);
            // assert(res.body.id, 'must have an id');

            done();
          });
      });
    });

  describe('List Devices', function() {
    var userToken;

    // log the user in order to get a token
    it('should login with a valid username/password combination and return a token', function(done) {
      json('post', '/api/auth/login')
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
      json('get', '/api/devices', userToken)
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
      json('get', '/api/devices')
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