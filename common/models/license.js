var crypto = require('crypto');
var authService = require('../../server/services/authService');

// TODO: Add create method.  Limit acl to solink users.  Add remote hook to remove everything except for tenant ID
module.exports = function (License) {
    'use strict';
    License.activate = function (key, cb) {
        console.log('Activating license key ' + key);
        activateLicense(License, key, cb);
    };

    License.beforeCreate = function (next, modelInstance) {
        modelInstance.username = null;
        modelInstance.password = null;
        modelInstance.activated = false;
        modelInstance.key = false;
        next();
    };

    License.afterCreate = function (next) {
        addUniqueLicense(License, this, next);
    };

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

    var licenseKey = randToken.generate(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

    License.find({where: {key: licenseKey}}, function checkIfLicenseExists(err, res) {
        if (err) {
            console.log('Error while checking if license exists: ' + err);
            next(err);
        } else {
            if (res.length > 0) {
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
                        next(err); // TODO: this doesn't actually appear to work... I'm still getting a 200 OK
                    } else {
                        var deviceId = res.id;
                        // device is created, now create corresponding user
                        var username = 'cwhiten+' + license.customerId + '+' + deviceId.replace(/-/g, "") + '@solinkcorp.com';
                        var password = randToken.generate(16);
                        console.log('username: ' + username);
                        authService.createUser(username, username, password, function (err, res) {
                            console.log('create user has called back!');
                            console.log('err: ' + err);
                            console.log('res: ' + res);
                            if (err) {
                                console.log('Error while creating user: ' + err);
                                next(err); // TODO: this doesn't actually appear to work... I'm still getting a 200 OK
                            } else {
                                // device is created, now just update the attributes.
                                license.updateAttributes({
                                    key: licenseKey,
                                    username: username,
                                    password: password,
                                    device: deviceId
                                }, function (err, instance) {
                                    if (err) {
                                        console.log('error updating license! ' + err);
                                        next(err); // TODO: this doesn't actually appear to work... I'm still getting a 200 OK
                                    } else {
                                        next();
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
                cb(new Error('No license found'), 'No license found');
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
    }, function createDevice(err, res) {
        if (err) {
            console.log('Error updating attribute' + err);
        } else {
            // now, create a device to use this activated license
            var Device = License.app.models.Device;
            Device.create({
                name: 'Activated Device',
                customerId: licenseInstance.customerId
            }, function sendResponse(err, res) {
                if (err) {
                    // An error here would be bad.
                    // This puts us in a bad state.
                    // Activation flag is enabled, but device might not be created...
                    // re-set activation flag
                    console.log('WARNING: Unable to create device: ' + err);
                    licenseInstance.updateAttributes({
                        activated: false
                    }, function returnFromError(err, res) {
                        if (err) {
                            // Device not created AND error re-setting activation flag.  This is a bad case.
                            cb(new Error('Error creating device.  Check that the activation is set correctly.'), 'Error creating device');
                        } else {
                            // Device not created, but we successfully reset the activation flag.
                            cb(new Error('Error creating device.'), 'Error creating device');
                        }
                    });
                } else {
                    var deviceId = res.id;
                    var response = {
                        username: licenseInstance.username,
                        password: licenseInstance.password,
                        deviceId: deviceId
                    };

                    cb(null, JSON.stringify(response));
                }
            });
        }
    });
}