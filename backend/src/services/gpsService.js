const { firestore } = require('../config/firebase');
const { COLLECTIONS, LOCATION_STALE_MS } = require('../config/constants');

/**
 * Persists a location ping for a route. The document id is the routeId
 * itself so that "latest location" lookups are a simple doc get, while a
 * history entry is also appended to a per-route subcollection for
 * historical tracking / playback purposes.
 */
async function trackLocation({ routeId, latitude, longitude, accuracy, speed, heading, driverId }) {
  const timestamp = new Date().toISOString();
  const locationData = {
    routeId,
    latitude,
    longitude,
    accuracy: accuracy ?? null,
    speed: speed ?? null,
    heading: heading ?? null,
    timestamp,
    driverId: driverId ?? null,
  };

  const docRef = firestore.collection(COLLECTIONS.LOCATIONS).doc(routeId);
  await docRef.set(locationData, { merge: true });
  await docRef.collection('history').add(locationData);

  return locationData;
}

/**
 * Returns true when the given timestamp is older than the configured
 * staleness threshold (default 2 minutes).
 */
function isStaleLocation(timestamp, now = Date.now(), staleMs = LOCATION_STALE_MS) {
  if (!timestamp) return true;
  const locationTime = new Date(timestamp).getTime();
  if (Number.isNaN(locationTime)) return true;
  return now - locationTime > staleMs;
}

/**
 * Very simple placeholder ETA calculation. A full implementation would use
 * distance-to-next-stop plus recent speed/heading, or a routing API.
 * For now we return null when we don't have enough data to estimate.
 */
function estimateEta(location, destination) {
  if (!location || !destination || !location.speed || location.speed <= 0) {
    return null;
  }

  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(destination.latitude - location.latitude);
  const dLon = toRad(destination.longitude - location.longitude);
  const lat1 = toRad(location.latitude);
  const lat2 = toRad(destination.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = R * c;

  const speedMetersPerSecond = location.speed;
  const etaSeconds = Math.round(distanceMeters / speedMetersPerSecond);
  return etaSeconds;
}

async function getLatestLocation(routeId) {
  const doc = await firestore.collection(COLLECTIONS.LOCATIONS).doc(routeId).get();
  if (!doc.exists) return null;
  return doc.data();
}

module.exports = {
  trackLocation,
  isStaleLocation,
  estimateEta,
  getLatestLocation,
};
