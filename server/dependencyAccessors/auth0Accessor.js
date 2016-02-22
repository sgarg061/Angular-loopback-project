var request = require('request');
var Config = require('../../config');
var jwt = require('jsonwebtoken');
var logger = require('../logger');

var Auth0Accessor = function () {
};

Auth0Accessor.prototype.login = function (username, password, cb) {
  'use strict';
  var config = new Config();

  request({
    url: config.auth0URL + '/oauth/ro',
    method: 'POST',
    form: {
      username: username,
      password: password,
      client_id: config.auth0ClientID,
      connection: 'Username-Password-Authentication',
      grant_type: 'password',
      scope: config.auth0Scope,
      device: 'call-home'
    }
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var tokenInfo = JSON.parse(body);
      var token = tokenInfo.id_token;
      var refreshToken = tokenInfo.refresh_token;

      authenticateWithAWS(token, refreshToken, cb);
    } else {
      var e = new Error('Unable to login');
      if (res) {
        e.statusCode = res.statusCode;
      }
      cb(e, 'Failed login');
    }
  });
};

Auth0Accessor.prototype.refresh = function (refreshToken, jwtToken, cb) {
  'use strict';
  var config = new Config();

    // if jwt expires within an hour, refresh the whole thing
    // else, just refresh the aws token and return the original jwt.
    var refreshJwt = false;

    var currentTime = Date.now();
    var unpacked = jwt.decode(jwtToken);
    console.log('unpacked token to refresh: ', unpacked);
    if (typeof unpacked === 'object' && unpacked !== null) {
      var jwtExpiry = unpacked.exp * 1000;
      refreshJwt = (jwtExpiry - currentTime) < (3600 * 1000);
    } else {
      refreshJwt = true;
    }

    if (refreshJwt) {
      request({
        url: config.auth0URL + '/delegation',
        method: 'POST',
        form: {
          client_id: config.auth0ClientID,
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          refresh_token: refreshToken,
          api_type: 'app',
          scope: config.auth0Scope
        }
      }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
          var tokenInfo = JSON.parse(body);
          var token = tokenInfo.id_token;
          authenticateWithAWS(token, refreshToken, cb);
        } else {
          var e = new Error('Unable to use refresh token');
          e.statusCode = res.statusCode;
          cb(e, 'Failed refresh');
        }
      });
    } else {
      authenticateWithAWS(jwtToken, refreshToken, cb);
    }
  };

  Auth0Accessor.prototype.createUser = function (email, password, userData, cb) {
    'use strict';
    var config = new Config();

    var userCreationForm = {
      email: email,
      password: password,
      connection: 'Username-Password-Authentication',
      app_metadata: {
        tenantId: userData.customerId ? userData.customerId : '',
        resellerId: userData.resellerId,
        cloudId: userData.cloudId,
        userType: userData.userType
      }
    };

    if (userData.email_verified && password) {
      userCreationForm.email_verified = true;
    } else {
      userCreationForm.email_verified = false;
    }

    request({
      url: config.auth0URL + '/api/v2/users',
      method: 'POST',
      form: userCreationForm,
      auth: {
        bearer: config.createUserToken
      }
    }, function (error, response, body) {
      if (error) {
        cb(error, '');
      } else if (response.statusCode !== 201) {
        var responseBody = JSON.parse(response.body);
        var e = new Error('Unable to create user');
        e.statusCode = response.statusCode;
        e.message = responseBody.message;
        cb(e, '');
      } else {
        cb(null, body);
      }
    });
  };

  function authenticateWithAWS(jwtToken, refreshToken, cb) {
    'use strict';
    var config = new Config();
    console.log(jwtToken);
    request({
      url: config.auth0URL + '/delegation',
      method: 'POST',
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        id_token: jwtToken,
        client_id: config.auth0ClientID,
        role: config.auth0AWSRole,
        principal: config.auth0AWSPrincipal,
        api_type: 'aws'
      }
    }, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        var tokenInfo = JSON.parse(body);
        var creds = tokenInfo.Credentials;
        var response = {
          authToken: jwtToken,
          refreshToken: refreshToken,
          aws: {
            accessKeyId: creds.AccessKeyId,
            secretAccessKey: creds.SecretAccessKey,
            sessionToken: creds.SessionToken,
            expiration: creds.Expiration
          }
        };
        cb(null, response);
      } else {
        var e = new Error('Unable to login');
        console.log(res.body);
        e.statusCode = res.statusCode;
        cb(e, 'Failed login');
      }
    });
}

