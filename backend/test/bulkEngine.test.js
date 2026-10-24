const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeQuantity, qualityMatches, allocateListings, buildPlans } = require('../src/services/bulkEngine');

test('normalizes quintals to kilograms', () => {
  assert.equal(normalizeQuantity(100, 'quintal'), 10000);
  assert.equal(normalizeQuantity(500, 'kg'), 500);
});

test('enforces ranked minimum quality', () => {
  assert.equal(qualityMatches('A', 'B'), true);
  assert.equal(qualityMatches('B', 'A'), false);
  assert.equal(qualityMatches('C', 'C'), true);
});

test('allocates only the requested amount across available listings', () => {
  const plan = allocateListings({
    quantityKg: 1000,
    maxFarmers: 3,
    planType: 'LOWEST_COST',
    listings: [
      { listingId: 1, farmerId: 1, farmerName: 'A', availableQuantityKg: 600, unitPrice: 20, distanceKm: 10, trustScore: 0.5 },
      { listingId: 2, farmerId: 2, farmerName: 'B', availableQuantityKg: 600, unitPrice: 25, distanceKm: 20, trustScore: 0.5 },
    ],
  });
  assert.equal(plan.allocatedQuantityKg, 1000);
  assert.equal(plan.remainingQuantityKg, 0);
  assert.deepEqual(plan.allocations.map((item) => item.quantityKg), [600, 400]);
});

test('rejects infeasible full fulfillment and supports explicit partial fulfillment', () => {
  const input = {
    quantityKg: 1000,
    maxFarmers: 2,
    listings: [{ listingId: 1, farmerId: 1, availableQuantityKg: 500, unitPrice: 20, distanceKm: 10, trustScore: 0.5 }],
  };
  assert.equal(allocateListings(input), null);
  assert.equal(allocateListings({ ...input, partialFulfillment: true }).allocatedQuantityKg, 500);
});

test('builds three plan perspectives', () => {
  const plans = buildPlans({
    quantityKg: 1000,
    maxFarmers: 3,
    listings: [
      { listingId: 1, farmerId: 1, availableQuantityKg: 600, unitPrice: 20, distanceKm: 10, trustScore: 0.5 },
      { listingId: 2, farmerId: 2, availableQuantityKg: 600, unitPrice: 25, distanceKm: 20, trustScore: 0.9 },
    ],
  });
  assert.deepEqual(plans.map((plan) => plan.planType), ['LOWEST_COST', 'BALANCED', 'FEWEST_FARMERS']);
});
