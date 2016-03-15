'use strict';

var path = require('path');

var routes = ['/', '/cloud*', '/reseller*', '/customer*', '/device*', '/login', '/logout'];

module.exports = function(app) {
	routes.forEach(function(route) {
		app.get(route, function(req, res) {
			var filename = path.join(__dirname, '../../client', 'index.html');
			res.sendFile(filename);
		});
	});
};