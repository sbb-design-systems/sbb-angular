(function() {
  var globalObject = (function() {
    if (typeof global !== 'undefined' && typeof global !== 'function') {
      // global spec defines a reference to the global object called 'global'
      // //github.com/tc39/proposal-global
      // `global` is also defined in NodeJS
      return global;
    } else if (typeof window !== 'undefined') {
      // window is defined in browsers
      return window;
    } else if (typeof self !== 'undefined') {
      // self is defined in WebWorkers
      return self;
    }
    return this;
  })();

  if (globalObject.require) {
    var isArray = function(it) {
      return toString.call(it) == '[object Array]';
    };
    var forEach = function(vector, callback) {
      if (vector) {
        for (var i = 0; i < vector.length; ) {
          callback(vector[i++]);
        }
      }
    };
    var listenerQueues = {};
    globalObject.require.signal = function(type, args) {
      var queue = listenerQueues[type];
      // notice we run a copy of the queue; this allows listeners to add/remove
      // other listeners without affecting this particular signal
      forEach(queue && queue.slice(0), function(listener) {
        listener.apply(null, isArray(args) ? args : [args]);
      });
    };
    globalObject.require.on = function(type, listener) {
      // notice a queue is not created until a client actually connects
      var queue = listenerQueues[type] || (listenerQueues[type] = []);
      queue.push(listener);
      return {
        remove: function() {
          for (var i = 0; i < queue.length; i++) {
            if (queue[i] === listener) {
              queue.splice(i, 1);
              return;
            }
          }
        }
      };
    };
    globalObject.require.config({
      paths: {
        leaflet: '//unpkg.com/leaflet@1.6.0/dist/leaflet-src.js/leaflet'
      }
    });
  }
})();
