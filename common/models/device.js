var loopback = require('loopback');
var uuid = require('node-uuid');

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
        returns: {arg: 'result', type: 'string'},
        http: {path: '/:id/checkin', verb: 'post'}
    });

    Device.observe('access', function limitToTenant(ctx, next) {
        var context = loopback.getCurrentContext();
        var tenantId = 0;
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
        Device.find({where: {id: id}}, function(err, res) {
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

    function checkinDevice (device, deviceData, cb) {
        console.log('checkin data: ' + JSON.stringify(deviceData));
        
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
        /*jshint loopfunc: true */
        console.log('updating cameras');
        var cameras = deviceData.cameraInformation;

        for (var i=0; i<cameras.length; i++) {

            // set the deviceId on the camera before inserting/updating
            var camera = cameras[i];
            camera.deviceId = device.id;

            // FIXME: Right now camera id's are coming in with the camera object. id's are owned
            // by call home so they should be generated by the system. The id field that comes in
            // should be renamed to cameraId and a find should be done where deviceId and cameraId
            // match. If there's a match, an update should be done, otherwise an insert should
            // be done. Same goes for POS connectors.
            Device.app.models.Camera.upsert(camera, function(err, res) {
                if (err) {
                    // return early
                    return cb(new Error('Error updating camera information: %s', err));
                }
            });
        }
        // TODO: consider how to handle cameras that weren't part of the payload? delete them? 
        // mark  them as 'offline' or a 'removed' state?

        updatePOSConnectors(device, deviceData, cb);
    }

    function updatePOSConnectors (device, deviceData, cb) {
        /*jshint loopfunc: true */
        console.log('updating pos connectors');

        var posConnectors = deviceData.posInformation;

        for (var i=0; i<posConnectors.length; i++) {
            console.log('posConnectors: ' + posConnectors[i]);

            // set the deviceId on the pos before inserting/updating
            var pos = posConnectors[i];
            pos.deviceId = device.id;
            console.log('about to upsert pos: ' + JSON.stringify(pos));

            Device.app.models.POS.upsert(pos, function(err, res) {
                if (err) {
                    console.log('failed to upsert pos: ' + err);
                    // return early
                    return cb(new Error('Error updating pos information: %s', err));
                }
            });
        }

        cb(null, 'Checkin Successful.');
    }

};