const { firestore } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');

async function listStudents(filters = {}) {
  let query = firestore.collection(COLLECTIONS.STUDENTS);
  if (filters.parentId) {
    query = query.where('parentId', '==', filters.parentId);
  }
  if (filters.routeId) {
    query = query.where('routeId', '==', filters.routeId);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createStudent(data) {
  const studentData = {
    name: data.name,
    parentId: data.parentId,
    routeId: data.routeId || null,
    grade: data.grade || null,
    school: data.school || null,
    seatNumber: data.seatNumber || null,
    status: data.status || 'active',
  };
  const ref = await firestore.collection(COLLECTIONS.STUDENTS).add(studentData);
  return { id: ref.id, ...studentData };
}

async function getStudentById(id) {
  const doc = await firestore.collection(COLLECTIONS.STUDENTS).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateStudent(id, updates) {
  await firestore.collection(COLLECTIONS.STUDENTS).doc(id).set(updates, { merge: true });
  return getStudentById(id);
}

async function deleteStudent(id) {
  await firestore.collection(COLLECTIONS.STUDENTS).doc(id).delete();
  return true;
}

module.exports = {
  listStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
};
