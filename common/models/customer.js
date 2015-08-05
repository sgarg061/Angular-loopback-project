var uuid = require('node-uuid');

module.exports = function(Customer) {
	Customer.observe('before save', function addId(ctx, next) {
		if (!ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});
};