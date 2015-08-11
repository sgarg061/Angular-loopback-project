var crypto = require('crypto');
var authService = require('../../server/services/authService');
var loopback = require('loopback');

// TODO: Add create method.  Limit acl to solink users.  Add remote hook to remove everything except for tenant ID
module.exports = function (License) {
    'use strict';
    License.activate = function (key, cb) {
        console.log('Activating license key ' + key);
        activateLicense(License, key, cb);
    };

    License.beforeCreate = function (next, modelInstance) {
        var ctx = loopback.getCurrentContext();
        // filter out these values if they are coming from an authenticated API request.
        // Otherwise, the request must be a back-end call where we want more control
        if (ctx && ctx.get('jwt')) {
            modelInstance.username = null;
            modelInstance.password = null;
            modelInstance.activated = false;
            modelInstance.key = false;
        } 
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
                        next(err); // TODO: this doesn't actually appear to work... I'm still getting a 200 OK
                    } else {
                        var deviceId = res.id;
                        // device is created, now create corresponding user
                        var username = 'cwhiten+' + license.customerId + '+' + deviceId.replace(/-/g, '') + '@solinkcorp.com';
                        var password = randToken.generate(16);
                        authService.createUser(username, password, function (err, res) {
                            if (err) {
                                console.log('Error while creating user: ' + err);
                                next(err); // TODO: this doesn't actually appear to work... I'm still getting a 200 OK
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
    }, function sendActivationResponse(err, res) {
        var response = {
            username: licenseInstance.username,
            password: licenseInstance.password,
            deviceId: licenseInstance.deviceId
        };

        cb(null, JSON.stringify(response));
    });
}