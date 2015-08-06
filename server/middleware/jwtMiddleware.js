var jwt = require('jsonwebtoken');

module.exports = function () {
    return function jwtMiddleware (req, res, next) {
        try {
            var authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next();
            } 

            var authParts = authorizationHeader.split(' ');

            if (authParts.length !== 2) {
                return next(); // invalid token. nothing to attach.
            }
                
            var token = auth_parts[1];
            var unpacked_token = jwt.decode(token);
            
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
    };
};