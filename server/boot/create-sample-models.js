var async = require('async');
module.exports = function(app) {
  
  var mongoDs = app.dataSources.elasticsearch;
  
  //create all models
  async.auto({
    destroy_all: function(cb) {
      app.models.Cloud.destroyAll();
      app.models.Reseller.destroyAll();
      app.models.Customer.destroyAll();
      cb(null);
    },
    clouds: ['destroy_all', function(cb, results) {
      createClouds(cb);
    }],
    resellers: ['clouds', function (cb, results) {
      createResellers(cb, results);
    }],
    customers: ['resellers', function (cb, results) {
      createCustomers(cb, results);
    }]
  });

  function createClouds(cb) {
    console.log('creating clouds...');
    mongoDs.automigrate('Cloud', function(err) {
      if (err) return cb(err);
      app.models.Cloud.create([
        { name: 'Solink', 
          serverUrl: 'http://api.solinkcloud.net', 
          imageServerUrl: 'http://images.solinkcloud.net', 
          signallingServerUrl: 'http://signaller.solinkcloud.net', 
          updateUrl: 'http://update.solinkcloud.net', 
          checkinInterval: 3600},
        { name: 'Solink APAC', 
          serverUrl: 'http://api.apac.solinkcloud.net', 
          imageServerUrl: 'http://images.apac.solinkcloud.net', 
          signallingServerUrl: 'http://signaller.apac.solinkcloud.net', 
          updateUrl: 'http://update.solinkcloud.net', 
          checkinInterval: 3600},
      ], cb);
    });
  }

  function createResellers(cb, results) {
    console.log('creating resellers...');
    mongoDs.automigrate('Reseller', function(err) {
      if (err) return cb(err);
      app.models.Reseller.create([
        {name: 'Reseller 1', cloudId: results.clouds[0].id},
        {name: 'Reseller 2', cloudId: results.clouds[0].id},
        {name: 'Australian Reseller 1', cloudId: results.clouds[1].id},
      ], cb);
    });
  }
  
  function createCustomers(cb, results) {
    console.log('creating customers...');
    mongoDs.automigrate('Reseller', function(err) {
      if (err) return cb(err);
      app.models.Customer.create([
        {name: 'Customer 1', resellerId: results.resellers[0].id},
        {name: 'Customer 2', cloudId: results.resellers[1].id},
        {name: 'Customer 3', cloudId: results.resellers[2].id},
      ], cb);
    });
  }
};