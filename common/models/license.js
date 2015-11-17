var crypto = require('crypto');
var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');

var loopback = require('loopback');

module.exports = function (License) {
    'use strict';
    License.activate = function (key, address, name, username, password, location, req, cb) {
        logger.info('Activating license key ' + key);

        var ipAddress = 'no ip detected';
        if (req) {
            ipAddress = req.connection.remoteAddress;
        }
        var deviceInfo = {
            address: address,
            name: name,
            username: username,
            password: password,
            ipAddress: ipAddress,
            location: location
        };
        activateLicense(License, key, deviceInfo, cb);
    };

    License.observe('before save', function clearLicense(ctx, next) {
        if (ctx.isNewInstance) {
            if (ctx.instance && !ctx.instance.id) {
                ctx.instance.id = uuid.v1();
            }

            var loopbackContext = loopback.getCurrentContext();
            // filter out these values if they are coming from an authenticated API request.
            // Otherwise, the request must be a back-end call where we want more control
            if (loopbackContext && loopbackContext.get('jwt')) {
                ctx.instance.username = null;
                ctx.instance.password = null;
                ctx.instance.activated = false;
                ctx.instance.key = null;
                setUniqueLicenseKey(License, ctx.instance, next);
            } else {
                next();
            }
        } else {
            // if we want to do something before license updates, do it here.
            next();
        }
    });

    License.observe('after save', function (ctx, next) {
        next();
    });

    License.remoteMethod(
        'activate',
        {
            accepts: [
                {arg: 'key', type: 'string', required: true},
                {arg: 'address', type: 'object', required: false},
                {arg: 'name', type: 'string', required: false},
                {arg: 'username', type: 'string', required: false},
                {arg: 'password', type: 'string', required: false},
                {arg: 'location', type: 'object', required: false},
                {arg: 'req', type: 'object', http: {source: 'req'}},
            ],
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'device', root: true}
        }
    );
};

function setUniqueLicenseKey(License, license, next) {
    'use strict';
    var randToken = require('rand-token').generator({
        source: crypto.randomBytes
    });

    var licenseKey = license.key;
    if (!licenseKey) {
        licenseKey = randToken.generate(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    }

    License.find({where: {key: licenseKey}}, function checkIfLicenseExists(err, res) {
        if (err) {
            logger.error('Error while checking if new license is unique.');
            logger.error(err);
            next(err);
        } else {
            if (res.length > 0 && !license.key) {
                logger.error('WARNING: license already exists');
                var error = new Error('Duplicate license generated');
                next(error);
            } else {
                // license is unique
                license.key = licenseKey;
                next();
            }
        }
    });
}

function activateLicense(License, key, deviceInfo, cb) {
    'use strict';
    License.find({where: {key: key}}, function activateLicense(err, res) {
        if (err) {
            cb(new Error('Error while retrieving license for activation'), 'Error while retrieving license for activation');
        } else {
            if (res.length > 1) {
                cb(new Error('Duplicate licenses'), 'Duplicate licences found');
            } else if (res.length < 1) {
                var e = new Error('Invalid license.');
                e.statusCode = 400;
                cb(e, 'No license found');
            } else {
                var license = res[0];
                if (license.activated) {
                    cb(new Error('License already activated'), 'License already activated');
                } else {
                    // license is available.   now, activate it.
                    performActivationTasks(License, license, deviceInfo, cb);
                }
            }
        }
    });
}

function performActivationTasks(License, license, deviceInfo, cb) {
    'use strict';
    var Device = License.app.models.Device;

    var deviceData = parseDeviceData(deviceInfo, license.customerId);

    Device.create(deviceData, function createUser(err, res) {
        if (err) {
            logger.error('Error creating device at activation time');
            logger.error(err);
            cb(err);
        }  else {
            var randToken = require('rand-token').generator({
                source: crypto.randomBytes
            });

            var deviceId = res.id;
            var username = 'device+' + license.customerId + '+' + deviceId.replace(/-/g, '') + '@solinkcorp.com';
            var password = randToken.generate(16);

            var userData = {
                deviceId: deviceId,
                userType: 'connect',
                customerId: license.customerId,
                email_verified: true
            };
            authService.createUser(username, password, userData, function (err, res) {
                if (err) {
                    logger.error('Error while creating user for new device');
                    logger.error(err);
                    cb(err);
                } else {
                    license.updateAttributes({
                        activated: true,
                        actiationDate: new Date(),
                        username: username,
                        password: password,
                        deviceId: deviceId
                    }, function sendActivationResponse(err, res) {
                        if (err) {
                            logger.error('Error while setting activated flag on new device');
                            logger.error(err);
                            cb(err);
                        } else {
                            // log in and get refresh token, return that + auth token instead!
                            authService.login(username, password, function (err, res) {
                                if (err) {
                                    logger.error('Error while logging in with newly created device user');
                                    logger.error(err);
                                    cb(err);
                                } else {
                                    var response = {
                                        deviceId: deviceId,
                                        authToken: res.authToken,
                                        refreshToken: res.refreshToken,
                                        aws: res.aws
                                    };

                                    cb(null, response);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function parseDeviceData(deviceInfo, customerId) {
    var deviceData = {
        customerId: customerId,
        ipAddress: deviceInfo.ipAddress
    };

    var name = '';
    if (deviceInfo.name) {
        name = deviceInfo.name;
    } else if (typeof deviceInfo.address === 'object' && typeof deviceInfo.address.name !== 'undefined') {
        name = deviceInfo.address.name;
    } else {
        name = 'Activated Device';
    }
    deviceData.name = name;

    var address = '';
    if (typeof deviceInfo.address === 'string') {
        address = deviceInfo.address;
    } else if (typeof deviceInfo.address === 'object') {
        address = deviceInfo.address.formatted_address;
    } else {
        address = 'Unknown address';
    }
    deviceData.address = address;

    var deviceUsername = deviceInfo.username ? deviceInfo.username : 'solink-local';
    var devicePassword = deviceInfo.password ? deviceInfo.password : '__connect__';
    deviceData.username = deviceUsername;
    deviceData.password = devicePassword;

    if (typeof deviceInfo.location !== 'undefined') {
        var lat = deviceInfo.location.lat;
        var lng = deviceInfo.location.lng;
        deviceData.location = {
            lat: lat,
            lng: lng
        };
    }

    var organizationPath = '';
    var orgPathComponents = [];
    if (typeof deviceInfo.address === 'object' && typeof deviceInfo.address.address_components === 'object') {
        var addressComponents = deviceInfo.address.address_components;
        var countryComponent = addressComponents.filter(function(component) {
            return component.types.filter(function(type) {
                return type === 'country';
            }).length > 0;
        });

        if (countryComponent.length > 0) {
            orgPathComponents.push(countryComponent[0].long_name);
        }

        var provinceComponent = addressComponents.filter(function(component) {
            return component.types.filter(function (type) {
                return ['administrative_area_level_1'].indexOf(type) >= 0; // what qualifies as a province here?  Test different countries. TODO
            }).length > 0;
        });

        if (provinceComponent.length > 0) {
            orgPathComponents.push(provinceComponent[0].long_name);
        }

        var cityComponent = addressComponents.filter(function(component) {
            return component.types.filter(function(type) {
                return type === 'locality';
            }).length > 0;
        });

        if (cityComponent.length > 0) {
            orgPathComponents.push(cityComponent[0].long_name);
        }
    }

    if (orgPathComponents.length >0) {
        organizationPath = orgPathComponents.join('/');
    }
    deviceData.organizationPath = organizationPath;

    return deviceData;
}