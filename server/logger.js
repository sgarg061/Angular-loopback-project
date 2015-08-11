var winston = require('winston');
var config = require('../config');

module.exports = (function() {

	winston.loggers.add('system', {
		console: {
	  		level: config.log.system.level,
	  		colorize: true,
	  		label: config.log.system.label
		},
		file: {
			level: config.log.system.level,
			filename: config.log.system.filename
		}
	});

	winston.loggers.add('customer', {
		console: {
			level: config.log.customer.level,
			label: config.log.customer.label
		},
		file: {
			level: config.log.customer.level,
			filename: config.log.customer.filename
		}
	});

	return {
		system : function() { return winston.loggers.get('system'); },
		customer : function () { return winston.loggers.get('customer'); }
	};


}());




	
	