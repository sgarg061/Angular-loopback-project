var assert = require('assert');
var common = require('./common');
var async = require('async');
var app = require('../server');
var authService = require('../services/authService');

describe('POS tests', function() {
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
    var connector1Username = 'pos-connector1';
    var connector2;
    var connector2Username = 'pos-connector2';
    var connector3;
    var connector3Username = 'pos-connector3';

    var cloud1User;
    var cloud1UserUsername = 'pos-test-cloud1user';
    var cloud2User;
    var cloud2UserUsername = 'pos-test-cloud2user';
    var reseller1Cloud1User;
    var reseller1Cloud1UserUsername = 'pos-test-reseller1user';
    var reseller2Cloud1User;
    var reseller2Cloud1UserUsername = 'pos-test-reseller2user';
    var reseller1Cloud2User;
    var reseller1Cloud2UserUsername = 'pos-test-reseller3user';

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

                        app.models.POSFilter.create({
													id: '',
													name: 'HDX',
													script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
													creatorId: cloud1.id,
													creatorType: 'cloud'
                        }, function (err, res) {
                          if (err) throw err;
                          filter1 = res;

                          app.models.POSFilter.create({
														id: '',
														name: 'QSR',
														script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
														creatorId: cloud2.id,
														creatorType: 'cloud'
                          }, function (err, res) {
                            if (err) throw err;
                            filter2 = res;

                            app.models.POSFilter.create({
															id: '',
															name: 'Motion Parser',
															script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
															creatorId: cloud2.id,
															creatorType: 'cloud'
                            }, function (err, res) {
                              if (err) throw err;
                              filter3 = res;

                        
			                        app.models.POSConnector.create({
																id: connector1Username,
																filterId: filter1.id,
																assigneeId: customer1.id,
																assigneeType: 'customer'
			                        }, function (err, res) {
			                          if (err) throw err;
			                          connector1 = res;

			                          app.models.POSConnector.create({
																	id: connector2Username,
																	filterId: filter2.id,
																	assigneeId: customer1.id,
																	assigneeType: 'customer'
			                          }, function (err, res) {
			                            if (err) throw err;
			                            connector2 = res;

			                            app.models.POSConnector.create({
																		id: connector3Username,
																		filterId: filter3.id,
																		assigneeId: customer1.id,
																		assigneeType: 'customer'
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


						                            app.models.Camera.create({
																					id: "",
																					cameraId: "my-camera",
																					name: "Front Camera",
																					status: "online",
																					deviceId: "device-1",
																					streams: ["any"],
																					thumbnail: "",
																					posId: connector1Username
						                            }, function (err, res) {
						                              if (err) throw err;
						                              camera1 = res;


							                            app.models.Camera.create({
																						id: "",
																						cameraId: "my-camera-1",
																						name: "Back Camera",
																						status: "online",
																						deviceId: "device-1",
																						streams: ["any"],
																						thumbnail: "",
																						posId: connector1Username
							                            }, function (err, res) {
							                              if (err) throw err;
							                              camera2 = res;

								                            app.models.Camera.create({
																							id: "",
																							cameraId: "my-camera-2",
																							name: "Back Camera",
																							status: "online",
																							deviceId: "device-1",
																							streams: ["any"],
																							thumbnail: "",
																							posId: connector1Username
								                            }, function (err, res) {
								                              if (err) throw err;
								                              camera3 = res;

									                            app.models.Camera.create({
																								id: "",
																								cameraId: "my-camera-3",
																								name: "Back Camera",
																								status: "online",
																								deviceId: "device-1",
																								streams: ["any"],
																								thumbnail: "",
																								posId: connector1Username
									                            }, function (err, res) {
									                              if (err) throw err;
									                              camera4 = res;

										                            app.models.Camera.create({
																									id: "",
																									cameraId: "my-camera-4",
																									name: "Back Camera",
																									status: "online",
																									deviceId: "device-1",
																									streams: ["any"],
																									thumbnail: "",
																									posId: connector1Username
										                            }, function (err, res) {
										                              if (err) throw err;
										                              camera5 = res;


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
      });
    });
  });
});
});


    it('should show POS filters existing for the customer.', function (done) {
      common.login('solink', function (token) {
        common.json('get', '/api/customers/' + customer1.id +'/posConnectors', token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body[0] === 'object', 'ensure that the result is a set of objects');
          assert(res.body.length === 3, 'ensure that all 3 pos filters (plus whatever other tests have added) are visible');

          done();
        });
      });
    });


    it('should show the filter assigned to a camera 1', function (done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/cameras/' + camera1.id +'/pos' , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object', 'ensure that the result is a set of objects');

          done();
        });
      });
    });

    it('should show the filter assigned to a camera 2', function (done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/cameras/' + camera2.id +'/pos' , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          assert(typeof res.body === 'object', 'ensure that the result is a set of objects');

          done();
        });
      });
    });

    it('should show assigned cameras to a pos connector', function (done) {
      common.login({username: cloud1UserUsername, password: 'test'}, function (token) {
        common.json('get', '/api/posconnectors/' + connector1.id + '/cameras' , token)
        .send({})
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;

          assert(typeof res.body[0] === 'object', 'ensure that the result is a set of objects');
          assert(res.body.length === 5, 'ensure that the 5 cameras user the pos connector ' + connector1Username);

          done();
        });
      });
    });


	  describe('Checking camera association', function() {
	    it('should assign a camera to the provided POS', function(done) {
	      common.json('put', '/api/cameras/' + camera1.id)
	        .send({posId: connector2.id})
	        .expect(200)
	        .end(function (err, res) {
	          if (err) throw err;

            common.json('get', '/api/posconnectors/' + connector2.id + '/cameras')
            .send({})
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(typeof res.body[0] === 'object', 'this is a proper object, too');
              assert(res.body.length === 1, 'ensure that only 1 camera was returned');

              var deviceName = res.body[0].name;
              assert(deviceName === camera1.name, 'ensure that camera 1 was returned');
              done();
            });
	        });
	    });
	  });

  });
});