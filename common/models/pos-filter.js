var uuid = require('node-uuid');

module.exports = function(PosFilter) {
    'use strict';
	PosFilter.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

};
