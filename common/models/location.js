var uuid = require('node-uuid');

module.exports = function(Location) {
	Location.observe('before save', function addId(ctx, next) {
		if (!ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});
};