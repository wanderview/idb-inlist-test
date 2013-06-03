define(['conf', 'data'], function(conf, data) {
  var _tests = {};

  var _genKeys = function () {
    var keys = [];
    var used = [];
    for (var i = 0; i < conf.numKeys; ++i) {
      var index = -1;
      do {
        index = Math.floor((Math.random() * (data.raw.length + 1)));
      } while(used[index]);
      used[index] = true;
      keys.push(index);
    }
    return keys;
  };

  return {
    load: function(callback) {
      var loaded = 0;
      for (var i in conf.tests) {
        var feature = conf.tests[i];
        require([conf.testPrefix + feature], function(test) {
          _tests[test.feature] = test;
          loaded += 1;
          if (loaded >= conf.tests.length) {
            callback();
          }
        });
      }
    },

    probe: function(db, store) {
      var supports = {};
      for (var i in conf.tests) {
        var feature = conf.tests[i];
        var t = _tests[feature];
        supports[feature] = t ? t.probe(db, store) : false;
      }
      return supports;
    },

    run: function(db, supports, callback) {
      var toRun = [];
      var results = {};

      for (var feature in supports) {
        if (!supports[feature]) {
          continue;
        }
        var t = _tests[feature];
        if (!t) {
          results[feature] = null;
        }
        results[feature] = [];
        toRun.push(t);
      }

      var keys = _genKeys();

      var lastTest = null;
      var iterations = 0;
      var sets = 0;
      var startTime = null;
      var _nextTest = function(feature) {
        // Move on to next set of iterations for this test
        if (iterations < 1) {
          // Store results for this set
          if (feature) {
            results[feature].push(Date.now() - startTime);
          }
          // Move on to next test
          if (sets < 1) {
            lastTest = toRun.shift();
            if (!lastTest) {
              callback(results);
              return;
            }
            console.log("Start tests for " + lastTest.feature);
            sets = conf.sets;
          }
          // Each set of iterations runs in a nextTick() to reduce chance
          // of blowing the stack for large iteration/set configurations.
          setTimeout(function() {
            sets -= 1;
            iterations = conf.iterations;
            startTime = Date.now();
            _nextTest();
          }, 0);
          return;
        }
        iterations -= 1;
        lastTest.run(db, keys.slice(), _nextTest);
      };
      _nextTest();
    }
  };
});
