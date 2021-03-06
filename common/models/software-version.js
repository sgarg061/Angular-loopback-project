'use strict';

var uuid = require('node-uuid');

module.exports = function(SoftwareVersion) {

	SoftwareVersion.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

};
