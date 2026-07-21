const { firestore } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');

async function listDrivers() {
  const snapshot = await firestore.collection(COLLECTIONS.DRIVERS).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createDriver(data) {
  const driverData = {
    userId: data.userId,
    licenseNumber: data.licenseNumber,
    vehicleId: data.vehicleId || null,
    rating: data.rating ?? null,
    status: data.status || 'inactive',
    assignedRoutes: data.assignedRoutes || [],
  };
  const ref = await firestore.collection(COLLECTIONS.DRIVERS).add(driverData);
  return { id: ref.id, ...driverData };
}

async function getDriverById(id) {
  const doc = await firestore.collection(COLLECTIONS.DRIVERS).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateDriver(id, updates) {
  await firestore.collection(COLLECTIONS.DRIVERS).doc(id).set(updates, { merge: true });
  return getDriverById(id);
}

async function getRoutesForDriverUser(userId) {
  const driverSnapshot = await firestore
    .collection(COLLECTIONS.DRIVERS)
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (driverSnapshot.empty) return [];

  const driverDoc = driverSnapshot.docs[0];
  const routesSnapshot = await firestore
    .collection(COLLECTIONS.ROUTES)
    .where('driverId', '==', driverDoc.id)
    .get();

  return routesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  listDrivers,
  createDriver,
  getDriverById,
  updateDriver,
  getRoutesForDriverUser,
};
