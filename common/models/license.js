module.exports = function(License) {
    'use strict';
    License.activate = function (key, cb) {
        console.log('Activating license key ' + key);
        License.find({where: {key: key}}, function (err, res) {
            if (err) {
                console.log('Error: ' + err);
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
                        license.updateAttributes({
                            activated: true,
                            activationDate: new Date()
                        }, function (err, res) {
                            if (err) {
                                console.log('Error updating attribute' + err);
                            } else {
                                console.log('Succesfully updated attribute! ' + res[0]);
                                // now, create a device to use this activated license
                                var Device = License.app.models.Device;
                                Device.create({
                                    name: 'Activated Device', // should we take a name from the user?
                                }, function (err, res) {
                                    if (err) {
                                        // An error here would be bad.
                                        // This puts us in a bad state.
                                        // Activation flag is enabled, but device might not be created...
                                        // TODO: I'm not even sure. 
                                        cb(new Error('Unable to create device'), 'Unable to create device');
                                    } else {
                                        var deviceId = res.id;
                                        var response = {
                                            username: license.username,
                                            password: license.password,
                                            deviceId: deviceId
                                        };

                                        cb(null, JSON.stringify(response));
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }

    License.remoteMethod(
        'activate',
        {
            accepts: [
                {arg: 'key', type: 'string'},
            ],
            http: {verb: 'post', status: 200, errorStatus: 500},
            returns: {arg: 'response', type: 'string'}
        }
    );
};