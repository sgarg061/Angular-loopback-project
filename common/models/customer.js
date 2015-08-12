var uuid = require('node-uuid');

module.exports = function(Customer) {
	Customer.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

	Customer.remoteMethod('getOwnership', {
        accepts: {arg: 'id', type: 'string', required: true},
        returns: {arg: 'ownershipProperties', type: 'Object'}
    });

    Customer.getOwnership = function (id, cb) {
        var error;
        Customer.find({where: {id: id}}, function (err, res) {
            if (err) {
                cb(new Error('Error while retrieving customer ownership'));
            } else {
                if (res.length < 0) {
                    error = new Error('Unable to find customer ' + id);
                    error.statusCode = 404;
                    cb(error);
                } else if (res.length > 1) {
                    error = new Error('Duplicate customers found with id ' + id);
                    error.statusCode = 422;
                    cb(error);
                } else {
                    Customer.app.models.Reseller.getOwnership(res[0].resellerId, function (err, res) {
                        if (err) {
                            cb(new Error('Error while retrieving reseller ownership'));
                        } else {
                        	var ownershipProperties = res;
                        	ownershipProperties.customerId = id;
                        	cb(null, ownershipProperties);
                        }
                    });
                }
            }
        });
    };
};