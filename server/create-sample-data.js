var async = require('async');

module.exports = function(app, doneCallback) {

  var datastore = app.dataSources.elasticsearch;
  // var datastore = app.dataSources.mongo;

  console.log('creating sample data...');

  //create all models
  async.auto({
    destroyAll: function(cb) {
      console.log('destroying all existing data...');
      app.models.Cloud.destroyAll();
      app.models.Reseller.destroyAll();
      app.models.Customer.destroyAll();
      app.models.Location.destroyAll();
      app.models.Device.destroyAll();
      app.models.Camera.destroyAll();
      app.models.POS.destroyAll();
      cb(null);
    },
    clouds: ['destroyAll', function(cb, results) {
      createClouds(cb);
    }],
    resellers: ['clouds', function (cb, results) {
      createResellers(cb, results);
    }],
    customers: ['resellers', function (cb, results) {
      createCustomers(cb, results);
    }],
    locations: ['customers', function (cb, results) {
      createLocations(cb, results);
    }],
    devices: ['locations', function (cb, results) {
      createDevices(cb, results);
    }],
    cameras: ['devices', function (cb, results) {
      createCameras(cb, results);
    }],
    posConnectors: ['devices', function (cb, results) {
      createPOSs(cb, results);
    }],
    result: ['posConnectors', function (cb, results) {
      doneCallback();
    }]
  });

  function createClouds(cb) {
    console.log('creating clouds...');
    datastore.automigrate('Cloud', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
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
    datastore.automigrate('Reseller', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.Reseller.create([
        {name: 'Reseller 1', cloudId: results.clouds[0].id},
        {name: 'Reseller 2', cloudId: results.clouds[0].id},
        {name: 'Australian Reseller 1', cloudId: results.clouds[1].id},
      ], cb);
    });
  }

  function createCustomers(cb, results) {
    console.log('creating customers...');
    datastore.automigrate('Customer', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.Customer.create([
        {name: 'Customer 1', resellerId: results.resellers[0].id},
        {name: 'Customer 2', resellerId: results.resellers[1].id},
        {name: 'Customer 3', resellerId: results.resellers[2].id},
      ], cb);
    });
  }

  function createLocations(cb, results) {
    console.log('creating locations...');
    datastore.automigrate('Location', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.Location.create([
        {name: 'Location 1', address: '', customerId: results.customers[0].id},
        {name: 'Location 2', address: '', customerId: results.customers[1].id},
        {name: 'Location 3', address: '', customerId: results.customers[2].id},
      ], cb);
    });
  }

  function createDevices(cb, results) {
    console.log('creating devices...');
    datastore.automigrate('Device', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.Device.create([
        {name: 'Device 1', locationId: results.locations[0].id},
        {name: 'Device 2', locationId: results.locations[1].id},
        {name: 'Device 3', locationId: results.locations[2].id},
      ], cb);
    });
  }

  function createCameras(cb, results) {
    console.log('creating cameras...');
    datastore.automigrate('Camera', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.Camera.create([
        {name: 'Camera 1', status: 'on', deviceId: results.devices[0].id},
        {name: 'Camera 2', status: 'on', deviceId: results.devices[1].id},
        {name: 'Camera 3', status: 'on', deviceId: results.devices[2].id},
      ], cb);
    });
  }

  function createPOSs(cb, results) {
    console.log('creating devices...');
    datastore.automigrate('POS', function(err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      app.models.POS.create([
        {name: 'POS 1', status: 'on', deviceId: results.devices[0].id},
        {name: 'POS 2', status: 'on', deviceId: results.devices[1].id},
        {name: 'POS 3', status: 'on', deviceId: results.devices[2].id},
      ], cb);
    });
  }
};

if (require.main === module) {
  
  // Run the import
  module.exports(require('./server'), function(err) {
    if (err) {
      console.error('Cannot import sample data - ', err);
    } else {
      console.log('Sample data was imported.');
      
    }
  });
}
  
