'use strict';

var assert = require('assert');
var common = require('./common');

describe('License tests', function() {
  this.timeout(5000);

  describe('Device activation fails with invalid license', function() {
    it('should return an error', function(done) {
      common.json('post', '/api/licenses/activate')
        .send({key: 'ABCDABCDABC'})
        .expect(400)
        .end(function(err) {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });

  describe('Device activation succeeds with valid license', function() {
    it('should activate license with full Google Maps object and return a new device', function (done) {
      var locationName = '19 Daybreak St';
      var country = 'Canada';
      var province = 'Ontario';
      var city = 'Ottawa';
      var location = {
        lat: 45.282406,
        lng: -75.7063302999999
      };
      var username = 'hello';
      var password = 'world';
      var address = '19 Daybreak St, Nepean, ON K2G 6R7, Canada';

      common.login('solink', function(token) {

        common.json('get', '/api/devices/count', token)
          .send({})
          .expect(200)
          .end(function (err, res) {
            if (err) {
              console.log('error count devices: ' + err);
              throw err;
            }
            var countBeforeLicenseCreation = res.body.count;

            common.json('post', '/api/licenses/activate')
              .send(
                {
                  key: 'ABCDABCDABCD',
                  location: location,
                  username: username,
                  password: password,
                  address: {
                    'address_components':[
                        {
                            'long_name':'19',
                            'short_name':'19',
                            'types':[
                                'street_number'
                            ]
                        },
                        {
                            'long_name':'Daybreak Street',
                            'short_name':'Daybreak St',
                            'types':[
                                'route'
                            ]
                        },
                        {
                            'long_name':'Chapman Mills - Rideau Crest - Davidson Heights',
                            'short_name':'Chapman Mills - Rideau Crest - Davidson Heights',
                            'types':[
                                'neighborhood',
                                'political'
                            ]
                        },
                        {
                            'long_name':'Nepean',
                            'short_name':'Nepean',
                            'types':[
                                'sublocality_level_1',
                                'sublocality',
                                'political'
                            ]
                        },
                        {
                            'long_name': city,
                            'short_name':'Ottawa',
                            'types':[
                                'locality',
                                'political'
                            ]
                        },
                        {
                            'long_name':'Ottawa Division',
                            'short_name':'Ottawa Division',
                            'types':[
                                'administrative_area_level_2',
                                'political'
                            ]
                        },
                        {
                            'long_name': province,
                            'short_name':'ON',
                            'types':[
                                'administrative_area_level_1',
                                'political'
                            ]
                        },
                        {
                            'long_name': country,
                            'short_name':'CA',
                            'types':[
                                'country',
                                'political'
                            ]
                        },
                        {
                            'long_name':'K2G 6R7',
                            'short_name':'K2G 6R7',
                            'types':[
                                'postal_code'
                            ]
                        }
                    ],
                    'adr_address':'<span class=\'street-address\'>19 Daybreak St</span>, <span class=\'locality\'>Nepean</span>, <span class=\'region\'>ON</span> <span class=\'postal-code\'>K2G 6R7</span>, <span class=\'country-name\'>Canada</span>',
                    'formatted_address': address,
                    'geometry':{
                        'location':{

                        }
                    },
                    'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
                    'id':'cc3e8780708eadc8702fb6da7aacea6aa33d383a',
                    'name': locationName,
                    'place_id':'ChIJW648AM_izUwRo14Y3TWhWI4',
                    'reference':'CpQBiAAAAJvMIdipKbE_C41SqNaT9W5bC27Zz2ERbkv7F-bQz37m7VD5yKcezWq4IOkF81gR-Z_9N9LmviAHr0xUASYNrqGyBogpLn6-EelbO7MetmLw0gGHeV1kW3sObnDjnY_o4FsQhJeayZjjymczps-hbRZb7SRPG6RY4J7VMGRYH3g0V_maCRpHkwl_bxxFPhy9DhIQdhhgSfj3nK8bp7H5AJ-nMBoUUdydy88rRWCrk1FCw3h5E8LzcFA',
                    'scope':'GOOGLE',
                    'types':[
                        'street_address'
                    ],
                    'url':'https://maps.google.com/?q=19+Daybreak+St,+Nepean,+ON+K2G+6R7,+Canada&ftid=0x4ccde2cf003cae5b:0x8e58a135dd185ea3',
                    'vicinity':'Nepean',
                    'html_attributions':[]
                  }
                }
              )
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  console.log('error! ' + err);
                  throw err;
                }
                var response = res.body;
                assert(response.deviceId, 'must have a deviceId');
                assert(response.authToken, 'must return a jwt token');
                assert(response.refreshToken, 'must return a refresh token');

                // ensure that the number of devices has grown
                common.json('get', '/api/devices/count', token)
                  .send({})
                  .expect(200)
                  .end(function (err, res) {
                    if (err) throw err;

                    var countAfterLicenseCreation = res.body.count;
                    assert(countBeforeLicenseCreation === countAfterLicenseCreation - 1, 'one new device has been created');

                    common.json('get', '/api/devices/' + response.deviceId, token)
                      .send({})
                      .expect(200)
                      .end(function (err, res) {
                        response = res.body;

                        assert(response.name === locationName, 'Location name must be recorded');
                        assert(response.username === username, 'Username must be recorded');
                        assert(response.password === password, 'Password must be recorded');
                        assert(response.location.lat === location.lat, 'Lat/lng must be recorded');
                        assert(response.location.lng === location.lng, 'Lat/lng must be recorded');
                        assert(response.organizationPath === country + '/' + province + '/' + city, 'Org path must be recorded');
                        assert(response.address === address, 'Address must be recorded');
                        done();
                      });
                  });
              });
          });
        });
    });

    it('should activate license with full Google Maps object but no location and return a new device', function (done) {
      var locationName = '19 Daybreak St';
      var country = 'Canada';
      var province = 'Ontario';
      var city = 'Ottawa';
      var username = 'hello';
      var password = 'world';
      var address = '19 Daybreak St, Nepean, ON K2G 6R7, Canada';

      common.login('solink', function(token) {

        common.json('get', '/api/devices/count', token)
          .send({})
          .expect(200)
          .end(function (err, res) {
            if (err) {
              console.log('error count devices: ' + err);
              throw err;
            }
            var countBeforeLicenseCreation = res.body.count;

            common.json('post', '/api/licenses/activate')
              .send(
                {
                  key: 'ABCDABCDABCE',
                  username: username,
                  password: password,
                  address: {
                    'address_components':[
                        {
                            'long_name':'19',
                            'short_name':'19',
                            'types':[
                                'street_number'
                            ]
                        },
                        {
                            'long_name':'Daybreak Street',
                            'short_name':'Daybreak St',
                            'types':[
                                'route'
                            ]
                        },
                        {
                            'long_name':'Chapman Mills - Rideau Crest - Davidson Heights',
                            'short_name':'Chapman Mills - Rideau Crest - Davidson Heights',
                            'types':[
                                'neighborhood',
                                'political'
                            ]
                        },
                        {
                            'long_name':'Nepean',
                            'short_name':'Nepean',
                            'types':[
                                'sublocality_level_1',
                                'sublocality',
                                'political'
                            ]
                        },
                        {
                            'long_name': city,
                            'short_name':'Ottawa',
                            'types':[
                                'locality',
                                'political'
                            ]
                        },
                        {
                            'long_name':'Ottawa Division',
                            'short_name':'Ottawa Division',
                            'types':[
                                'administrative_area_level_2',
                                'political'
                            ]
                        },
                        {
                            'long_name': province,
                            'short_name':'ON',
                            'types':[
                                'administrative_area_level_1',
                                'political'
                            ]
                        },
                        {
                            'long_name': country,
                            'short_name':'CA',
                            'types':[
                                'country',
                                'political'
                            ]
                        },
                        {
                            'long_name':'K2G 6R7',
                            'short_name':'K2G 6R7',
                            'types':[
                                'postal_code'
                            ]
                        }
                    ],
                    'adr_address':'<span class=\'street-address\'>19 Daybreak St</span>, <span class=\'locality\'>Nepean</span>, <span class=\'region\'>ON</span> <span class=\'postal-code\'>K2G 6R7</span>, <span class=\'country-name\'>Canada</span>',
                    'formatted_address': address,
                    'geometry':{
                        'location':{

                        }
                    },
                    'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
                    'id':'cc3e8780708eadc8702fb6da7aacea6aa33d383a',
                    'name': locationName,
                    'place_id':'ChIJW648AM_izUwRo14Y3TWhWI4',
                    'reference':'CpQBiAAAAJvMIdipKbE_C41SqNaT9W5bC27Zz2ERbkv7F-bQz37m7VD5yKcezWq4IOkF81gR-Z_9N9LmviAHr0xUASYNrqGyBogpLn6-EelbO7MetmLw0gGHeV1kW3sObnDjnY_o4FsQhJeayZjjymczps-hbRZb7SRPG6RY4J7VMGRYH3g0V_maCRpHkwl_bxxFPhy9DhIQdhhgSfj3nK8bp7H5AJ-nMBoUUdydy88rRWCrk1FCw3h5E8LzcFA',
                    'scope':'GOOGLE',
                    'types':[
                        'street_address'
                    ],
                    'url':'https://maps.google.com/?q=19+Daybreak+St,+Nepean,+ON+K2G+6R7,+Canada&ftid=0x4ccde2cf003cae5b:0x8e58a135dd185ea3',
                    'vicinity':'Nepean',
                    'html_attributions':[]
                  }
                }
              )
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  console.log('error! ' + err);
                  throw err;
                }
                var response = res.body;
                assert(response.deviceId, 'must have a deviceId');
                assert(response.authToken, 'must return a jwt token');
                assert(response.refreshToken, 'must return a refresh token');

                // ensure that the number of devices has grown
                common.json('get', '/api/devices/count', token)
                  .send({})
                  .expect(200)
                  .end(function (err, res) {
                    if (err) throw err;

                    var countAfterLicenseCreation = res.body.count;
                    assert(countBeforeLicenseCreation === countAfterLicenseCreation - 1, 'one new device has been created');

                    common.json('get', '/api/devices/' + response.deviceId, token)
                      .send({})
                      .expect(200)
                      .end(function (err, res) {
                        response = res.body;

                        assert(response.name === locationName, 'Location name must be recorded');
                        assert(response.username === username, 'Username must be recorded');
                        assert(response.password === password, 'Password must be recorded');
                        assert(response.location === undefined, 'Lat/lng should be empty');
                        assert(response.organizationPath === country + '/' + province + '/' + city, 'Org path must be recorded');
                        assert(response.address === address, 'Address must be recorded');
                        done();
                      });
                  });
              });
          });
        });
    });

  it('should activate license with a standard string address (no google object) no location and return a new device', function (done) {
      var address = '19 Daybreak St, Nepean, ON K2G 6R7, Canada';

      common.login('solink', function(token) {

        common.json('get', '/api/devices/count', token)
          .send({})
          .expect(200)
          .end(function (err, res) {
            if (err) {
              console.log('error count devices: ' + err);
              throw err;
            }
            var countBeforeLicenseCreation = res.body.count;

            common.json('post', '/api/licenses/activate')
              .send(
                {
                  key: 'ABCDABCDABCF',
                  address: {
                    formatted_address: address
                  }
                }
              )
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  console.log('error! ' + err);
                  throw err;
                }
                var response = res.body;
                assert(response.deviceId, 'must have a deviceId');
                assert(response.authToken, 'must return a jwt token');
                assert(response.refreshToken, 'must return a refresh token');

                // ensure that the number of devices has grown
                common.json('get', '/api/devices/count', token)
                  .send({})
                  .expect(200)
                  .end(function (err, res) {
                    if (err) throw err;

                    var countAfterLicenseCreation = res.body.count;
                    assert(countBeforeLicenseCreation === countAfterLicenseCreation - 1, 'one new device has been created');

                    common.json('get', '/api/devices/' + response.deviceId, token)
                      .send({})
                      .expect(200)
                      .end(function (err, res) {
                        response = res.body;

                        assert(response.name === 'Activated Device', 'Location name must be set to the default');
                        assert(response.username === 'solink-local', 'Username must be set to the default');
                        assert(response.password === '__connect__', 'Password must be set to the default');
                        assert(response.location === undefined, 'Lat/lng should be empty');
                        assert(response.organizationPath === '', 'Org path must be set to the default');
                        assert(response.address === address, 'Address must be recorded');
                        done();
                      });
                  });
              });
          });
        });
    });
  });

  describe('Creating a license cannot be done with a standard admin account', function() {
    it('should return an unauthorized http response', function(done) {
      common.login('admin', function (token) {
        common.json('post', '/api/licenses', token)
          .send({customerId: 1})
          .expect(401)
          .end(function (err) {
            if (err) throw err;
            done();
          });
      });
    });
  });

  describe('Creating a license cannot be done with a standard user account', function() {
    it('should return an unauthorized http response', function(done) {
      common.login('user', function (token) {
        common.json('post', '/api/licenses', token)
          .send({customerId: 1})
          .expect(401)
          .end(function (err) {
            if (err) throw err;
            done();
          });
      });
    });
  });

  describe('Creating a license cannot be done without a token', function() {
    it('should return an unauthorized http response', function(done) {
      common.json('post', '/api/licenses')
        .send({customerId: 1})
        .expect(401)
        .end(function (err) {
          if (err) throw err;
          done();
        });
    });
  });


  describe('Creating a license succeeds with correct setup', function() {
    it('should create a new license, plus use a new random license key', function(done) {
      common.login('solink', function (token) {
        // first, count the number of devices so we can check that they increment later on.

          common.json('post', '/api/licenses', token)
            .send({
              customerId: '1',
              key: 'ABCDABCDABCD'
            })
            .expect(200) // TODO: this should really be 201... why is loopback returning 200?
            .end(function (err, res) {
              if (err) {
                console.log('error creating license: ' + err);
                throw err;
              }
              assert(res.body.id, 'must have created a new id');
              assert(res.body.customerId, 'must return a customer ID');
              assert.notEqual(res.body.key, 'ABCDABCDABCD', 'the key must be randomly generated, not the one passed in');

              done();
            });
      });
    });
  });
});