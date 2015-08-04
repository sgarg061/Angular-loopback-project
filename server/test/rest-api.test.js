var request = require('supertest');
var app = require('../server');
var assert = require('assert');


var sampleData = require('../create-sample-data');

before(function(done) {
  sampleData(app, function() {
    console.log('done');
    done();
  });
});

function json(verb, url) {
  return request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);
}

describe('REST', function() {


  describe('Expected Usage', function() {

    var deviceId;

    describe('POST /api/devices', function() {

        it('should create a new device', function(done) {
          json('post', '/api/devices')
            .send({
              id: '1234',
              name: 'Device ABC',
              locationId: '4567'
            })
            .expect(200)
            .end(function(err, res) {
              assert(typeof res.body === 'object');
              assert(res.body.id, 'must have an id');
              deviceId = res.body.id;
              done();
            });
        });
      });

    describe('GET /api/devices', function() {
        it('should return a list of all devices', function(done) {
          json('get', '/api/devices')
            .expect(200)
            .end(function(err, res) {
              console.log('res: ' + JSON.stringify(res));
              assert(Array.isArray(res.body));
              assert(res.body.length);

              done();
            });
        });
      });


  });
});