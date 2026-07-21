const { firestore } = require('../config/firebase');
const { COLLECTIONS, ROUTE_STATUS } = require('../config/constants');

async function listRoutes() {
  const snapshot = await firestore.collection(COLLECTIONS.ROUTES).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createRoute(data) {
  const routeData = {
    name: data.name,
    driverId: data.driverId || null,
    busId: data.busId || null,
    stops: data.stops || [],
    studentIds: data.studentIds || [],
    status: ROUTE_STATUS.IDLE,
    startTime: null,
    endTime: null,
  };
  const ref = await firestore.collection(COLLECTIONS.ROUTES).add(routeData);
  return { id: ref.id, ...routeData };
}

async function getRouteById(id) {
  const doc = await firestore.collection(COLLECTIONS.ROUTES).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateRoute(id, updates) {
  await firestore.collection(COLLECTIONS.ROUTES).doc(id).set(updates, { merge: true });
  return getRouteById(id);
}

async function deleteRoute(id) {
  await firestore.collection(COLLECTIONS.ROUTES).doc(id).delete();
  return true;
}

async function startRoute(id) {
  const updates = {
    status: ROUTE_STATUS.ACTIVE,
    startTime: new Date().toISOString(),
    endTime: null,
  };
  return updateRoute(id, updates);
}

async function stopRoute(id) {
  const updates = {
    status: ROUTE_STATUS.COMPLETED,
    endTime: new Date().toISOString(),
  };
  return updateRoute(id, updates);
}

async function assignDriver(id, driverId) {
  return updateRoute(id, { driverId });
}

async function assignStudents(id, studentIds) {
  return updateRoute(id, { studentIds });
}

module.exports = {
  listRoutes,
  createRoute,
  getRouteById,
  updateRoute,
  deleteRoute,
  startRoute,
  stopRoute,
  assignDriver,
  assignStudents,
};
