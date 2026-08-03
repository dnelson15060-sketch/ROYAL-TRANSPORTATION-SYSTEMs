const { firestore } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');

function attendanceDocId(routeId, studentId, date) {
  return `${routeId}_${studentId}_${date}`;
}

async function markAttendance({ routeId, studentId, date, status, markedBy }) {
  const record = {
    routeId,
    studentId,
    date,
    status,
    markedAt: new Date().toISOString(),
    markedBy,
  };
  const id = attendanceDocId(routeId, studentId, date);
  await firestore.collection(COLLECTIONS.ATTENDANCE).doc(id).set(record, { merge: true });
  return { id, ...record };
}

async function getAttendanceForRouteAndDate(routeId, date) {
  const snapshot = await firestore
    .collection(COLLECTIONS.ATTENDANCE)
    .where('routeId', '==', routeId)
    .where('date', '==', date)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getAttendanceForStudent(studentId) {
  const snapshot = await firestore
    .collection(COLLECTIONS.ATTENDANCE)
    .where('studentId', '==', studentId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  markAttendance,
  getAttendanceForRouteAndDate,
  getAttendanceForStudent,
};
