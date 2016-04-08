'use strict';

var common = require('./common');
var async = require('async');
var app = require('../server');

describe('Software Version', function() {
 	this.timeout(5000);
  	describe('Software Version api test: ', function() {
  		it('it should not let user other than cloud and solink to make post request', function(done) {
			var invalidLoginTypes = ['reseller', 'user', 'admin'];
	    	async.each(invalidLoginTypes, function loginWithInvalidType(loginType, cb) {
		        common.login(loginType, function (token) {
		          	common.json('post', '/api/softwareversions', token)
		            .send({
		            	name: 'v0.0.2',
						code: 2,
						url: 'http://solink.softwareversion.test.com/test/software-version/v0.0.2/'
					})
		            .expect(401)
		            .end(function (err) {
		              if (err) {
		                cb(err);
		              } else {
		                cb();
		              }
		            });
		        });
	      	}, function (err) {
	        	if (err) {
	          	throw err;
        	}
	        	done();
      		});
	    });
	    it('it should let cloud and solink user to make post request', function(done) {

	    	var validLoginTypes = ['cloud', 'solink'];
	    	async.each(validLoginTypes, function loginWithValidType(loginType, cb) {
	        common.login(loginType, function (token) {
	          common.json('post', '/api/softwareversions', token)
	            .send({
	            	name: 'v0.0.2',
					code: 2,
					url: 'http://solink.softwareversion.test.com/test/software-version/v0.0.2/'
				})
	            .expect(200)
	            .end(function (err) {
	              if (err) {
	                cb(err);
	              } else {
	                cb();
	              }
	            });
	        });
	      	}, function (err) {
	        if (err) {
	          throw err;
	        }
	        done();
	      });
	    });
	    it('it should not let users other than cloud and solink to make delete requests', function(done) {
			app.models.SoftwareVersion.find({}, function (err, res) {
				var softwareVersionId = res[0].id;
      			var inValidLoginTypes = ['reseller', 'user', 'admin'];
		    	async.each(inValidLoginTypes, function loginWithValidType(loginType, cb) {
			        common.login(loginType, function (token) {
			          common.json('delete', '/api/softwareversions/'+softwareVersionId, token)
			            .send({})
			            .expect(401)
			            .end(function (err) {
			              if (err) {
			                cb(err);
			              } else {
			                cb();
			              }
			            });
			        });
		      	}, function (err) {
		        	if (err) {
		          		throw err;
		        	}
		        	done();
		    	});
		    });
	    });
	    it('it should not let users other than cloud and solink to make put requests', function(done) {
	    	app.models.SoftwareVersion.find({}, function (err, res) {
				var softwareVersionId = res[0].id;
      			var inValidLoginTypes = ['reseller', 'user', 'admin'];
		    	async.each(inValidLoginTypes, function loginWithValidType(loginType, cb) {
			        common.login(loginType, function (token) {
			          common.json('put', '/api/softwareversions/'+softwareVersionId, token)
			            .send({})
			            .expect(401)
			            .end(function (err) {
			              if (err) {
			                cb(err);
			              } else {
			                cb();
			              }
			            });
			        });
		      	}, function (err) {
		        if (err) {
		          throw err;
		        }
		        done();
		      });
		    });
	    });
	    it('it should not let users other than cloud and solink to make put requests', function(done) {
	    	app.models.SoftwareVersion.find({}, function (err, res) {
				var softwareVersionId = res[0].id;
	      		var inValidLoginTypes = ['solink', 'cloud'];
		    	async.each(inValidLoginTypes, function loginWithValidType(loginType, cb) {
		        common.login(loginType, function (token) {
		          common.json('put', '/api/softwareversions/'+ softwareVersionId, token)
		            .send({})
		            .expect(200)
		            .end(function (err) {
		              if (err) {
		                cb(err);
		              } else {
		                cb();
		              }
		            });
		        });
		      	}, function (err) {
		        if (err) {
		          throw err;
		        }
		        done();
		      });
		    });
	    });
	    it('it should let Solink and Cloud users to make delete requests', function(done) {
	    	app.models.SoftwareVersion.find({}, function (err, res) {
				var softwareVersionId = res[0].id;
		    	var validLoginTypes = ['cloud', 'solink'];
		    	async.each(validLoginTypes, function loginWithValidType(loginType, cb) {
		        common.login(loginType, function (token) {
		          	common.json('delete', '/api/softwareversions/'+softwareVersionId, token)
		            .send({})
		            .expect(200)
		            .end(function (err) {
		              if (err) {
		                cb(err);
		              } else {
		                cb();
		              }
		            });
		        });
		      }, function (err) {
		        if (err) {
		          throw err;
		        }
		        done();
		      });
		    })
	    });
	    it('it should let solink, cloud, and resellers to make get request', function(done) {

	    	var validLoginTypes = ['cloud', 'solink', 'reseller'];
	    	async.each(validLoginTypes, function loginWithValidType(loginType, cb) {
	        common.login(loginType, function (token) {
	          common.json('get', '/api/softwareversions', token)
	            .send({})
	            .expect(200)
	            .end(function (err) {
	              if (err) {
	                cb(err);
	              } else {
	                cb();
	              }
	            });
	        });
	      }, function (err) {
	        if (err) {
	          throw err;
	        }
	        done();
	      });
	    });
	    it('it should not let any other type make get request', function(done) {

	    	var inValidLoginTypes = ['user', 'admin'];
	    	async.each(inValidLoginTypes, function loginWithValidType(loginType, cb) {
	        common.login(loginType, function (token) {
	          common.json('get', '/api/softwareversions', token)
	            .send({})
	            .expect(401)
	            .end(function (err) {
	              if (err) {
	                cb(err);
	              } else {
	                cb();
	              }
	            });
	        });
	      }, function (err) {
	        if (err) {
	          throw err;
	        }
	        done();
	      });
	    });
	    it('it should fail if token is invalid', function(done) {
			var inValidLoginTypes = ['user', 'admin'];
	    	async.each(inValidLoginTypes, function loginWithValidType(loginType, cb) {
	        common.login(loginType, function () {
	          common.json('get', '/api/softwareversions', 'invalid token')
	            .send({})
	            .expect(401)
	            .end(function (err) {
	              if (err) {
	                cb(err);
	              } else {
	                cb();
	              }
	            });
	        });
	      }, function (err) {
	        if (err) {
	          throw err;
	        }
	        done();
	      });
	    });
	});
});