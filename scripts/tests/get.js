define(['conf'], function (conf) {
  var FEATURE = 'get';
  return {
    feature: FEATURE,
    probe: function(db, store) { return true },
    run: function(db, keys, callback) {
      var tx = db.transaction(conf.store, 'readonly');
      var store = tx.objectStore(conf.store);
      var count = 0;
      for (var i = 0; i < keys.length; ++i) {
        var req = store.get(keys[i]);
        req.onsuccess = function() {
          count += 1;
          if (count >= keys.length) {
            callback(FEATURE);
          }
        }
      }
    }
  }
});
