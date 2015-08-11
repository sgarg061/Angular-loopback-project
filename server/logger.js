var winston = require('winston');
var config = require('../config');

module.exports = (function() {

	winston.loggers.add('system', {
		console: {
	  		level: config.log.system.console.level,
	  		colorize: config.log.system.console.colorize,
	  		label: config.log.system.console.label
		},
		file: {
			level: config.log.system.file.level,
			filename: config.log.system.file.filename
		}
	});

	winston.loggers.add('customer', {
		console: {
			level: config.log.customer.console.level,
			colorize: config.log.customer.console.colorize,
			label: config.log.customer.console.label
		},
		file: {
			level: config.log.customer.file.level,
			filename: config.log.customer.file.filename
		}
	});

	return {
		system : function() { return winston.loggers.get('system'); },
		customer : function () { return winston.loggers.get('customer'); }
	};


}());




	
	