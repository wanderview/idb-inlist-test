define(['conf', 'tests', 'data'], function(conf, tests, data) {
  return function(callback) {
    tests.load(function() {
      var openReq = indexedDB.open(conf.db, data.version);
      openReq.onupgradeneeded = function(evt) {
        var db = openReq.result;
        var store = db.createObjectStore(conf.store, {autoIncrement: true});
        console.log(data.raw.length);
        for (var i in data.raw) {
          store.add(data.raw[i]);
        }
      };

      openReq.onsuccess = function(evt) {
        var db = openReq.result;
        var tx = db.transaction(conf.store, 'readonly');
        var store = tx.objectStore(conf.store);

        var supports = tests.probe(db, store);
        callback(null, db, supports);
      };

      openReq.onerror = function(evt) {
        callback(evt.target, null, null);
      };
    });
  }
});
