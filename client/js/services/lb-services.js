(function(window, angular, undefined) {'use strict';

var urlBase = "/api";
var authHeader = 'authorization';

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.User
 * @header lbServices.User
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `User` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "User",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Users/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__findById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__destroyById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__updateById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__get__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Queries accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/Users/:id/accessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__create__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__create__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__delete__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__count__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Counts accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "prototype$__count__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#create
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#createMany
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#upsert
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Users",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#exists
         * @methodOf lbServices.User
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Users/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Users/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#find
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Users",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findOne
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Users/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#updateAll
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Users/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#deleteById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Users/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#count
         * @methodOf lbServices.User
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Users/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$updateAttributes
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Users/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#createChangeStream
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Users/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#login
         * @methodOf lbServices.User
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         * 
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         * 
         *
         */
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/Users/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#logout
         * @methodOf lbServices.User
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/Users/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#confirm
         * @methodOf lbServices.User
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` - 
         *
         *  - `token` – `{string}` - 
         *
         *  - `redirect` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/Users/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#resetPassword
         * @methodOf lbServices.User
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/Users/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/Users" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.User#updateOrCreate
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.User#update
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.User#destroyById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#removeById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#getCachedCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.User#login} or
         * {@link lbServices.User#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A User instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#isAuthenticated
         * @methodOf lbServices.User
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrentId
         * @methodOf lbServices.User
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name lbServices.User#modelName
    * @propertyOf lbServices.User
    * @description
    * The name of the model represented by this $resource,
    * i.e. `User`.
    */
    R.modelName = "User";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.SoftwareVersion
 * @header lbServices.SoftwareVersion
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `SoftwareVersion` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "SoftwareVersion",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/SoftwareVersions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#create
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/SoftwareVersions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#createMany
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/SoftwareVersions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#upsert
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/SoftwareVersions",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#exists
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/SoftwareVersions/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#findById
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/SoftwareVersions/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#find
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/SoftwareVersions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#findOne
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/SoftwareVersions/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#updateAll
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/SoftwareVersions/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#deleteById
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/SoftwareVersions/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#count
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/SoftwareVersions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#prototype$updateAttributes
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/SoftwareVersions/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#createChangeStream
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/SoftwareVersions/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Cloud.softwareVersion() instead.
        "::get::Cloud::softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Cloud.softwareVersion.create() instead.
        "::create::Cloud::softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Cloud.softwareVersion.createMany() instead.
        "::createMany::Cloud::softwareVersion": {
          isArray: true,
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Cloud.softwareVersion.update() instead.
        "::update::Cloud::softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.softwareVersion.destroy() instead.
        "::destroy::Cloud::softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.softwareVersion() instead.
        "::get::Reseller::softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Reseller.softwareVersion.create() instead.
        "::create::Reseller::softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Reseller.softwareVersion.createMany() instead.
        "::createMany::Reseller::softwareVersion": {
          isArray: true,
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Reseller.softwareVersion.update() instead.
        "::update::Reseller::softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.softwareVersion.destroy() instead.
        "::destroy::Reseller::softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.softwareVersion() instead.
        "::get::Customer::softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Customer.softwareVersion.create() instead.
        "::create::Customer::softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Customer.softwareVersion.createMany() instead.
        "::createMany::Customer::softwareVersion": {
          isArray: true,
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Customer.softwareVersion.update() instead.
        "::update::Customer::softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Customer.softwareVersion.destroy() instead.
        "::destroy::Customer::softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Device.softwareVersion() instead.
        "::get::Device::softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Device.softwareVersion.create() instead.
        "::create::Device::softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Device.softwareVersion.createMany() instead.
        "::createMany::Device::softwareVersion": {
          isArray: true,
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Device.softwareVersion.update() instead.
        "::update::Device::softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Device.softwareVersion.destroy() instead.
        "::destroy::Device::softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "DELETE"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#updateOrCreate
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#update
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#destroyById
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.SoftwareVersion#removeById
         * @methodOf lbServices.SoftwareVersion
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.SoftwareVersion#modelName
    * @propertyOf lbServices.SoftwareVersion
    * @description
    * The name of the model represented by this $resource,
    * i.e. `SoftwareVersion`.
    */
    R.modelName = "SoftwareVersion";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.POSConnector
 * @header lbServices.POSConnector
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `POSConnector` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "POSConnector",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/POSConnectors/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use POSConnector.clouds.findById() instead.
        "prototype$__findById__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.clouds.destroyById() instead.
        "prototype$__destroyById__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.updateById() instead.
        "prototype$__updateById__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.clouds.link() instead.
        "prototype$__link__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.clouds.unlink() instead.
        "prototype$__unlink__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.exists() instead.
        "prototype$__exists__clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use POSConnector.resellers.findById() instead.
        "prototype$__findById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers.destroyById() instead.
        "prototype$__destroyById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.updateById() instead.
        "prototype$__updateById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.resellers.link() instead.
        "prototype$__link__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.resellers.unlink() instead.
        "prototype$__unlink__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.exists() instead.
        "prototype$__exists__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use POSConnector.clouds() instead.
        "prototype$__get__clouds": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.clouds.create() instead.
        "prototype$__create__clouds": {
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.clouds.destroyAll() instead.
        "prototype$__delete__clouds": {
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.count() instead.
        "prototype$__count__clouds": {
          url: urlBase + "/POSConnectors/:id/clouds/count",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers() instead.
        "prototype$__get__resellers": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers.create() instead.
        "prototype$__create__resellers": {
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.resellers.destroyAll() instead.
        "prototype$__delete__resellers": {
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.count() instead.
        "prototype$__count__resellers": {
          url: urlBase + "/POSConnectors/:id/resellers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#create
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/POSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#createMany
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/POSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#upsert
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/POSConnectors",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#exists
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/POSConnectors/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#findById
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/POSConnectors/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#find
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/POSConnectors",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#findOne
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/POSConnectors/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#updateAll
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/POSConnectors/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#deleteById
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/POSConnectors/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#count
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/POSConnectors/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#prototype$updateAttributes
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/POSConnectors/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#createChangeStream
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/POSConnectors/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CloudPOSConnector.pOSConnector() instead.
        "::get::CloudPOSConnector::pOSConnector": {
          url: urlBase + "/CloudPOSConnectors/:id/pOSConnector",
          method: "GET"
        },

        // INTERNAL. Use ResellerPOSConnector.pOSConnector() instead.
        "::get::ResellerPOSConnector::pOSConnector": {
          url: urlBase + "/ResellerPOSConnectors/:id/pOSConnector",
          method: "GET"
        },

        // INTERNAL. Use Cloud.posConnectors.findById() instead.
        "::findById::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "GET"
        },

        // INTERNAL. Use Cloud.posConnectors.destroyById() instead.
        "::destroyById::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.updateById() instead.
        "::updateById::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.posConnectors.link() instead.
        "::link::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.posConnectors.unlink() instead.
        "::unlink::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.exists() instead.
        "::exists::Cloud::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Cloud.posConnectors() instead.
        "::get::Cloud::posConnectors": {
          isArray: true,
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "GET"
        },

        // INTERNAL. Use Cloud.posConnectors.create() instead.
        "::create::Cloud::posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Cloud.posConnectors.createMany() instead.
        "::createMany::Cloud::posConnectors": {
          isArray: true,
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Cloud.posConnectors.destroyAll() instead.
        "::delete::Cloud::posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.count() instead.
        "::count::Cloud::posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors/count",
          method: "GET"
        },

        // INTERNAL. Use Reseller.posConnectors.findById() instead.
        "::findById::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "GET"
        },

        // INTERNAL. Use Reseller.posConnectors.destroyById() instead.
        "::destroyById::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.updateById() instead.
        "::updateById::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.posConnectors.link() instead.
        "::link::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.posConnectors.unlink() instead.
        "::unlink::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.exists() instead.
        "::exists::Reseller::posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Reseller.posConnectors() instead.
        "::get::Reseller::posConnectors": {
          isArray: true,
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "GET"
        },

        // INTERNAL. Use Reseller.posConnectors.create() instead.
        "::create::Reseller::posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Reseller.posConnectors.createMany() instead.
        "::createMany::Reseller::posConnectors": {
          isArray: true,
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Reseller.posConnectors.destroyAll() instead.
        "::delete::Reseller::posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.count() instead.
        "::count::Reseller::posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.POSConnector#updateOrCreate
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#update
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#destroyById
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.POSConnector#removeById
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.POSConnector#modelName
    * @propertyOf lbServices.POSConnector
    * @description
    * The name of the model represented by this $resource,
    * i.e. `POSConnector`.
    */
    R.modelName = "POSConnector";

    /**
     * @ngdoc object
     * @name lbServices.POSConnector.clouds
     * @header lbServices.POSConnector.clouds
     * @object
     * @description
     *
     * The object `POSConnector.clouds` groups methods
     * manipulating `Cloud` instances related to `POSConnector`.
     *
     * Call {@link lbServices.POSConnector#clouds POSConnector.clouds()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.POSConnector#clouds
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Queries clouds of POSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::get::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#count
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Counts clouds of POSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.clouds.count = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::count::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#create
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Creates a new instance in clouds of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.create = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::create::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#createMany
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Creates a new instance in clouds of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.createMany = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::createMany::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#destroyAll
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Deletes all clouds of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.clouds.destroyAll = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::delete::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#destroyById
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Delete a related item by id for clouds.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.clouds.destroyById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::destroyById::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#exists
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Check the existence of clouds relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.exists = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::exists::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#findById
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Find a related item by id for clouds.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.findById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::findById::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#link
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Add a related item by id for clouds.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.link = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::link::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#unlink
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Remove the clouds relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.clouds.unlink = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::unlink::POSConnector::clouds"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.clouds#updateById
         * @methodOf lbServices.POSConnector.clouds
         *
         * @description
         *
         * Update a related item by id for clouds.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for clouds
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.clouds.updateById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::updateById::POSConnector::clouds"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.POSConnector.resellers
     * @header lbServices.POSConnector.resellers
     * @object
     * @description
     *
     * The object `POSConnector.resellers` groups methods
     * manipulating `Cloud` instances related to `POSConnector`.
     *
     * Call {@link lbServices.POSConnector#resellers POSConnector.resellers()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.POSConnector#resellers
         * @methodOf lbServices.POSConnector
         *
         * @description
         *
         * Queries resellers of POSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::get::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#count
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Counts resellers of POSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.resellers.count = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::count::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#create
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Creates a new instance in resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.create = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::create::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#createMany
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Creates a new instance in resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.createMany = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::createMany::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#destroyAll
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Deletes all resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.resellers.destroyAll = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::delete::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#destroyById
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Delete a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.resellers.destroyById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::destroyById::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#exists
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Check the existence of resellers relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.exists = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::exists::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#findById
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Find a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.findById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::findById::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#link
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Add a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.link = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::link::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#unlink
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Remove the resellers relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.resellers.unlink = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::unlink::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.POSConnector.resellers#updateById
         * @methodOf lbServices.POSConnector.resellers
         *
         * @description
         *
         * Update a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.resellers.updateById = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::updateById::POSConnector::resellers"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CloudPOSConnector
 * @header lbServices.CloudPOSConnector
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CloudPOSConnector` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CloudPOSConnector",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CloudPOSConnectors/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CloudPOSConnector.pOSConnector() instead.
        "prototype$__get__pOSConnector": {
          url: urlBase + "/CloudPOSConnectors/:id/pOSConnector",
          method: "GET"
        },

        // INTERNAL. Use CloudPOSConnector.cloud() instead.
        "prototype$__get__cloud": {
          url: urlBase + "/CloudPOSConnectors/:id/cloud",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#create
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CloudPOSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#createMany
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CloudPOSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#upsert
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CloudPOSConnectors",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#exists
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CloudPOSConnectors/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#findById
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CloudPOSConnectors/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#find
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CloudPOSConnectors",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#findOne
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CloudPOSConnectors/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#updateAll
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/CloudPOSConnectors/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#deleteById
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/CloudPOSConnectors/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#count
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CloudPOSConnectors/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#prototype$updateAttributes
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CloudPOSConnectors/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#createChangeStream
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CloudPOSConnectors/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#updateOrCreate
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CloudPOSConnector` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#update
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#destroyById
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#removeById
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CloudPOSConnector#modelName
    * @propertyOf lbServices.CloudPOSConnector
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CloudPOSConnector`.
    */
    R.modelName = "CloudPOSConnector";


        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#pOSConnector
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Fetches belongsTo relation pOSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.pOSConnector = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::get::CloudPOSConnector::pOSConnector"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CloudPOSConnector#cloud
         * @methodOf lbServices.CloudPOSConnector
         *
         * @description
         *
         * Fetches belongsTo relation cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.cloud = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::get::CloudPOSConnector::cloud"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ResellerPOSConnector
 * @header lbServices.ResellerPOSConnector
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ResellerPOSConnector` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ResellerPOSConnector",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ResellerPOSConnectors/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use ResellerPOSConnector.pOSConnector() instead.
        "prototype$__get__pOSConnector": {
          url: urlBase + "/ResellerPOSConnectors/:id/pOSConnector",
          method: "GET"
        },

        // INTERNAL. Use ResellerPOSConnector.cloud() instead.
        "prototype$__get__cloud": {
          url: urlBase + "/ResellerPOSConnectors/:id/cloud",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#create
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ResellerPOSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#createMany
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/ResellerPOSConnectors",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#upsert
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/ResellerPOSConnectors",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#exists
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/ResellerPOSConnectors/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#findById
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ResellerPOSConnectors/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#find
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/ResellerPOSConnectors",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#findOne
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ResellerPOSConnectors/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#updateAll
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/ResellerPOSConnectors/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#deleteById
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/ResellerPOSConnectors/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#count
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ResellerPOSConnectors/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#prototype$updateAttributes
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ResellerPOSConnectors/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#createChangeStream
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/ResellerPOSConnectors/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#updateOrCreate
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ResellerPOSConnector` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#update
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#destroyById
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#removeById
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.ResellerPOSConnector#modelName
    * @propertyOf lbServices.ResellerPOSConnector
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ResellerPOSConnector`.
    */
    R.modelName = "ResellerPOSConnector";


        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#pOSConnector
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Fetches belongsTo relation pOSConnector.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.pOSConnector = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::get::ResellerPOSConnector::pOSConnector"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ResellerPOSConnector#cloud
         * @methodOf lbServices.ResellerPOSConnector
         *
         * @description
         *
         * Fetches belongsTo relation cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.cloud = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::get::ResellerPOSConnector::cloud"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Cloud
 * @header lbServices.Cloud
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Cloud` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Cloud",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Clouds/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Cloud.softwareVersion() instead.
        "prototype$__get__softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Cloud.softwareVersion.create() instead.
        "prototype$__create__softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Cloud.softwareVersion.update() instead.
        "prototype$__update__softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.softwareVersion.destroy() instead.
        "prototype$__destroy__softwareVersion": {
          url: urlBase + "/Clouds/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.findById() instead.
        "prototype$__findById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "GET"
        },

        // INTERNAL. Use Cloud.posConnectors.destroyById() instead.
        "prototype$__destroyById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.updateById() instead.
        "prototype$__updateById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.posConnectors.link() instead.
        "prototype$__link__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.posConnectors.unlink() instead.
        "prototype$__unlink__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.exists() instead.
        "prototype$__exists__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/posConnectors/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Cloud.resellers.findById() instead.
        "prototype$__findById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers.destroyById() instead.
        "prototype$__destroyById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.resellers.updateById() instead.
        "prototype$__updateById__resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.posConnectors() instead.
        "prototype$__get__posConnectors": {
          isArray: true,
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "GET"
        },

        // INTERNAL. Use Cloud.posConnectors.create() instead.
        "prototype$__create__posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Cloud.posConnectors.destroyAll() instead.
        "prototype$__delete__posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.posConnectors.count() instead.
        "prototype$__count__posConnectors": {
          url: urlBase + "/Clouds/:id/posConnectors/count",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers() instead.
        "prototype$__get__resellers": {
          isArray: true,
          url: urlBase + "/Clouds/:id/resellers",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers.create() instead.
        "prototype$__create__resellers": {
          url: urlBase + "/Clouds/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use Cloud.resellers.destroyAll() instead.
        "prototype$__delete__resellers": {
          url: urlBase + "/Clouds/:id/resellers",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.resellers.count() instead.
        "prototype$__count__resellers": {
          url: urlBase + "/Clouds/:id/resellers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#create
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Clouds",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#createMany
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Clouds",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#upsert
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Clouds",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#exists
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Clouds/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#findById
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Clouds/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#find
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Clouds",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#findOne
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Clouds/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#updateAll
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Clouds/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#deleteById
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Clouds/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#count
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Clouds/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#prototype$updateAttributes
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Clouds/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Cloud#createChangeStream
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Clouds/change-stream",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.clouds.findById() instead.
        "::findById::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.clouds.destroyById() instead.
        "::destroyById::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.updateById() instead.
        "::updateById::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.clouds.link() instead.
        "::link::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.clouds.unlink() instead.
        "::unlink::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.exists() instead.
        "::exists::POSConnector::clouds": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/clouds/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use POSConnector.resellers.findById() instead.
        "::findById::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers.destroyById() instead.
        "::destroyById::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.updateById() instead.
        "::updateById::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.resellers.link() instead.
        "::link::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use POSConnector.resellers.unlink() instead.
        "::unlink::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.exists() instead.
        "::exists::POSConnector::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/POSConnectors/:id/resellers/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use POSConnector.clouds() instead.
        "::get::POSConnector::clouds": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.clouds.create() instead.
        "::create::POSConnector::clouds": {
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.clouds.createMany() instead.
        "::createMany::POSConnector::clouds": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.clouds.destroyAll() instead.
        "::delete::POSConnector::clouds": {
          url: urlBase + "/POSConnectors/:id/clouds",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.clouds.count() instead.
        "::count::POSConnector::clouds": {
          url: urlBase + "/POSConnectors/:id/clouds/count",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers() instead.
        "::get::POSConnector::resellers": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "GET"
        },

        // INTERNAL. Use POSConnector.resellers.create() instead.
        "::create::POSConnector::resellers": {
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.resellers.createMany() instead.
        "::createMany::POSConnector::resellers": {
          isArray: true,
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use POSConnector.resellers.destroyAll() instead.
        "::delete::POSConnector::resellers": {
          url: urlBase + "/POSConnectors/:id/resellers",
          method: "DELETE"
        },

        // INTERNAL. Use POSConnector.resellers.count() instead.
        "::count::POSConnector::resellers": {
          url: urlBase + "/POSConnectors/:id/resellers/count",
          method: "GET"
        },

        // INTERNAL. Use CloudPOSConnector.cloud() instead.
        "::get::CloudPOSConnector::cloud": {
          url: urlBase + "/CloudPOSConnectors/:id/cloud",
          method: "GET"
        },

        // INTERNAL. Use Reseller.cloud() instead.
        "::get::Reseller::cloud": {
          url: urlBase + "/Resellers/:id/cloud",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Cloud#updateOrCreate
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Cloud#update
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Cloud#destroyById
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Cloud#removeById
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Cloud#modelName
    * @propertyOf lbServices.Cloud
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Cloud`.
    */
    R.modelName = "Cloud";

    /**
     * @ngdoc object
     * @name lbServices.Cloud.softwareVersion
     * @header lbServices.Cloud.softwareVersion
     * @object
     * @description
     *
     * The object `Cloud.softwareVersion` groups methods
     * manipulating `SoftwareVersion` instances related to `Cloud`.
     *
     * Call {@link lbServices.Cloud#softwareVersion Cloud.softwareVersion()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Cloud#softwareVersion
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Fetches hasOne relation softwareVersion.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::get::Cloud::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.softwareVersion#create
         * @methodOf lbServices.Cloud.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.create = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::create::Cloud::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.softwareVersion#createMany
         * @methodOf lbServices.Cloud.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.createMany = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::createMany::Cloud::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.softwareVersion#destroy
         * @methodOf lbServices.Cloud.softwareVersion
         *
         * @description
         *
         * Deletes softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.softwareVersion.destroy = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::destroy::Cloud::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.softwareVersion#update
         * @methodOf lbServices.Cloud.softwareVersion
         *
         * @description
         *
         * Update softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.update = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::update::Cloud::softwareVersion"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Cloud.posConnectors
     * @header lbServices.Cloud.posConnectors
     * @object
     * @description
     *
     * The object `Cloud.posConnectors` groups methods
     * manipulating `POSConnector` instances related to `Cloud`.
     *
     * Call {@link lbServices.Cloud#posConnectors Cloud.posConnectors()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Cloud#posConnectors
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Queries posConnectors of Cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::get::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#count
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Counts posConnectors of Cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.posConnectors.count = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::count::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#create
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Creates a new instance in posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.create = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::create::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#createMany
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Creates a new instance in posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.createMany = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::createMany::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#destroyAll
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Deletes all posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.destroyAll = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::delete::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#destroyById
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Delete a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.destroyById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::destroyById::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#exists
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Check the existence of posConnectors relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.exists = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::exists::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#findById
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Find a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.findById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::findById::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#link
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Add a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.link = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::link::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#unlink
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Remove the posConnectors relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.unlink = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::unlink::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.posConnectors#updateById
         * @methodOf lbServices.Cloud.posConnectors
         *
         * @description
         *
         * Update a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.updateById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::updateById::Cloud::posConnectors"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Cloud.resellers
     * @header lbServices.Cloud.resellers
     * @object
     * @description
     *
     * The object `Cloud.resellers` groups methods
     * manipulating `Reseller` instances related to `Cloud`.
     *
     * Call {@link lbServices.Cloud#resellers Cloud.resellers()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Cloud#resellers
         * @methodOf lbServices.Cloud
         *
         * @description
         *
         * Queries resellers of Cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.resellers = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::get::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#count
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Counts resellers of Cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.resellers.count = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::count::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#create
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Creates a new instance in resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.resellers.create = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::create::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#createMany
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Creates a new instance in resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.resellers.createMany = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::createMany::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#destroyAll
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Deletes all resellers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.resellers.destroyAll = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::delete::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#destroyById
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Delete a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.resellers.destroyById = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::destroyById::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#findById
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Find a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.resellers.findById = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::findById::Cloud::resellers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Cloud.resellers#updateById
         * @methodOf lbServices.Cloud.resellers
         *
         * @description
         *
         * Update a related item by id for resellers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for resellers
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.resellers.updateById = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::updateById::Cloud::resellers"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Reseller
 * @header lbServices.Reseller
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Reseller` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Reseller",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Resellers/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Reseller.cloud() instead.
        "prototype$__get__cloud": {
          url: urlBase + "/Resellers/:id/cloud",
          method: "GET"
        },

        // INTERNAL. Use Reseller.softwareVersion() instead.
        "prototype$__get__softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Reseller.softwareVersion.create() instead.
        "prototype$__create__softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Reseller.softwareVersion.update() instead.
        "prototype$__update__softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.softwareVersion.destroy() instead.
        "prototype$__destroy__softwareVersion": {
          url: urlBase + "/Resellers/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.findById() instead.
        "prototype$__findById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "GET"
        },

        // INTERNAL. Use Reseller.posConnectors.destroyById() instead.
        "prototype$__destroyById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.updateById() instead.
        "prototype$__updateById__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.posConnectors.link() instead.
        "prototype$__link__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.posConnectors.unlink() instead.
        "prototype$__unlink__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.exists() instead.
        "prototype$__exists__posConnectors": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/posConnectors/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Reseller.customers.findById() instead.
        "prototype$__findById__customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "GET"
        },

        // INTERNAL. Use Reseller.customers.destroyById() instead.
        "prototype$__destroyById__customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.customers.updateById() instead.
        "prototype$__updateById__customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.posConnectors() instead.
        "prototype$__get__posConnectors": {
          isArray: true,
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "GET"
        },

        // INTERNAL. Use Reseller.posConnectors.create() instead.
        "prototype$__create__posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "POST"
        },

        // INTERNAL. Use Reseller.posConnectors.destroyAll() instead.
        "prototype$__delete__posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.posConnectors.count() instead.
        "prototype$__count__posConnectors": {
          url: urlBase + "/Resellers/:id/posConnectors/count",
          method: "GET"
        },

        // INTERNAL. Use Reseller.customers() instead.
        "prototype$__get__customers": {
          isArray: true,
          url: urlBase + "/Resellers/:id/customers",
          method: "GET"
        },

        // INTERNAL. Use Reseller.customers.create() instead.
        "prototype$__create__customers": {
          url: urlBase + "/Resellers/:id/customers",
          method: "POST"
        },

        // INTERNAL. Use Reseller.customers.destroyAll() instead.
        "prototype$__delete__customers": {
          url: urlBase + "/Resellers/:id/customers",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.customers.count() instead.
        "prototype$__count__customers": {
          url: urlBase + "/Resellers/:id/customers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#create
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Resellers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#createMany
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Resellers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#upsert
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Resellers",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#exists
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Resellers/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#findById
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Resellers/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#find
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Resellers",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#findOne
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Resellers/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#updateAll
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Resellers/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#deleteById
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Resellers/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#count
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Resellers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#prototype$updateAttributes
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Resellers/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#createChangeStream
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Resellers/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Reseller#getOwnership
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `id` – `{string}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `ownershipProperties` – `{Object=}` - 
         */
        "getOwnership": {
          url: urlBase + "/Resellers/getOwnership",
          method: "POST"
        },

        // INTERNAL. Use ResellerPOSConnector.cloud() instead.
        "::get::ResellerPOSConnector::cloud": {
          url: urlBase + "/ResellerPOSConnectors/:id/cloud",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers.findById() instead.
        "::findById::Cloud::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers.destroyById() instead.
        "::destroyById::Cloud::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.resellers.updateById() instead.
        "::updateById::Cloud::resellers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Clouds/:id/resellers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Cloud.resellers() instead.
        "::get::Cloud::resellers": {
          isArray: true,
          url: urlBase + "/Clouds/:id/resellers",
          method: "GET"
        },

        // INTERNAL. Use Cloud.resellers.create() instead.
        "::create::Cloud::resellers": {
          url: urlBase + "/Clouds/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use Cloud.resellers.createMany() instead.
        "::createMany::Cloud::resellers": {
          isArray: true,
          url: urlBase + "/Clouds/:id/resellers",
          method: "POST"
        },

        // INTERNAL. Use Cloud.resellers.destroyAll() instead.
        "::delete::Cloud::resellers": {
          url: urlBase + "/Clouds/:id/resellers",
          method: "DELETE"
        },

        // INTERNAL. Use Cloud.resellers.count() instead.
        "::count::Cloud::resellers": {
          url: urlBase + "/Clouds/:id/resellers/count",
          method: "GET"
        },

        // INTERNAL. Use Customer.reseller() instead.
        "::get::Customer::reseller": {
          url: urlBase + "/Customers/:id/reseller",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Reseller#updateOrCreate
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Reseller#update
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Reseller#destroyById
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Reseller#removeById
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Reseller#modelName
    * @propertyOf lbServices.Reseller
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Reseller`.
    */
    R.modelName = "Reseller";


        /**
         * @ngdoc method
         * @name lbServices.Reseller#cloud
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Fetches belongsTo relation cloud.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Cloud` object.)
         * </em>
         */
        R.cloud = function() {
          var TargetResource = $injector.get("Cloud");
          var action = TargetResource["::get::Reseller::cloud"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Reseller.softwareVersion
     * @header lbServices.Reseller.softwareVersion
     * @object
     * @description
     *
     * The object `Reseller.softwareVersion` groups methods
     * manipulating `SoftwareVersion` instances related to `Reseller`.
     *
     * Call {@link lbServices.Reseller#softwareVersion Reseller.softwareVersion()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Reseller#softwareVersion
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Fetches hasOne relation softwareVersion.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::get::Reseller::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.softwareVersion#create
         * @methodOf lbServices.Reseller.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.create = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::create::Reseller::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.softwareVersion#createMany
         * @methodOf lbServices.Reseller.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.createMany = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::createMany::Reseller::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.softwareVersion#destroy
         * @methodOf lbServices.Reseller.softwareVersion
         *
         * @description
         *
         * Deletes softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.softwareVersion.destroy = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::destroy::Reseller::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.softwareVersion#update
         * @methodOf lbServices.Reseller.softwareVersion
         *
         * @description
         *
         * Update softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.update = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::update::Reseller::softwareVersion"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Reseller.posConnectors
     * @header lbServices.Reseller.posConnectors
     * @object
     * @description
     *
     * The object `Reseller.posConnectors` groups methods
     * manipulating `POSConnector` instances related to `Reseller`.
     *
     * Call {@link lbServices.Reseller#posConnectors Reseller.posConnectors()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Reseller#posConnectors
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Queries posConnectors of Reseller.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::get::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#count
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Counts posConnectors of Reseller.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.posConnectors.count = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::count::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#create
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Creates a new instance in posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.create = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::create::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#createMany
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Creates a new instance in posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.createMany = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::createMany::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#destroyAll
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Deletes all posConnectors of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.destroyAll = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::delete::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#destroyById
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Delete a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.destroyById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::destroyById::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#exists
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Check the existence of posConnectors relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.exists = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::exists::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#findById
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Find a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.findById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::findById::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#link
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Add a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.link = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::link::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#unlink
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Remove the posConnectors relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posConnectors.unlink = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::unlink::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.posConnectors#updateById
         * @methodOf lbServices.Reseller.posConnectors
         *
         * @description
         *
         * Update a related item by id for posConnectors.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posConnectors
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSConnector` object.)
         * </em>
         */
        R.posConnectors.updateById = function() {
          var TargetResource = $injector.get("POSConnector");
          var action = TargetResource["::updateById::Reseller::posConnectors"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Reseller.customers
     * @header lbServices.Reseller.customers
     * @object
     * @description
     *
     * The object `Reseller.customers` groups methods
     * manipulating `Customer` instances related to `Reseller`.
     *
     * Call {@link lbServices.Reseller#customers Reseller.customers()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Reseller#customers
         * @methodOf lbServices.Reseller
         *
         * @description
         *
         * Queries customers of Reseller.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customers = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::get::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#count
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Counts customers of Reseller.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.customers.count = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::count::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#create
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Creates a new instance in customers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customers.create = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::create::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#createMany
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Creates a new instance in customers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customers.createMany = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::createMany::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#destroyAll
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Deletes all customers of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.customers.destroyAll = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::delete::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#destroyById
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Delete a related item by id for customers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for customers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.customers.destroyById = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::destroyById::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#findById
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Find a related item by id for customers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for customers
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customers.findById = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::findById::Reseller::customers"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Reseller.customers#updateById
         * @methodOf lbServices.Reseller.customers
         *
         * @description
         *
         * Update a related item by id for customers.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for customers
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customers.updateById = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::updateById::Reseller::customers"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Customer
 * @header lbServices.Customer
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Customer` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Customer",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Customers/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Customer.reseller() instead.
        "prototype$__get__reseller": {
          url: urlBase + "/Customers/:id/reseller",
          method: "GET"
        },

        // INTERNAL. Use Customer.softwareVersion() instead.
        "prototype$__get__softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Customer.softwareVersion.create() instead.
        "prototype$__create__softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Customer.softwareVersion.update() instead.
        "prototype$__update__softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Customer.softwareVersion.destroy() instead.
        "prototype$__destroy__softwareVersion": {
          url: urlBase + "/Customers/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.devices.findById() instead.
        "prototype$__findById__devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "GET"
        },

        // INTERNAL. Use Customer.devices.destroyById() instead.
        "prototype$__destroyById__devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.devices.updateById() instead.
        "prototype$__updateById__devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Customer.licenses.findById() instead.
        "prototype$__findById__licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "GET"
        },

        // INTERNAL. Use Customer.licenses.destroyById() instead.
        "prototype$__destroyById__licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.licenses.updateById() instead.
        "prototype$__updateById__licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Customer.devices() instead.
        "prototype$__get__devices": {
          isArray: true,
          url: urlBase + "/Customers/:id/devices",
          method: "GET"
        },

        // INTERNAL. Use Customer.devices.create() instead.
        "prototype$__create__devices": {
          url: urlBase + "/Customers/:id/devices",
          method: "POST"
        },

        // INTERNAL. Use Customer.devices.destroyAll() instead.
        "prototype$__delete__devices": {
          url: urlBase + "/Customers/:id/devices",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.devices.count() instead.
        "prototype$__count__devices": {
          url: urlBase + "/Customers/:id/devices/count",
          method: "GET"
        },

        // INTERNAL. Use Customer.licenses() instead.
        "prototype$__get__licenses": {
          isArray: true,
          url: urlBase + "/Customers/:id/licenses",
          method: "GET"
        },

        // INTERNAL. Use Customer.licenses.create() instead.
        "prototype$__create__licenses": {
          url: urlBase + "/Customers/:id/licenses",
          method: "POST"
        },

        // INTERNAL. Use Customer.licenses.destroyAll() instead.
        "prototype$__delete__licenses": {
          url: urlBase + "/Customers/:id/licenses",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.licenses.count() instead.
        "prototype$__count__licenses": {
          url: urlBase + "/Customers/:id/licenses/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#create
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Customers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#createMany
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Customers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#upsert
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Customers",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#exists
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Customers/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#findById
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Customers/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#find
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Customers",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#findOne
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Customers/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#updateAll
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Customers/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#deleteById
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Customers/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#count
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Customers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#prototype$updateAttributes
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Customers/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#createChangeStream
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Customers/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Customer#getOwnership
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `id` – `{string}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `ownershipProperties` – `{Object=}` - 
         */
        "getOwnership": {
          url: urlBase + "/Customers/getOwnership",
          method: "POST"
        },

        // INTERNAL. Use Reseller.customers.findById() instead.
        "::findById::Reseller::customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "GET"
        },

        // INTERNAL. Use Reseller.customers.destroyById() instead.
        "::destroyById::Reseller::customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.customers.updateById() instead.
        "::updateById::Reseller::customers": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Resellers/:id/customers/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Reseller.customers() instead.
        "::get::Reseller::customers": {
          isArray: true,
          url: urlBase + "/Resellers/:id/customers",
          method: "GET"
        },

        // INTERNAL. Use Reseller.customers.create() instead.
        "::create::Reseller::customers": {
          url: urlBase + "/Resellers/:id/customers",
          method: "POST"
        },

        // INTERNAL. Use Reseller.customers.createMany() instead.
        "::createMany::Reseller::customers": {
          isArray: true,
          url: urlBase + "/Resellers/:id/customers",
          method: "POST"
        },

        // INTERNAL. Use Reseller.customers.destroyAll() instead.
        "::delete::Reseller::customers": {
          url: urlBase + "/Resellers/:id/customers",
          method: "DELETE"
        },

        // INTERNAL. Use Reseller.customers.count() instead.
        "::count::Reseller::customers": {
          url: urlBase + "/Resellers/:id/customers/count",
          method: "GET"
        },

        // INTERNAL. Use Device.customer() instead.
        "::get::Device::customer": {
          url: urlBase + "/Devices/:id/customer",
          method: "GET"
        },

        // INTERNAL. Use License.customer() instead.
        "::get::License::customer": {
          url: urlBase + "/Licenses/:id/customer",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Customer#updateOrCreate
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Customer#update
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Customer#destroyById
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Customer#removeById
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Customer#modelName
    * @propertyOf lbServices.Customer
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Customer`.
    */
    R.modelName = "Customer";


        /**
         * @ngdoc method
         * @name lbServices.Customer#reseller
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Fetches belongsTo relation reseller.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Reseller` object.)
         * </em>
         */
        R.reseller = function() {
          var TargetResource = $injector.get("Reseller");
          var action = TargetResource["::get::Customer::reseller"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Customer.softwareVersion
     * @header lbServices.Customer.softwareVersion
     * @object
     * @description
     *
     * The object `Customer.softwareVersion` groups methods
     * manipulating `SoftwareVersion` instances related to `Customer`.
     *
     * Call {@link lbServices.Customer#softwareVersion Customer.softwareVersion()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Customer#softwareVersion
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Fetches hasOne relation softwareVersion.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::get::Customer::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.softwareVersion#create
         * @methodOf lbServices.Customer.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.create = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::create::Customer::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.softwareVersion#createMany
         * @methodOf lbServices.Customer.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.createMany = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::createMany::Customer::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.softwareVersion#destroy
         * @methodOf lbServices.Customer.softwareVersion
         *
         * @description
         *
         * Deletes softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.softwareVersion.destroy = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::destroy::Customer::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.softwareVersion#update
         * @methodOf lbServices.Customer.softwareVersion
         *
         * @description
         *
         * Update softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.update = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::update::Customer::softwareVersion"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Customer.devices
     * @header lbServices.Customer.devices
     * @object
     * @description
     *
     * The object `Customer.devices` groups methods
     * manipulating `Device` instances related to `Customer`.
     *
     * Call {@link lbServices.Customer#devices Customer.devices()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Customer#devices
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Queries devices of Customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.devices = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::get::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#count
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Counts devices of Customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.devices.count = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::count::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#create
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Creates a new instance in devices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.devices.create = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::create::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#createMany
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Creates a new instance in devices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.devices.createMany = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::createMany::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#destroyAll
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Deletes all devices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.devices.destroyAll = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::delete::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#destroyById
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Delete a related item by id for devices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for devices
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.devices.destroyById = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::destroyById::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#findById
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Find a related item by id for devices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for devices
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.devices.findById = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::findById::Customer::devices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.devices#updateById
         * @methodOf lbServices.Customer.devices
         *
         * @description
         *
         * Update a related item by id for devices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for devices
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.devices.updateById = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::updateById::Customer::devices"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Customer.licenses
     * @header lbServices.Customer.licenses
     * @object
     * @description
     *
     * The object `Customer.licenses` groups methods
     * manipulating `License` instances related to `Customer`.
     *
     * Call {@link lbServices.Customer#licenses Customer.licenses()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Customer#licenses
         * @methodOf lbServices.Customer
         *
         * @description
         *
         * Queries licenses of Customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R.licenses = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::get::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#count
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Counts licenses of Customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.licenses.count = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::count::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#create
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Creates a new instance in licenses of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R.licenses.create = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::create::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#createMany
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Creates a new instance in licenses of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R.licenses.createMany = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::createMany::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#destroyAll
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Deletes all licenses of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.licenses.destroyAll = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::delete::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#destroyById
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Delete a related item by id for licenses.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for licenses
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.licenses.destroyById = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::destroyById::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#findById
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Find a related item by id for licenses.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for licenses
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R.licenses.findById = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::findById::Customer::licenses"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Customer.licenses#updateById
         * @methodOf lbServices.Customer.licenses
         *
         * @description
         *
         * Update a related item by id for licenses.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for licenses
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R.licenses.updateById = function() {
          var TargetResource = $injector.get("License");
          var action = TargetResource["::updateById::Customer::licenses"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Device
 * @header lbServices.Device
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Device` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Device",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Devices/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Device.customer() instead.
        "prototype$__get__customer": {
          url: urlBase + "/Devices/:id/customer",
          method: "GET"
        },

        // INTERNAL. Use Device.softwareVersion() instead.
        "prototype$__get__softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "GET"
        },

        // INTERNAL. Use Device.softwareVersion.create() instead.
        "prototype$__create__softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "POST"
        },

        // INTERNAL. Use Device.softwareVersion.update() instead.
        "prototype$__update__softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "PUT"
        },

        // INTERNAL. Use Device.softwareVersion.destroy() instead.
        "prototype$__destroy__softwareVersion": {
          url: urlBase + "/Devices/:id/softwareVersion",
          method: "DELETE"
        },

        // INTERNAL. Use Device.cameras.findById() instead.
        "prototype$__findById__cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.cameras.destroyById() instead.
        "prototype$__destroyById__cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.cameras.updateById() instead.
        "prototype$__updateById__cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.posDevices.findById() instead.
        "prototype$__findById__posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.posDevices.destroyById() instead.
        "prototype$__destroyById__posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.posDevices.updateById() instead.
        "prototype$__updateById__posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.logEntries.findById() instead.
        "prototype$__findById__logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries.destroyById() instead.
        "prototype$__destroyById__logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.logEntries.updateById() instead.
        "prototype$__updateById__logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.cameras() instead.
        "prototype$__get__cameras": {
          isArray: true,
          url: urlBase + "/Devices/:id/cameras",
          method: "GET"
        },

        // INTERNAL. Use Device.cameras.create() instead.
        "prototype$__create__cameras": {
          url: urlBase + "/Devices/:id/cameras",
          method: "POST"
        },

        // INTERNAL. Use Device.cameras.destroyAll() instead.
        "prototype$__delete__cameras": {
          url: urlBase + "/Devices/:id/cameras",
          method: "DELETE"
        },

        // INTERNAL. Use Device.cameras.count() instead.
        "prototype$__count__cameras": {
          url: urlBase + "/Devices/:id/cameras/count",
          method: "GET"
        },

        // INTERNAL. Use Device.posDevices() instead.
        "prototype$__get__posDevices": {
          isArray: true,
          url: urlBase + "/Devices/:id/posDevices",
          method: "GET"
        },

        // INTERNAL. Use Device.posDevices.create() instead.
        "prototype$__create__posDevices": {
          url: urlBase + "/Devices/:id/posDevices",
          method: "POST"
        },

        // INTERNAL. Use Device.posDevices.destroyAll() instead.
        "prototype$__delete__posDevices": {
          url: urlBase + "/Devices/:id/posDevices",
          method: "DELETE"
        },

        // INTERNAL. Use Device.posDevices.count() instead.
        "prototype$__count__posDevices": {
          url: urlBase + "/Devices/:id/posDevices/count",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries() instead.
        "prototype$__get__logEntries": {
          isArray: true,
          url: urlBase + "/Devices/:id/logEntries",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries.create() instead.
        "prototype$__create__logEntries": {
          url: urlBase + "/Devices/:id/logEntries",
          method: "POST"
        },

        // INTERNAL. Use Device.logEntries.destroyAll() instead.
        "prototype$__delete__logEntries": {
          url: urlBase + "/Devices/:id/logEntries",
          method: "DELETE"
        },

        // INTERNAL. Use Device.logEntries.count() instead.
        "prototype$__count__logEntries": {
          url: urlBase + "/Devices/:id/logEntries/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#create
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Devices",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#createMany
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Devices",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#upsert
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Devices",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#exists
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Devices/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#findById
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Devices/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#find
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Devices",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#findOne
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Devices/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#updateAll
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Devices/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#deleteById
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Devices/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#count
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Devices/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#prototype$updateAttributes
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Devices/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#createChangeStream
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Devices/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#checkin
         * @methodOf lbServices.Device
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `id` – `{string=}` - 
         *
         *  - `data` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        "checkin": {
          url: urlBase + "/Devices/:id/checkin",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Device#getOwnership
         * @methodOf lbServices.Device
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `id` – `{string}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `ownershipProperties` – `{Object=}` - 
         */
        "getOwnership": {
          url: urlBase + "/Devices/getOwnership",
          method: "POST"
        },

        // INTERNAL. Use Customer.devices.findById() instead.
        "::findById::Customer::devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "GET"
        },

        // INTERNAL. Use Customer.devices.destroyById() instead.
        "::destroyById::Customer::devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.devices.updateById() instead.
        "::updateById::Customer::devices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/devices/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Customer.devices() instead.
        "::get::Customer::devices": {
          isArray: true,
          url: urlBase + "/Customers/:id/devices",
          method: "GET"
        },

        // INTERNAL. Use Customer.devices.create() instead.
        "::create::Customer::devices": {
          url: urlBase + "/Customers/:id/devices",
          method: "POST"
        },

        // INTERNAL. Use Customer.devices.createMany() instead.
        "::createMany::Customer::devices": {
          isArray: true,
          url: urlBase + "/Customers/:id/devices",
          method: "POST"
        },

        // INTERNAL. Use Customer.devices.destroyAll() instead.
        "::delete::Customer::devices": {
          url: urlBase + "/Customers/:id/devices",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.devices.count() instead.
        "::count::Customer::devices": {
          url: urlBase + "/Customers/:id/devices/count",
          method: "GET"
        },

        // INTERNAL. Use Camera.device() instead.
        "::get::Camera::device": {
          url: urlBase + "/Cameras/:id/device",
          method: "GET"
        },

        // INTERNAL. Use POSDevice.device() instead.
        "::get::POSDevice::device": {
          url: urlBase + "/POSDevices/:id/device",
          method: "GET"
        },

        // INTERNAL. Use License.device() instead.
        "::get::License::device": {
          url: urlBase + "/Licenses/:id/device",
          method: "GET"
        },

        // INTERNAL. Use DeviceLogEntry.device() instead.
        "::get::DeviceLogEntry::device": {
          url: urlBase + "/DeviceLogEntries/:id/device",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Device#updateOrCreate
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Device#update
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Device#destroyById
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Device#removeById
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Device#modelName
    * @propertyOf lbServices.Device
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Device`.
    */
    R.modelName = "Device";


        /**
         * @ngdoc method
         * @name lbServices.Device#customer
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Fetches belongsTo relation customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customer = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::get::Device::customer"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Device.softwareVersion
     * @header lbServices.Device.softwareVersion
     * @object
     * @description
     *
     * The object `Device.softwareVersion` groups methods
     * manipulating `SoftwareVersion` instances related to `Device`.
     *
     * Call {@link lbServices.Device#softwareVersion Device.softwareVersion()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Device#softwareVersion
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Fetches hasOne relation softwareVersion.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::get::Device::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.softwareVersion#create
         * @methodOf lbServices.Device.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.create = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::create::Device::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.softwareVersion#createMany
         * @methodOf lbServices.Device.softwareVersion
         *
         * @description
         *
         * Creates a new instance in softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.createMany = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::createMany::Device::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.softwareVersion#destroy
         * @methodOf lbServices.Device.softwareVersion
         *
         * @description
         *
         * Deletes softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.softwareVersion.destroy = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::destroy::Device::softwareVersion"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.softwareVersion#update
         * @methodOf lbServices.Device.softwareVersion
         *
         * @description
         *
         * Update softwareVersion of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SoftwareVersion` object.)
         * </em>
         */
        R.softwareVersion.update = function() {
          var TargetResource = $injector.get("SoftwareVersion");
          var action = TargetResource["::update::Device::softwareVersion"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Device.cameras
     * @header lbServices.Device.cameras
     * @object
     * @description
     *
     * The object `Device.cameras` groups methods
     * manipulating `Camera` instances related to `Device`.
     *
     * Call {@link lbServices.Device#cameras Device.cameras()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Device#cameras
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Queries cameras of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R.cameras = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::get::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#count
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Counts cameras of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.cameras.count = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::count::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#create
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Creates a new instance in cameras of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R.cameras.create = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::create::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#createMany
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Creates a new instance in cameras of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R.cameras.createMany = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::createMany::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#destroyAll
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Deletes all cameras of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cameras.destroyAll = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::delete::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#destroyById
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Delete a related item by id for cameras.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cameras
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cameras.destroyById = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::destroyById::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#findById
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Find a related item by id for cameras.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cameras
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R.cameras.findById = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::findById::Device::cameras"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.cameras#updateById
         * @methodOf lbServices.Device.cameras
         *
         * @description
         *
         * Update a related item by id for cameras.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cameras
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R.cameras.updateById = function() {
          var TargetResource = $injector.get("Camera");
          var action = TargetResource["::updateById::Device::cameras"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Device.posDevices
     * @header lbServices.Device.posDevices
     * @object
     * @description
     *
     * The object `Device.posDevices` groups methods
     * manipulating `POSDevice` instances related to `Device`.
     *
     * Call {@link lbServices.Device#posDevices Device.posDevices()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Device#posDevices
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Queries posDevices of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R.posDevices = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::get::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#count
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Counts posDevices of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.posDevices.count = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::count::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#create
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Creates a new instance in posDevices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R.posDevices.create = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::create::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#createMany
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Creates a new instance in posDevices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R.posDevices.createMany = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::createMany::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#destroyAll
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Deletes all posDevices of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posDevices.destroyAll = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::delete::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#destroyById
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Delete a related item by id for posDevices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posDevices
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.posDevices.destroyById = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::destroyById::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#findById
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Find a related item by id for posDevices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posDevices
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R.posDevices.findById = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::findById::Device::posDevices"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.posDevices#updateById
         * @methodOf lbServices.Device.posDevices
         *
         * @description
         *
         * Update a related item by id for posDevices.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for posDevices
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R.posDevices.updateById = function() {
          var TargetResource = $injector.get("POSDevice");
          var action = TargetResource["::updateById::Device::posDevices"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Device.logEntries
     * @header lbServices.Device.logEntries
     * @object
     * @description
     *
     * The object `Device.logEntries` groups methods
     * manipulating `DeviceLogEntry` instances related to `Device`.
     *
     * Call {@link lbServices.Device#logEntries Device.logEntries()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Device#logEntries
         * @methodOf lbServices.Device
         *
         * @description
         *
         * Queries logEntries of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        R.logEntries = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::get::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#count
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Counts logEntries of Device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.logEntries.count = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::count::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#create
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Creates a new instance in logEntries of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        R.logEntries.create = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::create::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#createMany
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Creates a new instance in logEntries of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        R.logEntries.createMany = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::createMany::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#destroyAll
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Deletes all logEntries of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.logEntries.destroyAll = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::delete::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#destroyById
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Delete a related item by id for logEntries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for logEntries
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.logEntries.destroyById = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::destroyById::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#findById
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Find a related item by id for logEntries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for logEntries
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        R.logEntries.findById = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::findById::Device::logEntries"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Device.logEntries#updateById
         * @methodOf lbServices.Device.logEntries
         *
         * @description
         *
         * Update a related item by id for logEntries.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for logEntries
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        R.logEntries.updateById = function() {
          var TargetResource = $injector.get("DeviceLogEntry");
          var action = TargetResource["::updateById::Device::logEntries"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Camera
 * @header lbServices.Camera
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Camera` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Camera",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Cameras/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Camera.device() instead.
        "prototype$__get__device": {
          url: urlBase + "/Cameras/:id/device",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#create
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Cameras",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#createMany
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Cameras",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#upsert
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Cameras",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#exists
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Cameras/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#findById
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Cameras/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#find
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Cameras",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#findOne
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Cameras/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#updateAll
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Cameras/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#deleteById
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Cameras/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#count
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Cameras/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#prototype$updateAttributes
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Cameras/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Camera#createChangeStream
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Cameras/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Device.cameras.findById() instead.
        "::findById::Device::cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.cameras.destroyById() instead.
        "::destroyById::Device::cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.cameras.updateById() instead.
        "::updateById::Device::cameras": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/cameras/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.cameras() instead.
        "::get::Device::cameras": {
          isArray: true,
          url: urlBase + "/Devices/:id/cameras",
          method: "GET"
        },

        // INTERNAL. Use Device.cameras.create() instead.
        "::create::Device::cameras": {
          url: urlBase + "/Devices/:id/cameras",
          method: "POST"
        },

        // INTERNAL. Use Device.cameras.createMany() instead.
        "::createMany::Device::cameras": {
          isArray: true,
          url: urlBase + "/Devices/:id/cameras",
          method: "POST"
        },

        // INTERNAL. Use Device.cameras.destroyAll() instead.
        "::delete::Device::cameras": {
          url: urlBase + "/Devices/:id/cameras",
          method: "DELETE"
        },

        // INTERNAL. Use Device.cameras.count() instead.
        "::count::Device::cameras": {
          url: urlBase + "/Devices/:id/cameras/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Camera#updateOrCreate
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Camera` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Camera#update
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Camera#destroyById
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Camera#removeById
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Camera#modelName
    * @propertyOf lbServices.Camera
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Camera`.
    */
    R.modelName = "Camera";


        /**
         * @ngdoc method
         * @name lbServices.Camera#device
         * @methodOf lbServices.Camera
         *
         * @description
         *
         * Fetches belongsTo relation device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.device = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::get::Camera::device"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.POSDevice
 * @header lbServices.POSDevice
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `POSDevice` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "POSDevice",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/POSDevices/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use POSDevice.device() instead.
        "prototype$__get__device": {
          url: urlBase + "/POSDevices/:id/device",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#create
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/POSDevices",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#createMany
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/POSDevices",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#upsert
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/POSDevices",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#exists
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/POSDevices/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#findById
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/POSDevices/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#find
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/POSDevices",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#findOne
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/POSDevices/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#updateAll
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/POSDevices/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#deleteById
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/POSDevices/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#count
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/POSDevices/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#prototype$updateAttributes
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/POSDevices/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#createChangeStream
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/POSDevices/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Device.posDevices.findById() instead.
        "::findById::Device::posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.posDevices.destroyById() instead.
        "::destroyById::Device::posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.posDevices.updateById() instead.
        "::updateById::Device::posDevices": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/posDevices/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.posDevices() instead.
        "::get::Device::posDevices": {
          isArray: true,
          url: urlBase + "/Devices/:id/posDevices",
          method: "GET"
        },

        // INTERNAL. Use Device.posDevices.create() instead.
        "::create::Device::posDevices": {
          url: urlBase + "/Devices/:id/posDevices",
          method: "POST"
        },

        // INTERNAL. Use Device.posDevices.createMany() instead.
        "::createMany::Device::posDevices": {
          isArray: true,
          url: urlBase + "/Devices/:id/posDevices",
          method: "POST"
        },

        // INTERNAL. Use Device.posDevices.destroyAll() instead.
        "::delete::Device::posDevices": {
          url: urlBase + "/Devices/:id/posDevices",
          method: "DELETE"
        },

        // INTERNAL. Use Device.posDevices.count() instead.
        "::count::Device::posDevices": {
          url: urlBase + "/Devices/:id/posDevices/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.POSDevice#updateOrCreate
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `POSDevice` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#update
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#destroyById
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.POSDevice#removeById
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.POSDevice#modelName
    * @propertyOf lbServices.POSDevice
    * @description
    * The name of the model represented by this $resource,
    * i.e. `POSDevice`.
    */
    R.modelName = "POSDevice";


        /**
         * @ngdoc method
         * @name lbServices.POSDevice#device
         * @methodOf lbServices.POSDevice
         *
         * @description
         *
         * Fetches belongsTo relation device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.device = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::get::POSDevice::device"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.License
 * @header lbServices.License
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `License` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "License",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Licenses/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use License.device() instead.
        "prototype$__get__device": {
          url: urlBase + "/Licenses/:id/device",
          method: "GET"
        },

        // INTERNAL. Use License.customer() instead.
        "prototype$__get__customer": {
          url: urlBase + "/Licenses/:id/customer",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#create
         * @methodOf lbServices.License
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Licenses",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#createMany
         * @methodOf lbServices.License
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Licenses",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#upsert
         * @methodOf lbServices.License
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Licenses",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#exists
         * @methodOf lbServices.License
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Licenses/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#findById
         * @methodOf lbServices.License
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Licenses/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#find
         * @methodOf lbServices.License
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Licenses",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#findOne
         * @methodOf lbServices.License
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Licenses/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#updateAll
         * @methodOf lbServices.License
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/Licenses/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#deleteById
         * @methodOf lbServices.License
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/Licenses/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#count
         * @methodOf lbServices.License
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Licenses/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#prototype$updateAttributes
         * @methodOf lbServices.License
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Licenses/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#createChangeStream
         * @methodOf lbServices.License
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Licenses/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.License#activate
         * @methodOf lbServices.License
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `key` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        "activate": {
          url: urlBase + "/Licenses/activate",
          method: "POST"
        },

        // INTERNAL. Use Customer.licenses.findById() instead.
        "::findById::Customer::licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "GET"
        },

        // INTERNAL. Use Customer.licenses.destroyById() instead.
        "::destroyById::Customer::licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.licenses.updateById() instead.
        "::updateById::Customer::licenses": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Customers/:id/licenses/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Customer.licenses() instead.
        "::get::Customer::licenses": {
          isArray: true,
          url: urlBase + "/Customers/:id/licenses",
          method: "GET"
        },

        // INTERNAL. Use Customer.licenses.create() instead.
        "::create::Customer::licenses": {
          url: urlBase + "/Customers/:id/licenses",
          method: "POST"
        },

        // INTERNAL. Use Customer.licenses.createMany() instead.
        "::createMany::Customer::licenses": {
          isArray: true,
          url: urlBase + "/Customers/:id/licenses",
          method: "POST"
        },

        // INTERNAL. Use Customer.licenses.destroyAll() instead.
        "::delete::Customer::licenses": {
          url: urlBase + "/Customers/:id/licenses",
          method: "DELETE"
        },

        // INTERNAL. Use Customer.licenses.count() instead.
        "::count::Customer::licenses": {
          url: urlBase + "/Customers/:id/licenses/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.License#updateOrCreate
         * @methodOf lbServices.License
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `License` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.License#update
         * @methodOf lbServices.License
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.License#destroyById
         * @methodOf lbServices.License
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.License#removeById
         * @methodOf lbServices.License
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.License#modelName
    * @propertyOf lbServices.License
    * @description
    * The name of the model represented by this $resource,
    * i.e. `License`.
    */
    R.modelName = "License";


        /**
         * @ngdoc method
         * @name lbServices.License#device
         * @methodOf lbServices.License
         *
         * @description
         *
         * Fetches belongsTo relation device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.device = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::get::License::device"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.License#customer
         * @methodOf lbServices.License
         *
         * @description
         *
         * Fetches belongsTo relation customer.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Customer` object.)
         * </em>
         */
        R.customer = function() {
          var TargetResource = $injector.get("Customer");
          var action = TargetResource["::get::License::customer"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Auth
 * @header lbServices.Auth
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Auth` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Auth",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Auth/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Auth#validate
         * @methodOf lbServices.Auth
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `token` – `{string}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `response` – `{string=}` - 
         */
        "validate": {
          url: urlBase + "/Auth/validate",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Auth#login
         * @methodOf lbServices.Auth
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `username` – `{string=}` - 
         *
         *  - `password` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `response` – `{string=}` - 
         */
        "login": {
          url: urlBase + "/Auth/login",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name lbServices.Auth#modelName
    * @propertyOf lbServices.Auth
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Auth`.
    */
    R.modelName = "Auth";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.DeviceLogEntry
 * @header lbServices.DeviceLogEntry
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `DeviceLogEntry` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "DeviceLogEntry",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/DeviceLogEntries/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use DeviceLogEntry.device() instead.
        "prototype$__get__device": {
          url: urlBase + "/DeviceLogEntries/:id/device",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.DeviceLogEntry#exists
         * @methodOf lbServices.DeviceLogEntry
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/DeviceLogEntries/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.DeviceLogEntry#find
         * @methodOf lbServices.DeviceLogEntry
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/DeviceLogEntries",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.DeviceLogEntry#findOne
         * @methodOf lbServices.DeviceLogEntry
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DeviceLogEntry` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/DeviceLogEntries/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.DeviceLogEntry#count
         * @methodOf lbServices.DeviceLogEntry
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/DeviceLogEntries/count",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries.findById() instead.
        "::findById::Device::logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries.destroyById() instead.
        "::destroyById::Device::logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Device.logEntries.updateById() instead.
        "::updateById::Device::logEntries": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Devices/:id/logEntries/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Device.logEntries() instead.
        "::get::Device::logEntries": {
          isArray: true,
          url: urlBase + "/Devices/:id/logEntries",
          method: "GET"
        },

        // INTERNAL. Use Device.logEntries.create() instead.
        "::create::Device::logEntries": {
          url: urlBase + "/Devices/:id/logEntries",
          method: "POST"
        },

        // INTERNAL. Use Device.logEntries.createMany() instead.
        "::createMany::Device::logEntries": {
          isArray: true,
          url: urlBase + "/Devices/:id/logEntries",
          method: "POST"
        },

        // INTERNAL. Use Device.logEntries.destroyAll() instead.
        "::delete::Device::logEntries": {
          url: urlBase + "/Devices/:id/logEntries",
          method: "DELETE"
        },

        // INTERNAL. Use Device.logEntries.count() instead.
        "::count::Device::logEntries": {
          url: urlBase + "/Devices/:id/logEntries/count",
          method: "GET"
        },
      }
    );




    /**
    * @ngdoc property
    * @name lbServices.DeviceLogEntry#modelName
    * @propertyOf lbServices.DeviceLogEntry
    * @description
    * The name of the model represented by this $resource,
    * i.e. `DeviceLogEntry`.
    */
    R.modelName = "DeviceLogEntry";


        /**
         * @ngdoc method
         * @name lbServices.DeviceLogEntry#device
         * @methodOf lbServices.DeviceLogEntry
         *
         * @description
         *
         * Fetches belongsTo relation device.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Device` object.)
         * </em>
         */
        R.device = function() {
          var TargetResource = $injector.get("Device");
          var action = TargetResource["::get::DeviceLogEntry::device"];
          return action.apply(R, arguments);
        };

    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out non urlBase requests
          if (config.url.substr(0, urlBase.length) !== urlBase) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
