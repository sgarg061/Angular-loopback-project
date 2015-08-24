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
        /*
        if (ctx.isNewInstance) {
            addUniqueLicense(License, ctx.instance, next);
        } else {
            next();
        }*/
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
                logger.error('WARNING: license already exists');
                return addUniqueLicense(License, license, next);
            } else {
                // the license is unique.
                var Device = License.app.models.Device;
                Device.create({
                    name: 'Unactivated Device',
                    customerId: license.customerId
                }, function sendResponse(err, res) {
                    if (err) {
                        logger.error('WARNING: Unable to create device: ' + err);
                        next(err);
                    } else {
                        var deviceId = res.id;
                        // device is created, now create corresponding user
                        var username = 'cwhiten+' + license.customerId + '+' + deviceId.replace(/-/g, '') + '@solinkcorp.com';
                        var password = randToken.generate(16);
                        License.app.models.Customer.getOwnership(license.customerId, function (err, res) {
                            if (err) {
                                logger.error('error getting customer ownership! ' + err);
                                next(err);
                            } else {
                                var userData = res;
                                userData.deviceId = deviceId;
                                userData.usertype = 'connect';
                                authService.createUser(username, password, userData, function (err, res) {
                                    if (err) {
                                        logger.error('Error while creating user: ' + err);
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
                                                logger.error('error updating license! ' + err);
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

function performActivationTasks(License, license, cb) {
    'use strict';
    // TODO: Create auth0 user, create device, set username/password/deviceID on license object
    var Device = License.app.models.Device;

    Device.create({
        name: 'Activated Device',
        customerId: license.customerId
    }, function createUser(err, res) {
        if (err) {
            logger.error('Error creating device at activation time');
            logger.error(err);
            cb(err);
        }  else {
            var randToken = require('rand-token').generator({
                source: crypto.randomBytes
            });

            var deviceId = res.id;
            var username = 'cwhiten+' + license.customerId + '+' + deviceId.replace(/-/g, '') + '@solinkcorp.com';
            var password = randToken.generate(16);

            // create user
            // set activation flag
            // return response
            var userData = {
                deviceId: deviceId,
                usertype: 'connect',
                custeromId: license.customerId
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
                            var response = {
                                username: username,
                                password: password,
                                deviceId: password
                            };

                            cb(null, JSON.stringify(response));
                        }
                    });
                }
            });
        }
    });
}