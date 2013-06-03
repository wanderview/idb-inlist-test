define(['conf'], function (conf) {
  var FEATURE = 'getAll';
  return {
    feature: FEATURE,
    probe: function(db, store) { return !!(store.getAll || store.mozGetAll) },
    run: function(db, keys, callback) {
      var tx = db.transaction(conf.store, 'readonly');
      var store = tx.objectStore(conf.store);
      var req = store.mozGetAll();
      req.onsuccess = function() {
        callback(FEATURE);
      }
    }
  }
});
