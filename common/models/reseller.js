var uuid = require('node-uuid');

module.exports = function(Reseller) {
    Reseller.observe('before save', function addId(ctx, next) {
        if (ctx.instance && !ctx.instance.id) {
            ctx.instance.id = uuid.v1();
        }
        next();
    });

    Reseller.remoteMethod('getOwnership', {
        accepts: {arg: 'id', type: 'string', required: true},
        returns: {arg: 'ownershipProperties', type: 'Object'}
    });

    Reseller.getOwnership = function (id, cb) {
        var error;

        Reseller.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving reseller ownership'));
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find reseller ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate resellers found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    Reseller.app.models.Cloud.find({where: {id: res[0].cloudId}}, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving cloud'));
                        } else {
                            if (res.length < 0) {
                                error = new Error('Unable to find cloud ' + id);
                                error.statusCode = 404;
                                cb(error);
                            } else if (res.length > 1) {
                                error = new Error('Duplicate clouds found with id ' + id);
                                error.statusCode = 422;
                                cb(error);
                            } else {
                                var ownershipProperties = {
                                    cloudId: res[0].id,
                                    resellerId: id
                                };
                                cb(null, ownershipProperties);
                            }
                        }
                    });
                }
            }
        });
    };
};