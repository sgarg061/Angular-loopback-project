var uuid = require('node-uuid');
var authService = require('../../server/services/authService');
var logger = require('../../server/logger');
var loopback = require('loopback');

module.exports = function(PosFilter) {
    'use strict';
	PosFilter.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
        if (ctx.instance) {
            ctx.instance.lastUpdated = Date()
        };

		next();
	});


};
