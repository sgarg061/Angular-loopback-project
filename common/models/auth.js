var request = require('request');
var config = require('../../config');

module.exports = function(Auth) {

	Auth.validate = function(token, cb) {
		console.log('Validating token: ' + token);
		cb(null, 'Valid token');
	}

	Auth.login = function(username, password, cb) {
		console.log("Logging in with creds " + username + ':' + password);
		authenticateWithAuth0(username, password, cb);
	}

	function authenticateWithAuth0(username, password, cb) {
		request({
			url: config.auth0URL + '/oauth/ro',
			method: 'POST',
			form: {
				username: username,
				password: password,
				client_id: config.auth0ClientID,
				connection: 'Username-Password-Authentication',
				grant_type: 'password',
				scope: config.auth0Scope
			}
		}, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				var token_info = JSON.parse(body);
				var token = token_info["id_token"];

				authenticateWithAWS(token, cb);
			} else {
				var e = new Error("Unable to login");
				e.statusCode = res.statusCode;
				cb(e, 'Failed login');
			}
		});
	}

	function authenticateWithAWS(token, cb) {
		request({
			url: config.auth0URL + '/delegation',
			method: 'POST',
			form: {
				grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
				id_token: token,
				client_id: config.auth0ClientID,
				role: config.auth0AWSRole,
				principal: config.auth0AWSPrincipal,
				api_type: 'aws'
			}
		}, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				token_info = JSON.parse(body);
				var creds = token_info["Credentials"];
				var response = {
					"auth_token": token,
					"aws": {
						"AccessKeyId": creds["AccessKeyId"],
						"SecretAccessKey": creds["SecretAccessKey"],
						"SessionToken": creds["SessionToken"]
					}
				};
				cb(null, JSON.stringify(response));
			} else {
				var e = new Error("Unable to login");
				e.statusCode = res.statusCode;
				cb(e, 'Failed login');
			}

		});

	}

	Auth.remoteMethod(
		'validate',
		{
			accepts: {arg: 'token', type: 'string', required: true},
			http: {verb: 'get', status: 200, errorStatus: 500},
			returns: {arg: 'response', type: 'string'}
		}
	);

	Auth.remoteMethod(
		'login',
		{
			accepts: [
				{arg: 'username', type: 'string'},
				{arg: 'password', type: 'string'}
			],
			http: {verb: 'post', status: 200, errorStatus: 500},
			returns: {arg: 'response', type: 'string'}
		}
	);

};
