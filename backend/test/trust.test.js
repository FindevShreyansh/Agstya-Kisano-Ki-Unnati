const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateTrustScore, trustBand, trustExplanation } = require('../src/services/trust');

test('new farmers start neutral', () => {
  assert.equal(calculateTrustScore(), 0.5);
  assert.equal(trustBand(0.5), 'MEDIUM');
});

test('trust score is bounded and banded', () => {
  assert.equal(calculateTrustScore({ positiveEvents: 8, negativeEvents: 0 }), 0.9);
  assert.equal(trustBand(0.39), 'LOW');
  assert.equal(trustBand(0.74), 'MEDIUM');
  assert.equal(trustBand(0.75), 'HIGH');
});

test('trust explanation is plain language', () => {
  const explanation = trustExplanation({ positiveEvents: 3, negativeEvents: 1, score: 0.6667 });
  assert.equal(explanation.band, 'MEDIUM');
  assert.match(explanation.text, /3 successful order outcomes/);
});
