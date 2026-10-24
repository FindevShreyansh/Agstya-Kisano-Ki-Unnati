const PRIOR_POSITIVE = 1;
const PRIOR_NEGATIVE = 1;

function calculateTrustScore({ positiveEvents = 0, negativeEvents = 0 } = {}) {
  const positive = Math.max(0, Number(positiveEvents) || 0);
  const negative = Math.max(0, Number(negativeEvents) || 0);
  const score = (PRIOR_POSITIVE + positive) / (PRIOR_POSITIVE + PRIOR_NEGATIVE + positive + negative);
  return Math.min(1, Math.max(0, Number(score.toFixed(4))));
}

function trustBand(score) {
  const value = Number(score) || 0;
  if (value < 0.4) return 'LOW';
  if (value < 0.75) return 'MEDIUM';
  return 'HIGH';
}

function trustExplanation({ positiveEvents = 0, negativeEvents = 0, score } = {}) {
  const positive = Number(positiveEvents) || 0;
  const negative = Number(negativeEvents) || 0;
  return {
    positiveEvents: positive,
    negativeEvents: negative,
    score: Number(score ?? calculateTrustScore({ positiveEvents: positive, negativeEvents: negative })),
    band: trustBand(score ?? calculateTrustScore({ positiveEvents: positive, negativeEvents: negative })),
    text: positive === 0 && negative === 0
      ? 'New farmer: starting with a neutral trust score.'
      : `${positive} successful order outcome${positive === 1 ? '' : 's'} and ${negative} farmer-attributed issue${negative === 1 ? '' : 's'}.`,
  };
}

module.exports = { calculateTrustScore, trustBand, trustExplanation };
