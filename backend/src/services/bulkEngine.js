const QUALITY_RANK = { C: 1, B: 2, A: 3 };

function normalizeQuantity(quantity, unit = 'kg') {
  const value = Number(quantity);
  if (!Number.isFinite(value) || value <= 0) throw new Error('Quantity must be greater than zero');
  return unit.toLowerCase() === 'quintal' ? value * 100 : value;
}

function qualityMatches(listingQuality, minimumQuality = 'C') {
  return (QUALITY_RANK[String(listingQuality).toUpperCase()] || 0) >= (QUALITY_RANK[String(minimumQuality).toUpperCase()] || 0);
}

function estimateDistanceKm(fromPlace, toPlace) {
  if (!fromPlace || !toPlace) return 0;
  const from = `${fromPlace.city || ''}|${fromPlace.district || ''}|${fromPlace.state || ''}`.toLowerCase();
  const to = `${toPlace.city || ''}|${toPlace.district || ''}|${toPlace.state || ''}`.toLowerCase();
  if (from === to) return 0;
  if (fromPlace.state && toPlace.state && fromPlace.state.toLowerCase() === toPlace.state.toLowerCase()) {
    if (fromPlace.district && toPlace.district && fromPlace.district.toLowerCase() === toPlace.district.toLowerCase()) return 35;
    return 120;
  }
  return 450;
}

function allocateListings({ listings, quantityKg, maxFarmers = 6, maxBudget = null, partialFulfillment = false, planType = 'BALANCED' }) {
  const candidates = listings
    .filter((listing) => Number(listing.availableQuantityKg) > 0)
    .map((listing) => ({
      ...listing,
      availableQuantityKg: Number(listing.availableQuantityKg),
      unitPrice: Number(listing.unitPrice),
      distanceKm: Number(listing.distanceKm) || 0,
      trustScore: Number(listing.trustScore ?? 0.5),
    }));

  if (planType === 'LOWEST_COST') candidates.sort((a, b) => a.unitPrice - b.unitPrice || a.distanceKm - b.distanceKm);
  if (planType === 'FEWEST_FARMERS') candidates.sort((a, b) => b.availableQuantityKg - a.availableQuantityKg || a.unitPrice - b.unitPrice);
  if (planType === 'BALANCED') candidates.sort((a, b) => {
    const scoreA = a.unitPrice + a.distanceKm * 0.15 - a.trustScore * 100;
    const scoreB = b.unitPrice + b.distanceKm * 0.15 - b.trustScore * 100;
    return scoreA - scoreB;
  });

  const allocations = [];
  let remaining = quantityKg;
  let produceSubtotal = 0;
  for (const listing of candidates) {
    if (remaining <= 0 || allocations.length >= maxFarmers) break;
    const quantity = Math.min(remaining, listing.availableQuantityKg);
    const subtotal = Number((quantity * listing.unitPrice).toFixed(2));
    if (maxBudget !== null && produceSubtotal + subtotal > Number(maxBudget)) continue;
    allocations.push({
      listingId: listing.listingId,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      quantityKg: quantity,
      unitPrice: listing.unitPrice,
      subtotal,
      distanceKm: listing.distanceKm,
      trustScore: listing.trustScore,
      trustBand: listing.trustBand,
    });
    remaining -= quantity;
    produceSubtotal += subtotal;
  }

  if (remaining > 0 && !partialFulfillment) return null;
  const totalDistance = allocations.reduce((sum, item) => sum + item.distanceKm, 0);
  const logisticsEstimate = Number((totalDistance * 2.5).toFixed(2));
  const totalCost = Number((produceSubtotal + logisticsEstimate).toFixed(2));
  return {
    planType,
    requestedQuantityKg: quantityKg,
    allocatedQuantityKg: quantityKg - remaining,
    remainingQuantityKg: remaining,
    farmerCount: allocations.length,
    produceSubtotal,
    logisticsEstimate,
    totalCost,
    allocations,
    score: Number((totalCost + allocations.length * 100 + totalDistance * 0.2 - allocations.reduce((sum, item) => sum + item.trustScore, 0) * 100).toFixed(2)),
  };
}

function buildPlans(input) {
  return ['LOWEST_COST', 'BALANCED', 'FEWEST_FARMERS']
    .map((planType) => allocateListings({ ...input, planType }))
    .filter(Boolean);
}

module.exports = { normalizeQuantity, qualityMatches, estimateDistanceKm, allocateListings, buildPlans };