Auth0Accessor.prototype.setPassword = function (email, oldPassword, newPassword, cb) {
  'use strict';
  var config = new Config();

  Auth0Accessor.prototype.login(email, oldPassword, function (error, response, body) {
    if (error || response && !response.authToken) {
      var e = new Error('Unable to set password.');
      if(response) {
        e.statusCode = response.statusCode;
      }
      cb(e, '');
    } else {
      var userId = jwt.decode(response.authToken).sub;
      request({
        url: config.auth0URL + '/api/v2/users/' + userId,
        method: 'PATCH',
        form: {
          password: newPassword
        },
        auth: {
          bearer: config.updateUserToken
        }
      }, function (error, response, body) {
        if (error) {
          cb(error, '');
        } else if (response.statusCode !== 200) {
          var e = new Error('Unable to set password.');
          e.statusCode = response.statusCode;
          cb(e, '');
        } else {
          cb(null, 'Password successfully updated.');
        }
      });
    }
  });
};

Auth0Accessor.prototype.forgotPassword = function (email, newPassword, cb) {
  'use strict';
  var config = new Config();

  var forgotPasswordForm = {
    email: email,
    password: newPassword,
    connection: 'Username-Password-Authentication'
  };

  request({
    url: config.auth0URL + '/dbconnections/change_password',
    method: 'POST',
    form: forgotPasswordForm,
  }, function (error, response, body) {
    if (error) {
      cb(error, '');
    } else if (response.statusCode !== 200) {
      var e = new Error('Unable to send forgot password email');
      e.statusCode = response.statusCode;
      cb(e, '');
    } else {
      cb(null, 'Forgot password email successfully sent.');
    }
  });
};

Auth0Accessor.prototype.listUsers = function (type, id, cb) {
  'use strict';
  var config = new Config();

  var query = 'app_metadata.' + type + ':\"' + id + '\"';

  switch (type) {
    case 'tenantId':
      query += ' AND (app_metadata.userType:admin OR app_metadata.userType:standard)';
      break;
    case 'resellerId':
      query += ' AND app_metadata.userType:reseller';
      break;
    case 'cloudId':
      break;
    default:
      break;
  }

  query += '&search_engine=v2';
  console.log('making query ', query);
  request({
    url: config.auth0URL + '/api/v2/users?q=' + query,
    method: 'GET',
    auth: {
      bearer: config.listUserToken
    }
  }, function (err, res, body) {
    if (err) {
      throw err;
    }

    cb(null, JSON.parse(body));
  });
};

Auth0Accessor.prototype.updateMetadata = function (id, appMetadata, userMetadata, cb) {
  'use strict';
  var config = new Config();

  var updateForm = {};
  if (appMetadata) {
    updateForm.app_metadata = appMetadata;
  }

  if (userMetadata) {
    updateForm.user_metadata = userMetadata;
  }

  request({
    url: config.auth0URL + '/api/v2/users/' + id,
    method: 'PATCH',
    form: updateForm,
    auth: {
      bearer: config.updateUserToken
    }
  }, function (err, res, body) {
    if (err) {
      logger.error(err);
      return cb(err, null);
    }

    if (res.statusCode !== 200) {
      var e = new Error('Unable to set metadata');
      e.statusCode = res.statusCode;
      return cb(e, null);
    }

    return cb(null, JSON.parse(body));
  });
};

Auth0Accessor.prototype.getUser = function (id, cb) {
  'use strict';
  var config = new Config();

  request({
    url: config.auth0URL + '/api/v2/users/' + id,
    method: 'GET',
    auth: {
      bearer: config.listUserToken
    }
  }, function (err, res, body) {
    if (err) {
      throw err;
    }

    cb(null, JSON.parse(body));
  });
};

Auth0Accessor.prototype.forceSetPassword = function (id, password, cb) {
  'use strict';
  var config = new Config();

  request({
    url: config.auth0URL + '/api/v2/users/' + id,
    method: 'PATCH',
    form: {
      password: password
    },
    auth: {
      bearer: config.updateUserToken
    }
  }, function (error, response, body) {
    if (error) {
      cb(error, null);
    } else if (response.statusCode !== 200) {
      var e = new Error('Unable to set password.');
      e.statusCode = response.statusCode;
      cb(e, null);
    } else {
      cb(null, 'Password successfully updated.');
    }
  });
};

Auth0Accessor.prototype.deleteUser = function (id, cb) {
  'use strict';
  var config = new Config();

  request({
    url: config.auth0URL + '/api/v2/users/' + id,
    method: 'DELETE',
    auth: {
      bearer: config.deleteUserToken
    }
  }, function (error, response, body) {
    if (error){
      cb(error, null);
    } else if (response.statusCode !== 200) {
      var e = new Error('Unable to delete user');
      e.statusCode = response.statusCode;
      cb(e, null);
    } else {
      cb(null, 'Deleted successfully');
    }
  });
};

module.exports = Auth0Accessor;
