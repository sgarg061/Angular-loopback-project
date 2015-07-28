var uuid = require('node-uuid');

module.exports = function(Device) {
	Device.observe('before save', function addId(ctx, next) {
		if (!ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});

	Device.checkin = function(id, data, cb) {
	    cb(null, 'checked in for id: ' + id);
	};
	Device.remoteMethod('checkin', {
		accepts: [
			{arg: 'id', type: 'string'},
			{arg: 'data', type: 'string'}
		],
		returns: {arg: 'result', type: 'string'},
		http: {path: '/:id/checkin', verb: 'post'}
		
	});
};