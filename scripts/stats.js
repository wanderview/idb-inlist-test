define(function() {
  return function(samples) {
    samples.sort();

    var total = 0;
    var median = 0;
    var medianIndex = Math.floor(samples.length / 2) - 1;
    var averageMedian = (medianIndex === (samples.length / 2) - 1);
    for (var i = 0; i < samples.length; ++i) {
      if (i === medianIndex) {
        median = samples[i];
      } else if (i === (medianIndex + 1) && averageMedian) {
        median += samples[i];
        median = Math.round(median / 2);
      }
      total += samples[i];
    }
    var mean = Math.round(total / samples.length);

    var sumOfSquaresOfDiffs = 0;
    for (var i in samples) {
      sumOfSquaresOfDiffs += Math.pow(samples[i] - mean, 2);
    }
    var variance = sumOfSquaresOfDiffs / (samples.length - 1);
    var stddev = Math.round(Math.sqrt(variance));

    var min = Math.min.apply(null, samples);
    var max = Math.max.apply(null, samples);

    return {
      min: min,
      median: median,
      mean: mean,
      max: max,
      stddev: stddev
    };
  };
});
