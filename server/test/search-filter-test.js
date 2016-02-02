var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');

describe('Reports tests', function() {
  'use strict';
  this.timeout(5000);


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

    var camera1;
    var camera2;
    var camera3;
    var camera4;
    var camera5;

    var filter1;
    var filter2;
    var filter3;

    var connector1;
    var connector1Id = 'search-connector1';
    var connector2;
    var connector2Id = 'search-connector2';
    var connector3;
    var connector3Id = 'search-connector3';

    var cloud1User;
    var cloud1UserUsername = 'search-test-cloud1user';
    var cloud2User;
    var cloud2UserUsername = 'search-test-cloud2user';
    var reseller1Cloud1User;
    var reseller1Cloud1UserUsername = 'search-test-reseller1user';
    var reseller2Cloud1User;
    var reseller2Cloud1UserUsername = 'search-test-reseller2user';
    var reseller1Cloud2User;
    var reseller1Cloud2UserUsername = 'search-test-reseller3user';

    // set up filters and users for the permission tests
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

                        app.models.SearchFilter.create({
													id: '',
													name: 'HDX',
													script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
													creatorId: cloud1.id,
													creatorType: 'cloud'
                        }, function (err, res) {
                          if (err) throw err;
                          filter1 = res;

                          app.models.SearchFilter.create({
														id: '',
														name: 'QSR',
														script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
														creatorId: cloud2.id,
														creatorType: 'cloud'
                          }, function (err, res) {
                            if (err) throw err;
                            filter2 = res;

                            app.models.SearchFilter.create({
															id: '',
															name: 'Motion Parser',
															script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
															creatorId: customer3.id,
															creatorType: 'cloud'
                            }, function (err, res) {
                              if (err) throw err;
                              filter3 = res;

                        
			                        app.models.SearchFilterConnector.create({
																id: connector1Id,
																filterId: filter1.id,
																assigneeId: customer1.id,
																assigneeType: 'customer'
			                        }, function (err, res) {
			                          if (err) throw err;
			                          connector1 = res;

			                          app.models.SearchFilterConnector.create({
																	id: connector2Id,
																	filterId: filter2.id,
																	assigneeId: customer1.id,
																	assigneeType: 'customer'
			                          }, function (err, res) {
			                            if (err) throw err;
			                            connector2 = res;

			                            app.models.SearchFilterConnector.create({
																		id: connector3Id,
																		filterId: filter3.id,
																		assigneeId: cloud1.id,
																		assigneeType: 'cloud'
			                            }, function (err, res) {
			                              if (err) throw err;
			                              connector3 = res;
                        

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
  });
});
});


    it('pos connector shouldnt be accessible to reseller user on cloud user 2', function (done) {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/reports/' + connector3Id , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });


    it('pos connector shouldnt be accessible to reseller user on cloud user 2', function (done) {
      common.login({username: reseller1Cloud2UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/reports/' + connector1Id , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });


    it('it shouldnt get the POSFilter for Cloud2', function (done) {
      common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/searchfilters/' + filter1.id , token)
        .send({})
        .expect(404)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });


    it('it shouldnt let cloud 2 user edit the filter', function (done) {
      common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description: 'my new description'
        })
        .expect(404)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });


    it('it should let cloud 1 user edit the filter', function (done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description:'my new description'
        })
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body=== 'object', 'ensure that the result is an object');
          assert(res.body.description === 'my new description', 'ensure that the search filter is updated with the new description');

          done();
        });
      });
    });



    it('it shouldnt let reseller user assigned to cloud user 1 edit the filter', function (done) {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, function (token) {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description: 'my new description'
        })
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });
    

    it('it shouldnt let random cloud user delete the filter', function (done) {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, function (token) {
        common.json('delete', '/api/searchfilters/' + filter1.id , token)
        .send({})
        .expect(401)
        .end(function (err, res) {
          if (err) throw err;

          done();
        });
      });
    });
    

    it('it should allow the owner to delete the filter', function (done) {
      common.login({username: cloud2UserUsername, password: 'test'}, function (token) {
        common.json('delete', '/api/searchfilters/' + filter2.id , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;


          assert(typeof res.body=== 'object', 'ensure that the result is an object');
          assert(res.body.count === 1, 'ensure that one record was deleted from the db');

          done();
        });
      });
    });

  });
});