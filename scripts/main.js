var deps = ['init', 'conf', 'data', 'tests', 'stats', 'domReady!'];
require(deps, function(init, conf, data, tests, stats, doc) {
  init(function(error, db, supports) {
    var start = doc.getElementById('start-button');
    var running = doc.getElementById('output-running');
    var resultsTable = doc.getElementById('output-results');

    var confTests = doc.getElementById('conf-tests');
    var confDBSize = doc.getElementById('conf-dbsize');
    var confSets = doc.getElementById('conf-sets');
    var confIter = doc.getElementById('conf-iterations');
    var confKeys = doc.getElementById('conf-keys');

    confTests.textContent = conf.tests.join(', ');
    confDBSize.textContent = data.raw.length;
    confSets.textContent = conf.sets;
    confIter.textContent = conf.iterations;
    confKeys.textContent = conf.numKeys;

    start.addEventListener('click', function() {
      resultsTable.classList.add('hidden');
      running.classList.remove('hidden');
      tests.run(db, supports, function(results) {
        for (var feature in results) {
          var s = stats(results[feature]);
          var row = doc.getElementById('results-' + feature);
          row.children[1].textContent = s.min;
          row.children[2].textContent = s.median;
          row.children[3].textContent = s.mean;
          row.children[4].textContent = s.max;
          row.children[5].textContent = s.stddev;
        }
        running.classList.add('hidden');
        resultsTable.classList.remove('hidden');
      });
    });
  });
});
