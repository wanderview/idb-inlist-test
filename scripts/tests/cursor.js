define(['conf'], function (conf) {
  var FEATURE = 'cursor';
  return {
    feature: FEATURE,
    probe: function(db, store) { return true },
    run: function(db, keys, callback) {
      keys.sort(indexedDB.cmp.bind(indexedDB));
      var tx = db.transaction(conf.store, 'readonly');
      var store = tx.objectStore(conf.store);
      var keyRange = IDBKeyRange.bound(keys[0], keys[keys.length-1]);
      var req = store.openCursor(keyRange);
      req.onsuccess = function() {
        var cursor = req.result;
        if (cursor) {
          while(keys.length && indexedDB.cmp(keys[0], cursor.key) <= 0) {
            keys.shift();
          }
          if (keys.length) {
            cursor.continue(keys[0]);
          } else {
            callback(FEATURE);
          }
        }
      };
    }
  }
});
