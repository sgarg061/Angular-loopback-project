var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var _ = require('underscore');

module.exports = function(Device) {
    'use strict';
    Device.observe('before save', function addId(ctx, next) {
        if (ctx.instance && !ctx.instance.id) {
            ctx.instance.id = uuid.v1();
        }
        next();
    });

    Device.remoteMethod('checkin', {
        accepts: [
            {arg: 'id', type: 'string'},
            {arg: 'data', type: 'object'}
        ],
        returns: {root: true},
        http: {path: '/:id/checkin', verb: 'post', status: 200, errorStatus: 500}
    });

    Device.observe('access', function limitToTenant(ctx, next) {
        var context = loopback.getCurrentContext();
        var tenantId = 0;

        if (context && (!context.get('jwt') || context.get('jwt').userType === 'solink')) {
            return next();
        }

        if (context && context.get('jwt') && context.get('jwt').tenantId) {
            tenantId = context.get('jwt').tenantId;
        }

        if (ctx.query.where) {
            ctx.query.where.customerId = tenantId;
        } else {
            ctx.query.where = {
                customerId: tenantId
            };
        }
        next();
    });

    Device.checkin = function (id, data, cb) {

        // before doing anything else, log the checkin data 
        logCheckin(data);

        // TODO: get the customerId from the current jwt token and use it in the device query
        // tod ensure that you can only update a device that belongs to you.
        Device.find({where: {id: id}, include: 'customer'}, function(err, res) {
            
            var error; 

            if (err) {
                cb(new Error('Failed while finding device to checkin'));
            } else {
                if (res.length > 1) {
                    error = new Error('Duplicate devices found');
                    error.statusCode = 422;
                    cb(error);
                } else if (res.length < 1) {
                    error = new Error('No device record found to checkin');
                    error.statusCode = 404;
                    cb(error);
                } else {
                    checkinDevice(res[0], data, cb);
                }
            }
        });
    };

    function logCheckin(data) {
        var deviceLogEntry = _.clone(data);
        if (deviceLogEntry.id) {
            
            // swap the id for deviceId attribute
            deviceLogEntry.deviceId = deviceLogEntry.id;
            delete deviceLogEntry.id;

            // add a timestamp field
            deviceLogEntry.timestamp = Date.now();

            Device.app.models.DeviceLogEntry.create(deviceLogEntry, function(err, res) {
                if (err) {
                    logger.err('Failed to insert logEntry for device checkin: %s', err);
                } else {
                    logger.debug('logEntry for device stored successfully');
                }
            });
        } else {
            logger.error('Unable to checkin: data does not include device id: %s', data);
        }
    }

    function checkinDevice (device, deviceData, cb) {
        
        // update general metadata about the device
        device.updateAttributes({
            id: deviceData.id,
            guid: deviceData.guid,
            locationName: deviceData.locationName,
            address: deviceData.address
        }, function(err, res) {
            if (err) {
                cb(new Error('Error checking in device: %s', err));
            } else {
                updateCameras(device, deviceData, cb);
            }
        });
    }

    function updateCameras (device, deviceData, cb) {
        logger.debug('updating cameras');
        var cameras = deviceData.cameraInformation;

        for (var i=0; i<cameras.length; i++) {
            updateDeviceComponent('Camera', cameras[i], 'cameraId', device.id);
        }

        updatePOSDevices(device, deviceData, cb);
    }

    function updatePOSDevices (device, deviceData, cb) {
        logger.debug('updating pos devices');
        var posDevices = deviceData.posInformation;

        for (var i=0; i<posDevices.length; i++) {
            updateDeviceComponent('POSDevice', posDevices[i], 'posId', device.id);
        }

        generateConfigurationResponse(device, cb);
    }


    function generateConfigurationResponse(device, cb) {
        var errorPrefix = 'Configuration parameters unavailable:';
        
        var customer = device.customer();
        if (!customer) {
            return cb(new Error('%s Failed to find customer for deviceId: %s', device.id));
        }

        Device.app.models['Reseller'].findOne({where: {id: customer.resellerId}, include: 'cloud'}, function(err, reseller) {
            if (err) {
                return cb(new Error('%s Failed to find reseller for customerId: %s resellerId: %s', errorPrefix, customer.id, reseller.id));
            }
            
            var cloud = reseller.cloud();
            if (!cloud) {
                return cb(new Error('%s Failed to find cloud for customerId: %s resellerId: %s', errorPrefix, customer.id, reseller.id));
            }
            
            var result = {
                serverUrl: cloud.serverUrl,
                imageServerUrl: cloud.imageServerUrl,
                signallingServerUrl: cloud.signallingServerUrl,
                updateUrl: cloud.updateUrl,
                checkinInterval: cloud.checkinInterval
            };

            cb(null, result);
        });
    }

    // Update a device's attached components. A component can be a Camera or POS.
    function updateDeviceComponent (componentType, component, componentIdName, deviceId) {
        
        var componentId = component[componentIdName];

        // ensure that there is a unique componentId  (cameraId or posId) that we can use to find the component
        if (!componentId) {
            // TODO: this should go in the customer log
            logger.error('Cannot register %s - missing %s: %s', componentType, componentIdName, JSON.stringify(component));
            return;
        }

        // set the deviceId on the component before inserting/updating
        component.deviceId = deviceId;

        var where = {deviceId: deviceId};
        where[componentIdName] = componentId;

        Device.app.models[componentType].find({where: where}, function(err, res) {
            if (err) {
                // TODO: this should go in the customer log
                logger.error('Cannot register %s - Failed while trying to find %s: %s', componentType, componentType, err);        
            } else {
                if (res.length > 1) {
                    // TODO: this should go in the customer log
                    logger.error('Cannot register %s - Found more than one matching %s with %s: %s deviceId: %s', componentType, componentType, componentIdName, componentId, deviceId);
                } else if (res.length < 1) {
                    logger.debug('%s not found - registering %s: %s', componentType, componentType, componentId);
                    Device.app.models[componentType].create(component, function(err, res) {
                        if (err) {
                            logger.error('Cannot register %s - Failed while trying to create %s record: %s', componentType, componentType, err);
                        } else {
                            logger.debug('%s registered successully: %s', componentType, componentId);
                        }
                    });
                } else {
                    logger.debug('%s was found. updating attributes: %s', componentType, componentId);
                    res[0].updateAttributes(component, function(err, res) {
                        if (err) {
                            logger.error('Cannot register %s - Failed while trying to update %s record: %s', componentType, componentType, err);
                        } else {
                            logger.debug('%s updated successully: %s', componentType, componentId);
                        }
                    });
                }
            }
        });

        // TODO: consider how to handle cameras and POS devices that weren't part of the payload? delete them? 
        // mark  them as 'offline' or a 'removed' state?
    }

};