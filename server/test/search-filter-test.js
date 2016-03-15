'use strict';
const assert = require('assert');
const common = require('./common');
const app = require('../server');
const authService = require('../services/authService');

describe('Reports tests', () => {

  describe('GET permissions', () => {
    let softwareVersionId;
    let cloud1, cloud2;
    let reseller1Cloud1, reseller2Cloud1, reseller1Cloud2;
    let customer1, customer2, customer3;
    let filter1, filter2, filter3;
    let connector1, connector2, connector3;
    let cloud1User, cloud2User;
    let reseller1Cloud1User, reseller2Cloud1User, reseller1Cloud2User;

    const connector1Id = 'search-connector1';
    const connector2Id = 'search-connector2';
    const connector3Id = 'search-connector3';

    const cloud1UserUsername = 'search-test-cloud1user';
    const cloud2UserUsername = 'search-test-cloud2user';
    const reseller1Cloud1UserUsername = 'search-test-reseller1user';
    const reseller2Cloud1UserUsername = 'search-test-reseller2user';
    const reseller1Cloud2UserUsername = 'search-test-reseller3user';

    // set up filters and users for the permission tests
    before((done) => {
      app.models.SoftwareVersion.find({}, (err, res) => {
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
        }, (err, res) => {
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
          }, (err, res) => {
            if (err) throw err;
            cloud2 = res;

            // 2 resellers in cloud 1, 1 reseller in cloud 2
            app.models.Reseller.create({
              name: 'reseller1',
              cloudId: cloud1.id,
              email: 'hi@solinkcorp.com',
              password: 'hi'
            }, (err, res) => {
              if (err) throw err;
              reseller1Cloud1 = res;

              app.models.Reseller.create({
                name: 'reseller2',
                cloudId: cloud1.id,
                email: 'asdf@sadf.com',
                password: 'asdf'
              }, (err, res) => {
                if (err) throw err;
                reseller2Cloud1 = res;

                app.models.Reseller.create({
                  name: 'reseller3',
                  cloudId: cloud2.id,
                  email: 'asdf@asdf.com',
                  password: 'asfd',
                  test: 'asdf'
                }, (err, res) => {
                  if (err) throw err;
                  reseller1Cloud2 = res;

                  // 1 customer under each reseller
                  app.models.Customer.create({
                    name: 'customer1',
                    resellerId: reseller1Cloud1.id
                  }, (err, res) => {
                    if (err) throw err;
                    customer1 = res;

                    app.models.Customer.create({
                      name: 'customer2',
                      resellerId: reseller2Cloud1.id
                    }, (err, res) => {
                      if (err) throw err;
                      customer2 = res;

                      app.models.Customer.create({
                        name: 'customer3',
                        resellerId: reseller1Cloud2.id
                      }, (err, res) => {
                        if (err) throw err;
                        customer3 = res;

                        app.models.SearchFilter.create({
													id: '',
													name: 'HDX',
													script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
													creatorId: cloud1.id,
													creatorType: 'cloud'
                        }, (err, res) => {
                          if (err) throw err;
                          filter1 = res;

                          app.models.SearchFilter.create({
														id: '',
														name: 'QSR',
														script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
														creatorId: cloud2.id,
														creatorType: 'cloud'
                          }, (err, res) => {
                            if (err) throw err;
                            filter2 = res;

                            app.models.SearchFilter.create({
															id: '',
															name: 'Motion Parser',
															script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
															creatorId: customer3.id,
															creatorType: 'cloud'
                            }, (err, res) => {
                              if (err) throw err;
                              filter3 = res;


			                        app.models.SearchFilterConnector.create({
																id: connector1Id,
																filterId: filter1.id,
																assigneeId: customer1.id,
																assigneeType: 'customer'
			                        }, (err, res) => {
			                          if (err) throw err;
			                          connector1 = res;

			                          app.models.SearchFilterConnector.create({
																	id: connector2Id,
																	filterId: filter2.id,
																	assigneeId: customer1.id,
																	assigneeType: 'customer'
			                          }, (err, res) => {
			                            if (err) throw err;
			                            connector2 = res;

			                            app.models.SearchFilterConnector.create({
																		id: connector3Id,
																		filterId: filter3.id,
																		assigneeId: cloud1.id,
																		assigneeType: 'cloud'
			                            }, (err, res) => {
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


    it('pos connector shouldnt be accessible to reseller user on cloud user 2', (done) => {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, (token) => {
        common.json('get', '/api/reports/' + connector3Id , token)
        .send({})
        .expect(200)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('pos connector shouldnt be accessible to reseller user on cloud user 2', (done) => {
      common.login({username: reseller1Cloud2UserUsername, password: 'test'}, (token) => {
        common.json('get', '/api/reports/' + connector1Id , token)
        .send({})
        .expect(200)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('it shouldnt get the POSFilter for Cloud2', (done) => {
      common.login({username: cloud2UserUsername, password: 'test'}, (token) => {
        common.json('get', '/api/searchfilters/' + filter1.id , token)
        .send({})
        .expect(404)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('it shouldnt let cloud 2 user edit the filter', (done) => {
      common.login({username: cloud2UserUsername, password: 'test'}, (token) => {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description: 'my new description'
        })
        .expect(404)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('it should let cloud 1 user edit the filter', (done) => {
      common.login({username: cloud1UserUsername, password: 'test'}, (token) => {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description:'my new description'
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          assert(typeof res.body=== 'object', 'ensure that the result is an object');
          assert(res.body.description === 'my new description', 'ensure that the search filter is updated with the new description');

          done();
        });
      });
    });



    it('it shouldnt let reseller user assigned to cloud user 1 edit the filter', (done) => {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, (token) => {
        common.json('put', '/api/searchfilters/' + filter1.id , token)
        .send({
          description: 'my new description'
        })
        .expect(401)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('it shouldnt let random cloud user delete the filter', (done) => {
      common.login({username: reseller2Cloud1UserUsername, password: 'test'}, (token) => {
        common.json('delete', '/api/searchfilters/' + filter1.id , token)
        .send({})
        .expect(401)
        .end((err) => {
          if (err) throw err;

          done();
        });
      });
    });


    it('it should allow the owner to delete the filter', (done) => {
      common.login({username: cloud2UserUsername, password: 'test'}, (token) => {
        common.json('delete', '/api/searchfilters/' + filter2.id , token)
        .send({})
        .expect(200)
        .end((err, res) => {
          if (err) throw err;


          assert(typeof res.body=== 'object', 'ensure that the result is an object');
          assert(res.body.count === 1, 'ensure that one record was deleted from the db');

          done();
        });
      });
    });

    it('should delete connector associations when a report is deleted', (done) => {
      common.login('solink', () => {
        // create the report and connector
        app.models.SearchFilter.create({ name: 'mynewreport', creatorId: cloud1.id, creatorType: 'cloud' })
        .then((newReport) => {
          app.models.SearchFilterConnector.create({ assigneeId: customer1.id, assigneeType: 'customer', filterId: newReport.id })
          .then((newConnector) => {
            // validate that the connector exists
            app.models.SearchFilterConnector.find({})
            .then((connectors) => {
              assert.equal(connectors.filter((con) => { return con.id === newConnector.id; }).length, 1);
              // delete the report
              app.models.SearchFilter.destroyById(newReport.id)
              .then(() => {
                // verify that the connectors were also deleted
                app.models.SearchFilterConnector.find({})
                .then((updatedConnectors) => {
                  assert.equal(updatedConnectors.filter((con) => { return con.id === newConnector.id; }).length, 0);
                  done();
                })
                .catch((err) => {
                  throw err;
                });
              })
              .catch((err) => {
                throw err;
              });
            })
            .catch((err) => {
              throw err;
            });
          })
          .catch((err) => {
            throw err;
          });
        })
        .catch((err) => {
          throw err;
        });
      });

    });

  });
});