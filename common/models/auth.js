
module.exports = function(Auth) {

	Auth.validate = function(token, cb) {
		console.log("Validating token: " + token);
		cb(null, "Valid token");
		//console.log("Invalid token! " + token);
		//var err = new Error("Invalid token received.");
		//err.statusCode = 400;
		//cb(err, "Invalid token");
	}

	Auth.login = function(username, password, cb) {
		console.log("Logging in with creds " + username + ":" + password);
		cb(null, "Logged in");
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
			http: {verb: 'get', status: 200, errorStatus: 500},
			returns: {arg: 'response', type: 'string'}
		}
	);

};
