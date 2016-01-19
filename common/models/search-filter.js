var uuid = require('node-uuid');

module.exports = function(SearchFilter) {
    'use strict';
	SearchFilter.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
        if (ctx.instance) {
            ctx.instance.lastUpdated = Date();
        }

		next();
	});
};
