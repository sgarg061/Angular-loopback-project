(function() {
  angular.module('socket', [])
  .factory('socket', function ($rootScope, $window, $localStorage) {
    var socketOptions = {
      transports: ['websocket'],
      'forceNew': true,
      'secure': false,
      query: 'token=' + $localStorage.token
    };

    var socket = io.connect($window.location.origin, socketOptions);

    return {
      on: function (channel, cb) {
        socket.on(channel, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            cb.apply(socket, args);
          });
        });
      },

      emit: function (channel, data, cb) {
        socket.emit(channel, data, function() {
          var args = arguments;
          $rootScope.$apply(function () {
            if (cb) {
              cb.apply(socket, args);
            }
          });
        });
      }
    };
  });
})();