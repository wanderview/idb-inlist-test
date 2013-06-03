define(['conf'], function (conf) {
  var FEATURE = 'inListCursor';
  return {
    feature: FEATURE,
    probe: function(db, store) { return !!IDBKeyRange.inList },
    run: function(db, keys, callback) {
      var tx = db.transaction(conf.store, 'readonly');
      var store = tx.objectStore(conf.store);
      var keyRange = IDBKeyRange.inList(keys);
      var req = store.openCursor(keyRange);
      var count = 0;
      req.onsuccess = function() {
        var cursor = req.result;
        if (cursor) {
          count += 1;
          if (count >= keys.length) {
            callback(FEATURE);
            return;
          }
          cursor.continue();
        }
      };
    }
  }
});
