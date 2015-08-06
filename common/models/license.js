module.exports = function(License) {
    'use strict';
    License.activate = function (key, cb) {
        console.log('Activating license key ' + key);
        activateLicense(License, key, cb);
    };

    License.remoteMethod(
        'activate',
        {
            accepts: [
                {arg: 'key', type: 'string'},
            ],
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'device', root: true}
        }
    );
};

function activateLicense (License, key, cb) {
    License.find({where: {key: key}}, function activateLicense (err, res) {
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

function performActivationTasks (License, licenseInstance, cb) {
    licenseInstance.updateAttributes({
        activated: true,
        activationDate: new Date()
    }, function createDevice (err, res) {
        if (err) {
            console.log('Error updating attribute' + err);
        } else {
            // now, create a device to use this activated license
            var Device = License.app.models.Device;
            Device.create({
                name: 'Activated Device',
                customerId: licenseInstance.customerId
            }, function sendResponse (err, res) {
                if (err) {
                    // An error here would be bad.
                    // This puts us in a bad state.
                    // Activation flag is enabled, but device might not be created...
                    // re-set activation flag
                    console.log('WARNING: Unable to create device: ' + err);
                    licenseInstance.updateAttributes({
                        activated: false
                    }, function returnFromError (err, res) {
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