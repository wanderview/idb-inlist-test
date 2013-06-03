define(['conf'], function (conf) {
  var FEATURE = 'inList';
  return {
    feature: FEATURE,
    probe: function(db, store) { return !!IDBKeyRange.inList },
    run: function(db, keys, callback) {
      var tx = db.transaction(conf.store, 'readonly');
      var store = tx.objectStore(conf.store);
      var keyRange = IDBKeyRange.inList(keys);
      var req = store.mozGetAll(keyRange);
      req.onsuccess = function() {
        callback(FEATURE);
      }
    }
  }
});
