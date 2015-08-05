var loopback = require('loopback');
var jwt = require('jsonwebtoken');

module.exports = function () {
    return function jwtMiddleware (req, res, next) {
        try {
            var authorization_header = req.headers.authorization;
            if (!authorization_header) {
                return next();
            } 

            var auth_parts = authorization_header.split(' ');

            if (auth_parts.length !== 2) {
                return next(); // invalid token. nothing to attach.
            }
                
            var token = auth_parts[1];
            var unpacked_token = jwt.decode(token);
            
            // TODO: parse it out.
            // Check it against our redis cache... potentially cache it there.
            // attach token + decoded valuable info here.
            // ACTUALLY... do the validation in the role resolver.
            var jwtToken = {
                'token': token,
                'user_type': unpacked_token.app_metadata.user_type,
                'tenant_id': unpacked_token.app_metadata.tenant_id
            };
            req.jwt = jwtToken;
            return next();
        } catch (err) {
            console.log('Error processing jwt token. ' + err);
            return next();
        }
    }
}