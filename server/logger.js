var winston = require('winston');
var Config = require('../config');
var fs = require('fs');

module.exports = (function() {
    var config = new Config();
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: config.log.console.level,
                colorize: config.log.console.colorize,
                label: config.log.console.label,
                timestamp: true
            }),
            new (winston.transports.DailyRotateFile)({
                level: config.log.file.level,
                filename: config.log.file.filename,
                datePattern: '_dd_MM_yyyy.log',
                timestamp: true
            })]
        });

    var cleanUpOldLog = function() {
        var date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        var day  = date.getDate();
        var month= date.getMonth() + 1;
        var year = date.getFullYear();
        var old_file_name = config.log.file.filename + '_' + day + '_' + month  + '_' + year + '.log';
        fs.exists(old_file_name,
            function(exists) {
                if(exists) {
                    fs.unlink(old_file_name);
                }
            });
        setTimeout(cleanUpOldLog , 24 * 60 * 60 * 1000);
    };

    cleanUpOldLog();

    return logger;

}());




    
    