
var logger = require('./logger');
var async = require('async');
var uuid = require('node-uuid');

module.exports = function(app, doneCallback) {

  var datastore = app.dataSources.callHomeDb;

  logger.log('info', 'creating sample data...');

  if(datastore.connected) {
    createModels();
  } else {
    // if not connected yet, wait. this prevents "possible EventEmitter memory leak detected" warnings.
    // see https://github.com/strongloop/loopback/issues/1186
    datastore.once('connected', function() {
      createModels();
    });
  }

  function createModels() {
    //create all models
    async.auto({
      destroyAll: function(cb) {
        logger.debug('destroying all existing data...');
        app.models.SoftwareVersion.destroyAll();
        app.models.POSConnector.destroyAll();
        app.models.CloudPOSConnector.destroyAll();

        // app.models.POSFilter.destroyAll();
        // app.models.POSFilterConnector.destroyAll();

        app.models.Cloud.destroyAll();
        app.models.Reseller.destroyAll();
        app.models.Customer.destroyAll();
        app.models.Device.destroyAll();
        app.models.DeviceLogEntry.destroyAll();
        app.models.Camera.destroyAll();
        app.models.POSDevice.destroyAll();
        app.models.License.destroyAll();
        cb(null);
      },
      softwareVersions: ['destroyAll', function(cb, results) {
        createSoftwareVersions(cb);
      }],
      clouds: ['softwareVersions', function(cb, results) {
        createClouds(cb, results);
      }],
      resellers: ['clouds', function (cb, results) {
        createResellers(cb, results);
      }],
      cloudPOSConnectors: ['resellers', function(cb, results) {
        createCloudPOSConnectors(cb, results);
      }],
      // posFilters: ['filters', function(cb, results) {
      //   createPOSFilters(cb, results);
      // }],
      customers: ['resellerPOSConnectors', function (cb, results) {
        createCustomers(cb, results);
      }],
      devices: ['customers', function (cb, results) {
        createDevices(cb, results);
      }],
    licenses: ['devices', function (cb, results) {
      createLicenses(cb, results);
    }],
      cameras: ['devices', function (cb, results) {
        createCameras(cb, results);
      }],
      posDevices: ['devices', function (cb, results) {
        createPOSDevices(cb, results);
      }],
      result: ['posDevices', function (cb, results) {
        doneCallback();
      }]
    });
  }

  function createSoftwareVersions(cb) {
    logger.debug('creating software versions...');
    datastore.automigrate('SoftwareVersion', function(err) {
      if (err) {
        console.log('errr', err);
        logger.error(err);
        return cb(err);
      }
      app.models.SoftwareVersion.create([
        { name: 'Version 1.0',      code: 1, url: 'http://update.solinkcloud.net/version-1.0'},
        { name: 'Version 1.1 RC1',  code: 2, url: 'http://update.solinkcloud.net/version-1.1-RC1'},
        { name: 'Version 1.1 RC2',  code: 3, url: 'http://update.solinkcloud.net/version-1.1-RC2'},
        { name: 'Version 1.2 Test', code: 4, url: 'http://update.solinkcloud.net/version-1.2-Test'},
        { name: 'Version 2.0',      code: 5,  url: 'http://update.solinkcloud.net/version-2.0'},
        { name: 'Version 2.1',      code: 6,  url: 'http://update.solinkcloud.net/version-2.1'},
        { name: 'Version 2.2',      code: 7,  url: 'http://update.solinkcloud.net/version-2.2'},
        { name: 'Version 2.3',      code: 8,  url: 'http://update.solinkcloud.net/version-2.3'},
      ], cb);
    });
  }

  function createClouds(cb, results) {
    logger.debug('creating clouds...');

    datastore.automigrate('Cloud', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.Cloud.create([
        { name: 'Solink',
          eventServerUrl: 'http://api.solinkcloud.net',
          imageServerUrl: 'http://images.solinkcloud.net',
          signallingServerUrl: 'http://signaller.solinkcloud.net',
          updateUrl: 'http://update.solinkcloud.net',
          checkinInterval: 3600,
          softwareVersionId: results.softwareVersions[0].id,
          email: 'cwhiten+o1@solinkcorp.com',
          password: 'test'
        },
        { name: 'Solink APAC',
          eventServerUrl: 'http://api.apac.solinkcloud.net',
          imageServerUrl: 'http://images.apac.solinkcloud.net',
          signallingServerUrl: 'http://signaller.apac.solinkcloud.net',
          updateUrl: 'http://update.solinkcloud.net',
          checkinInterval: 3600,
          softwareVersionId: results.softwareVersions[0].id,
          email: 'cwhiten+o2@solinkcorp.com',
          password: 'test'
        },
      ], cb);
    });
  }

  function createResellers(cb, results) {
    logger.debug('creating resellers...');
    datastore.automigrate('Reseller', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.Reseller.create([
        { name: 'Reseller 1',
          cloudId: results.clouds[0].id,
          email: 'cwhiten+v1@solinkcorp.com',
          password: 'test'
        },
        { name: 'Reseller 2',
          cloudId: results.clouds[0].id,
          checkinInterval: 3000,
          email: 'cwhiten+v2@solinkcorp.com',
          password: 'test'
        },
        { name: 'Reseller 3',
          cloudId: results.clouds[1].id,
          checkinInterval: 3000,
          email: 'cwhiten+v3@solinkcorp.com',
          password: 'test'
        }
      ], cb);
    });
  }

  function createCloudPOSConnectors(cb, results) {
    logger.debug('creating Cloud POS connectors...');
    datastore.automigrate('CloudPOSConnector', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.POSConnector.create([
        { name: 'HDX',
          script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        },
        { name: 'QSR',
          script: 'console.log(String.fromCharCode(0xD83C, 0xDF7B));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        },
        { name: 'Motion Parser',
          script: 'console.log(String.fromCharCode(0xD83D, 0xDE32));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        }
      ], cb);
    });
  }

  function createPOSFilters(cb, results) {
    logger.debug('creating POS filters...');
    datastore.automigrate('CreatePOSFilters', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.POSFilter.create([
        { name: 'HDX',
          script: 'console.log(String.fromCharCode(0xD83C, 0xDF7A));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        },
        { name: 'QSR',
          script: 'console.log(String.fromCharCode(0xD83C, 0xDF7B));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        },
        { name: 'Motion Parser',
          script: 'console.log(String.fromCharCode(0xD83D, 0xDE32));',
          creatorId: results.clouds[0].id,
          creatorType: 'cloud'
        }
      ], cb);
    });
  }


  function createCustomers(cb, results) {
    logger.debug('creating customers...');
    datastore.automigrate('Customer', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.Customer.create([
        {name: 'Customer 1', resellerId: results.resellers[0].id, id: 1},
        {name: 'Customer 2', resellerId: results.resellers[1].id, id: 2, checkinInterval: 2400},
        {name: 'Customer 3', resellerId: results.resellers[2].id, id: 3},
      ], cb);
    });
  }

  function createDevices(cb, results) {
    logger.debug('creating device log entries collection...');
    datastore.automigrate('DeviceLogEntry', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
    });
    logger.debug('creating devices...');
    datastore.automigrate('Device', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.Device.create([
        {guid: uuid.v1(), name: 'Device 1', customerId: results.customers[0].id},
        {guid: uuid.v1(), name: 'Device 2', customerId: results.customers[1].id, checkinInterval: 2000},
        {guid: uuid.v1(), name: 'Device 3', customerId: results.customers[2].id},
      ], cb);
    });
  }

  function createCameras(cb, results) {
    logger.debug('creating cameras...');
    datastore.automigrate('Camera', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.Camera.create([
        {cameraId: 'bb5357a6-5ac2-488b-817a-687c4ad637d6', name: 'Camera 1', status: 'on', deviceId: results.devices[1].id},
        {cameraId: '08996ceb-5e08-4ca2-8dd7-387d3041b4a7', name: 'Camera 2', status: 'on', deviceId: results.devices[1].id},
        {cameraId: '8978428b-3865-4602-be09-97502a4997ed', name: 'Camera 3', status: 'on', deviceId: results.devices[2].id},
      ], cb);
    });
  }

  function createPOSDevices(cb, results) {
    logger.debug('creating POS devices...');
    datastore.automigrate('POSDevice', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.POSDevice.create([
        {posId: 'd2128aeb-c6bd-498e-8e9e-616b4d11ec6d', name: 'POS Device 1', status: 'on', deviceId: results.devices[1].id},
        {posId: '879d3c28-2a56-43c0-99dd-87d8ba1d2298', name: 'POS Device 2', status: 'on', deviceId: results.devices[1].id},
        {posId: '943fc52b-e378-4dc8-9fff-c94f4990a789', name: 'POS Device 3', status: 'on', deviceId: results.devices[2].id},
      ], cb);
    });
  }

  function createLicenses(cb, results) {
    logger.debug('creating licenses...');
    datastore.automigrate('License', function(err) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      app.models.License.create([
        {key: 'ETSHOWDOTHEYWORK', username: 'tcope', password: 'password', customerId: results.customers[0].id, activated: false, deviceId: results.devices[0].id},
        {key: 'ABCDABCDABCD', username: 'tcope', password: 'password', customerId: results.customers[0].id, activated: false, deviceId: results.devices[1].id},
        {key: 'ABCDABCDABCE', username: 'tcope', password: 'password', customerId: results.customers[0].id, activated: false, deviceId: results.devices[1].id},
        {key: 'ABCDABCDABCF', username: 'tcope', password: 'password', customerId: results.customers[0].id, activated: false, deviceId: results.devices[1].id},
      ], cb);
    });
  }

};



if (require.main === module) {
  // called directly from command line
  var app = require('./server');

  // start the app in order to get system components like auth, redis and cache accessors started up
  app.start();

  // Run the import
  module.exports(app, function(err) {
    if (err) {
      logger.error('Cannot import sample data - ', err);
    } else {
      logger.info('Sample data was imported.');

    }
  });
}

