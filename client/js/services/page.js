angular.module('app').factory('Page', function() {
    var title = 'Solink Call Home';
    var navPath = '';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = 'Solink Call Home - ' + newTitle; },
      navPath: function() { return navPath; },
      setNavPath: function(newNavPath) { navPath = newNavPath; }
    };
  })