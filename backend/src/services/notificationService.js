const { admin, firestore } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');

/**
 * Sends a push notification via Firebase Cloud Messaging (when the target
 * user has a registered fcmToken) and always stores a record in Firestore
 * so the notification shows up in the user's in-app notification history,
 * even if the push delivery itself fails or the token is missing.
 */
async function sendNotification({ userId, title, body, data = {} }) {
  const notificationData = {
    userId,
    title,
    body,
    data,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await firestore.collection(COLLECTIONS.NOTIFICATIONS).add(notificationData);

  let pushResult = null;
  try {
    const userDoc = await firestore.collection(COLLECTIONS.USERS).doc(userId).get();
    const fcmToken = userDoc.exists ? userDoc.data().fcmToken : null;

    if (fcmToken) {
      pushResult = await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      });
    }
  } catch (err) {
    // Push delivery failures should not prevent the notification record
    // from being stored; log and continue.
    console.error('Failed to send FCM push notification:', err.message);
  }

  return { id: ref.id, ...notificationData, pushResult };
}

async function listNotificationsForUser(userId) {
  const snapshot = await firestore
    .collection(COLLECTIONS.NOTIFICATIONS)
    .where('userId', '==', userId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function markNotificationRead(id) {
  await firestore
    .collection(COLLECTIONS.NOTIFICATIONS)
    .doc(id)
    .set({ read: true }, { merge: true });
  const doc = await firestore.collection(COLLECTIONS.NOTIFICATIONS).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  sendNotification,
  listNotificationsForUser,
  markNotificationRead,
};
