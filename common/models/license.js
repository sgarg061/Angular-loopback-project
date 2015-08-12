var crypto = require('crypto');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');

var loopback = require('loopback');

module.exports = function (License) {
    'use strict';
    License.activate = function (key, cb) {
        logger.info('Activating license key ' + key);
        activateLicense(License, key, cb);
    };

    License.observe('before save', function clearLicense(ctx, next) {
        if (ctx.isNewInstance) {
            var loopbackContext = loopback.getCurrentContext();
            // filter out these values if they are coming from an authenticated API request.
            // Otherwise, the request must be a back-end call where we want more control
            if (loopbackContext && loopbackContext.get('jwt')) {
                ctx.instance.username = null;
                ctx.instance.password = null;
                ctx.instance.activated = false;
                ctx.instance.key = null;
            } 
            next();
        } else {
            // if we want to do something before license updates, do it here.
            next();
        }
    });

    License.observe('after save', function (ctx, next) {
        if (ctx.isNewInstance) {
            addUniqueLicense(License, ctx.instance, next);
        } else {
            next();
        }
    });

    License.remoteMethod(
        'activate',
        {
            accepts: [
                {arg: 'key', type: 'string'}
            ],
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'device', root: true}
        }
    );
};

function addUniqueLicense(License, license, next) {
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
            console.log('Error while checking if license exists: ' + err);
            next(err);
        } else {
            if (res.length > 0 && !license.key) {
                console.log('WARNING: license already exists');
                addUniqueLicense(License, license, next);
            } else {
                // the license is unique.
                var Device = License.app.models.Device;
                Device.create({
                    name: 'Unactivated Device',
                    customerId: license.customerId
                }, function sendResponse(err, res) {
                    if (err) {
                        console.log('WARNING: Unable to create device: ' + err);
                        next(err);
                    } else {
                        var deviceId = res.id;
                        // device is created, now create corresponding user
                        var username = 'cwhiten+' + license.customerId + '+' + deviceId.replace(/-/g, '') + '@solinkcorp.com';
                        console.log('username is ' + username);
                        var password = randToken.generate(16);
                        License.app.models.Customer.getOwnership(license.customerId, function (err, res) {
                            if (err) {
                                console.log('error getting customer ownership! ' + err);
                                next(err);
                            } else {
                                var userData = res;
                                userData.deviceId = deviceId;
                                userData.usertype = 'connect';
                                authService.createUser(username, password, userData, function (err, res) {
                                    if (err) {
                                        console.log('Error while creating user: ' + err);
                                        next(err);
                                    } else {
                                        // device is created, now just update the attributes.
                                        license.updateAttributes({
                                            key: licenseKey,
                                            username: username,
                                            password: password,
                                            deviceId: deviceId
                                        }, function (err, instance) {
                                            if (err) {
                                                console.log('error updating license! ' + err);
                                                next(err);
                                            } else {
                                                next();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}

function activateLicense(License, key, cb) {
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
                    performActivationTasks(License, license, cb);
                }
            }
        }
    });
}

function performActivationTasks(License, licenseInstance, cb) {
    'use strict';
    licenseInstance.updateAttributes({
        activated: true,
        activationDate: new Date()
    }, function sendActivationResponse(err, res) {
        var response = {
            username: licenseInstance.username,
            password: licenseInstance.password,
            deviceId: licenseInstance.deviceId
        };

        cb(null, JSON.stringify(response));
    });
}