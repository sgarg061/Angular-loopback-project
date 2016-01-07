var logger = require('../../server/logger');
var loopback = require('loopback');
var uuid = require('node-uuid');
var _ = require('underscore');
var async = require('async');
var _ = require('lodash');
var deviceDataParser = require('../utils/deviceDataParser');


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

    Device.remoteMethod('getOwnership', {
        accepts: {arg: 'id', type: 'string', required: true},
        returns: {arg: 'ownershipProperties', type: 'Object'}
    });

    Device.observe('access', function limitToTenant(ctx, next) {
        var context = loopback.getCurrentContext();
        var Customer = Device.app.models.Customer;

        if (context && context.get('jwt')) {
            var resellerId = context.get('jwt').resellerId;
            var tenantId = context.get('jwt').tenantId;
            var cloudId = context.get('jwt').cloudId;
            var userType = context.get('jwt').userType;

            if (userType === 'solink') {
                next();
            } else if (tenantId) {
                if (ctx.query.where) {
                    ctx.query.where.customerId = tenantId;
                } else {
                    ctx.query.where = {
                        customerId: tenantId
                    };
                }
                next();
            } else if (resellerId) {
                Customer.find({where: {resellerId: resellerId}}, function (err, res) {
                    if (err) {
                        logger.error('Error querying customers with reseller id ' + resellerId);
                        logger.error(err);
                        next(err);
                    } else {
                        var ids = [];
                        for (var i = 0; i < res.length; i++) {
                            ids.push(res[i].id);
                        }

                        if (ctx.query.where) {
                            ctx.query.where.customerId = {inq: ids};
                        } else {
                            ctx.query.where = {
                                customerId: {
                                    inq: ids
                                }
                            };
                        }
                        next();
                    }
                });
            } else if (cloudId) {
                cloudPermissions(Device, ctx, cloudId, next);
            }
        } else {
            next();
        }


    });

    function cloudPermissions(Device, ctx, cloudId, next) {
        var Reseller = Device.app.models.Reseller;
        var Customer = Device.app.models.Customer;
        var ids = [];

        Reseller.find({where: {cloudId: cloudId}}, function (err, res) {
            if (err) {
                logger.error('Error querying resellers with cloud id ' + cloudId);
                logger.error(err);
                next(err);
            } else {
                var resellerIds = [];
                for (var i = 0; i < res.length; i++) {
                    resellerIds.push(res[i].id);
                }

                var customerIds = [];
                async.each(resellerIds, function getCustomerIds(resellerId, cb) {
                    Customer.find({where: {resellerId: resellerId}}, function (err, res) {
                        if (err) {
                            logger.error('Error querying customers with reseller id ' + resellerId);
                            logger.error(err);
                            cb(err);
                        } else {
                            for (var i = 0; i < res.length; i++) {
                                customerIds.push(res[i].id);
                            }
                            cb();
                        }
                    });
                }, function (err) {
                    if (err) {
                        next(err);
                    } else {
                        if (ctx.query.where) {
                            ctx.query.where.customerId = {inq: customerIds};
                        } else {
                            ctx.query.where = {
                                customerId: {
                                    inq: customerIds
                                }
                            };
                        }
                        next();
                    }
                });
            }
        });
    }

    Device.getCloud = function (id, cb) {
        var error;
        var Cloud = Device.app.models.Cloud;

        Device.getReseller(id, function (err, res) {
            if (err) {
                cb(err, -1);
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find reseller for device ' + id);
                    error.statusCode = 422;
                    cb(error, -1);
                } else if (res.length > 1) {
                    error = new Error('Duplicate resellers found for device ' + id);
                    error.statusCode = 422;
                    cb(error, -1);
                } else {
                    Cloud.find({where: {id: res.cloudId}}, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving cloud for device ' + id), -1);
                        } else {
                            if (res.length < 1) {
                                error = new Error('Unable to find cloud for device' + id);
                                error.statusCode = 422;
                                cb(error, -1);
                            } else if (res.length > 1) {
                                error = new Error('Duplicate clouds found for device ' + id);
                                error.statusCode = 422;
                                cb(error, -1);
                            } else {
                                cb(null, res);
                            }
                        }
                    });
                }
            }
        });
    };

    Device.getReseller = function(id, cb) {
        var error;
        var Reseller = Device.app.models.Reseller;

        Device.getCustomer(id, function (err, res) {
            if (err) {
                cb(err, -1);
            } else {
                Reseller.find({where: {id: res[0].resellerId}}, function (err, res) {
                    if (res.length < 1) {
                        error = new Error('Unable to find reseller for device ' + id);
                        error.statusCode = 404;
                        cb(error, -1);
                    } else if (res.length > 1) {
                        error = new Error('Duplicate resellers for device ' + id);
                        error.statusCode = 422;
                        cb(error, -1);
                    } else {
                        cb(null, res);
                    }
                });
            }
        });
    };

    Device.getCustomer = function(id, cb) {
        var error;
        var Customer = Device.app.models.Customer;

        Device.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving device customer id'), -1);
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find device ' + id);
                    error.statusCode = 404;
                    cb(error, -1);
                } else if (res.length > 1) {
                    error = new Error('Duplicate devices found with id ' + id);
                    error.statusCode = 422;
                    cb(error, -1);
                } else {
                    Customer.find({where: {id: res[0].customerId}}, function (err, res) {
                        if (res.length < 1) {
                            error = new Error('Unable to find customer for device ' + id, -1);
                            error.statusCode = 404;
                            cb(error, -1);
                        } else if (res.length > 1) {
                            error = new Error('Duplicate customers found for device ' + id, -1);
                            error.statusCode = 422;
                            cb(error, -1);
                        } else {
                            cb(null, res);
                        }
                    });
                }
            }
        });
    };

    Device.getOwnership = function (id, cb) {
        var error;

        Device.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving device ownership'));
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find device ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate devices found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    Device.app.models.Customer.getOwnership(res[0].customerId, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving customer ownership'));
                        } else {
                            var ownershipProperties = res;
                            ownershipProperties.deviceId = id;
                            cb(null, ownershipProperties);
                        }
                    });
                }
            }
        });
    };

    Device.checkin = function (id, data, cb) {
        // parse checkin data
        data = deviceDataParser.parseDeviceData(data);
        // log the checkin data
        logCheckin(data);
        // TODO: get the customerId from the current jwt token and use it in the device query
        // tod ensure that you can only update a device that belongs to you.
        // TODO: Use a query like this in a future refactor to reduce the number of round-trips to ES
        // to make this happen, need to fix the ES connector to allow for include calls on parent-child relationships
        //Device.find({where: {id: id}, include: 'customer'}, function(err, res) {
        Device.find({where: {id: id}}, function (err, res) {
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
                    var device = res[0];
                    Device.app.models.Customer.findById(device.customerId, function (err, customer) {
                        if (err) {
                            cb(new Error('Failed to find customer with id : ' + device.customerId));
                        } else {
                            device._customer = customer;
                            checkinDevice(device, data, cb);
                        }
                    });
                }
            }
        });
    };

    Device.prototype.toJSON = function() {
        var device = this.toObject(false, true, false);
        if(device.logEntries) {
            device.logEntries = device.logEntries.map(function (logEntry) {
                if(logEntry.checkinData) {
                    for (var key in logEntry.checkinData) {
                        logEntry[key] = logEntry.checkinData[key];
                    }
                    delete logEntry.checkinData;
                }
                return logEntry;
            });
        }
        return device;
    };

    function logCheckin(data) {
        if (data.id) {
            var deviceLogEntry = createDeviceLogEntry(data);
            Device.app.models.DeviceLogEntry.create(deviceLogEntry, function(err, res) {
                if (err) {
                    logger.error('Failed to insert logEntry for device checkin: %s', err);
                } else {
                    logger.debug('logEntry for device stored successfully');
                }
            });
        } else {
            logger.error('Unable to checkin: data does not include device id: %s', data);
        }

    }

    function createDeviceLogEntry(data) {
        var deviceLogEntry = {checkinData: _.clone(data)};

        if (deviceLogEntry.checkinData.appVersion) {
            deviceLogEntry.appVersion = deviceLogEntry.checkinData.appVersion;
        }

        if (deviceLogEntry.checkinData.deviceInformation.model) {
            deviceLogEntry.deviceModel = deviceLogEntry.checkinData.deviceInformation.model;
        }

        if (deviceLogEntry.checkinData.deviceInformation.firmware) {
            deviceLogEntry.deviceFirmware = deviceLogEntry.checkinData.deviceInformation.firmware;
        }

        if (deviceLogEntry.checkinData.deviceInformation.size) {
            deviceLogEntry.diskSize = convertBytesToGB(deviceLogEntry.checkinData.deviceInformation.size);
        }

        if (deviceLogEntry.checkinData.deviceInformation.used) {
            deviceLogEntry.diskSpaceUsed = convertBytesToGB(deviceLogEntry.checkinData.deviceInformation.used);
        }

        if (deviceLogEntry.checkinData.deviceInformation.availableCapacity) {
            deviceLogEntry.diskSpaceFree = convertBytesToGB(deviceLogEntry.checkinData.deviceInformation.availableCapacity);
        }

        // swap the id for deviceId attribute
        deviceLogEntry.deviceId = deviceLogEntry.checkinData.id;
        delete deviceLogEntry.checkinData.id;

        // add a timestamp field
        deviceLogEntry.timestamp = Date.now();
        deviceLogEntry.checkinTime = Date.now();

        return deviceLogEntry;
    }

    function convertBytesToGB(n) {
        return (parseInt(n) / (1024 * 1024 * 1024)).toFixed(2);
    }

    function checkinDevice (device, deviceData, cb) {
        // update general metadata about the device
        var checkedInProperties = generateCheckedInPropertiesObject(deviceData);

        // override ip address, if necessary
        if (device.overrideIpAddress && device.overrideIpAddress.length > 0) {
            checkedInProperties.ipAddress = device.overrideIpAddress;
        }

        device.updateAttributes(checkedInProperties, function(err, updatedDevice) {
            if (err) {
                cb(new Error('Error checking in device: %s', err));
            } else {
                updateCameras(updatedDevice, deviceData, cb);
            }
        });
    }

    function generateCheckedInPropertiesObject(deviceData) {
        var checkedInProperties = {
            lastCheckin: new Date()
        };

        if (deviceData.guid) {
            checkedInProperties.guid = deviceData.guid;
        }
        // hardcoded
        // TODO
        deviceData.organizationPath = 'Canada/Ontario/Ottawa';
        if (deviceData.organizationPath) {
            checkedInProperties.organizationPath = deviceData.organizationPath;
        }

        if (deviceData.address) {
            checkedInProperties.address = deviceData.address;
        }

        if (deviceData.location) {
            checkedInProperties.location = new loopback.GeoPoint({lat: deviceData.location.lat, lng: deviceData.location.lng});
        }

        if (deviceData.locationName) {
            checkedInProperties.name = deviceData.locationName;
        }

        if (deviceData.deviceInformation && deviceData.deviceInformation.ip) {
            checkedInProperties.ipAddress = deviceData.deviceInformation.ip;
        }

        return checkedInProperties;
    }

    function updateCameras (device, deviceData, cb) {
        logger.debug('updating cameras');
        var cameras = deviceData.cameraInformation;
        if (!cameras) {
            var error = new Error('Cameras not included in checkin');
            error.statusCode = 400;
            return cb(error);
        }

        for (var i=0; i<cameras.length; i++) {
            updateDeviceComponent('Camera', cameras[i], 'cameraId', device.id);
        }

        removeNonIncludedComponents('Camera', cameras, 'cameraId', device.id);

        updatePOSDevices(device, deviceData, cb);
    }

    function updatePOSDevices (device, deviceData, cb) {
        logger.debug('updating pos devices');
        var posDevices = deviceData.posInformation;
        if (!posDevices) {
            var error = new Error('POS information not included in checkin');
            error.statusCode = 400;
            return cb(error);
        }

        for (var i=0; i<posDevices.length; i++) {
            updateDeviceComponent('POSDevice', posDevices[i], 'posId', device.id);
        }

        removeNonIncludedComponents('POSDevice', posDevices, 'posId', device.id);

        generateConfigurationResponse(device, cb);
    }


    function generateConfigurationResponse(device, cb) {
        var errorPrefix = 'Configuration parameters unavailable:';

        var customer = device._customer;
        if (!customer) {
            return cb(new Error('%s Failed to find customer for deviceId: %s', device.id));
        }

        // TODO: Use a query like this in a future refactor to reduce the number of round-trips to ES
        // to make this happen, need to fix the ES connector to allow for include calls on parent-child relationships
        //Device.app.models['Reseller'].findOne({where: {id: customer.resellerId}, include: 'cloud'}, function(err, reseller) {
        Device.app.models.Reseller.findOne({where: {id: customer.resellerId}}, function (err, reseller) {
            if (err) {
                return cb(new Error('%s Failed to find reseller for customerId: %s resellerId: %s', errorPrefix, customer.id, customer.resellerId));
            }

            Device.app.models.Cloud.findOne({where: {id: reseller.cloudId}}, function (err, cloud) {
                if (err) {
                    return cb(new Error('%s Failed to find cloud for customerId: %s resellerId: %s', errorPrefix, customer.id, reseller.id));
                }

                // handle inherited attributes
                var eventServerUrl = reseller.eventServerUrl || cloud.eventServerUrl;
                var imageServerUrl = reseller.imageServerUrl || cloud.imageServerUrl;
                var signallingServerUrl = device.signallingServerUrl || customer.signallingServerUrl || reseller.signallingServerUrl || cloud.signallingServerUrl;
                var softwareVersionId = device.softwareVersionId || customer.softwareVersionId || reseller.softwareVersionId || cloud.softwareVersionId;
                var checkinInterval = device.checkinInterval || customer.checkinInterval || reseller.checkinInterval || cloud.checkinInterval;

                var result = {
                    eventServerUrl: eventServerUrl,
                    imageServerUrl: imageServerUrl,
                    signallingServerUrl: cloud.signallingServerUrl,
                    checkinInterval: checkinInterval
                };

                Device.app.models.SoftwareVersion.findOne({where: {id: softwareVersionId}}, function(err, softwareVersion) {
                    if (err) {
                        logger.error('Failed to find software version by id: %s', softwareVersionId);
                    } else {
                        result.updateUrl = softwareVersion.url;
                    }

                    logger.debug('returning configuration: ', result, ' device: ' + JSON.stringify(device));


                    cb(null, result);
                });
            });
        });
    }

    // Update a device's attached components. A component can be a Camera or POS.
    function updateDeviceComponent (componentType, component, componentIdName, deviceId) {

        var componentId = component[componentIdName];

        // ensure that there is a unique componentId  (cameraId or posId) that we can use to find the component
        if (componentId === undefined) {
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
    }

    function removeNonIncludedComponents(componentType, includedComponents, componentIdName, deviceId) {
        Device.app.models[componentType].find({where: {deviceId: deviceId}}, function(err, res) {
            if (err) {
                // TODO: this should go in the customer log
                logger.error('Failed while trying to find %s: %s', componentType, err);
                return;
            }

            if (!includedComponents || !(includedComponents instanceof Array)) {
                return;
            }

            var includedComponentIds = includedComponents.map(function(c) {return c[componentIdName];});
            for (var i = 0; i < res.length; i++) {
                if (includedComponentIds.indexOf(res[i][componentIdName]) < 0) {
                    var removeCondition = {};
                    removeCondition[componentIdName] = res[i][componentIdName];
                    Device.app.models[componentType].remove(removeCondition);
                }
            }
        });
    }
};