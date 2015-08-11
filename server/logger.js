var winston = require('winston');
var config = require('../config');

module.exports = (function() {

	var logger = new (winston.Logger)({
    	transports: [
			new (winston.transports.Console)({
				level: config.log.console.level,
		  		colorize: config.log.console.colorize,
		  		label: config.log.console.label
			}),
			new (winston.transports.File)({
				level: config.log.file.level,
				filename: config.log.file.filename
			})]
		});

	return logger;

}());




	
	