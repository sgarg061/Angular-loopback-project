var Config = require('../config');

var config = new Config();

exports.privateKey = config.privateKey;
exports.certificate = config.certificate;