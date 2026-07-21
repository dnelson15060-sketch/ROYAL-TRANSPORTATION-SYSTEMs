const { firestore } = require('../config/firebase');
const { COLLECTIONS, ROLES } = require('../config/constants');

async function getUserByUid(uid) {
  const doc = await firestore.collection(COLLECTIONS.USERS).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

async function updateUser(uid, updates) {
  const allowed = ['name', 'phone', 'fcmToken'];
  const sanitized = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      sanitized[key] = updates[key];
    }
  }
  await firestore.collection(COLLECTIONS.USERS).doc(uid).set(sanitized, { merge: true });
  return getUserByUid(uid);
}

async function listUsers({ role } = {}) {
  let query = firestore.collection(COLLECTIONS.USERS);
  if (role) {
    query = query.where('role', '==', role);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data());
}

async function getChildrenForParent(parentId) {
  const snapshot = await firestore
    .collection(COLLECTIONS.STUDENTS)
    .where('parentId', '==', parentId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  getUserByUid,
  updateUser,
  listUsers,
  getChildrenForParent,
  ROLES,
};
