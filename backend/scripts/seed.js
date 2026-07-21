/**
 * Development seed script.
 *
 * Populates Firestore with demo data for local development/testing:
 *   - 1 admin user
 *   - 2 driver users + driver profiles
 *   - 5 parent users
 *   - 8 students linked to parents
 *   - 3 routes
 *   - 2 buses
 *
 * Requires Firebase Admin credentials to be available, either via the
 * FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY env
 * vars (see .env.example) or by setting GOOGLE_APPLICATION_CREDENTIALS to
 * point at a service account JSON file.
 *
 * Usage: npm run seed
 */
require('dotenv').config();

const { admin, firestore } = require('../src/config/firebase');
const { COLLECTIONS, ROLES } = require('../src/config/constants');

function timestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

async function seedUsers() {
  const created = { admins: [], drivers: [], parents: [] };

  const admins = [{ uid: 'demo-admin', email: 'admin@royal.com', name: 'Royal Admin' }];

  const drivers = [
    { uid: 'demo-driver-1', email: 'driver1@royal.com', name: 'James Driver' },
    { uid: 'demo-driver-2', email: 'driver2@royal.com', name: 'Maria Driver' },
  ];

  const parents = [
    { uid: 'demo-parent-1', email: 'parent1@royal.com', name: 'Alice Parent' },
    { uid: 'demo-parent-2', email: 'parent2@royal.com', name: 'Bob Parent' },
    { uid: 'demo-parent-3', email: 'parent3@royal.com', name: 'Carla Parent' },
    { uid: 'demo-parent-4', email: 'parent4@royal.com', name: 'David Parent' },
    { uid: 'demo-parent-5', email: 'parent5@royal.com', name: 'Elena Parent' },
  ];

  const batch = firestore.batch();

  for (const u of admins) {
    const ref = firestore.collection(COLLECTIONS.USERS).doc(u.uid);
    batch.set(ref, {
      uid: u.uid,
      email: u.email,
      name: u.name,
      role: ROLES.ADMIN,
      phone: null,
      fcmToken: null,
      createdAt: timestamp(),
    });
    created.admins.push(u.uid);
  }

  for (const u of drivers) {
    const ref = firestore.collection(COLLECTIONS.USERS).doc(u.uid);
    batch.set(ref, {
      uid: u.uid,
      email: u.email,
      name: u.name,
      role: ROLES.DRIVER,
      phone: null,
      fcmToken: null,
      createdAt: timestamp(),
    });
    created.drivers.push(u.uid);
  }

  for (const u of parents) {
    const ref = firestore.collection(COLLECTIONS.USERS).doc(u.uid);
    batch.set(ref, {
      uid: u.uid,
      email: u.email,
      name: u.name,
      role: ROLES.PARENT,
      phone: null,
      fcmToken: null,
      createdAt: timestamp(),
    });
    created.parents.push(u.uid);
  }

  await batch.commit();
  return created;
}

async function seedBuses() {
  const buses = [
    { id: 'demo-bus-1', registration: 'RTS-1001', capacity: 40, make: 'Blue Bird', model: 'Vision', year: 2021, status: 'active' },
    { id: 'demo-bus-2', registration: 'RTS-1002', capacity: 32, make: 'Thomas Built', model: 'Saf-T-Liner C2', year: 2020, status: 'active' },
  ];

  const batch = firestore.batch();
  for (const bus of buses) {
    const { id, ...data } = bus;
    batch.set(firestore.collection(COLLECTIONS.BUSES).doc(id), data);
  }
  await batch.commit();
  return buses.map((b) => b.id);
}

async function seedDriverProfiles(driverUserIds) {
  const profiles = [
    {
      id: 'demo-driver-profile-1',
      userId: driverUserIds[0],
      licenseNumber: 'DL-100001',
      vehicleId: 'demo-bus-1',
      rating: 4.8,
      status: 'active',
      assignedRoutes: [],
    },
    {
      id: 'demo-driver-profile-2',
      userId: driverUserIds[1],
      licenseNumber: 'DL-100002',
      vehicleId: 'demo-bus-2',
      rating: 4.6,
      status: 'active',
      assignedRoutes: [],
    },
  ];

  const batch = firestore.batch();
  for (const profile of profiles) {
    const { id, ...data } = profile;
    batch.set(firestore.collection(COLLECTIONS.DRIVERS).doc(id), data);
  }
  await batch.commit();
  return profiles.map((p) => p.id);
}

async function seedRoutes(driverProfileIds, busIds) {
  const routes = [
    {
      id: 'demo-route-1',
      name: 'North Loop',
      driverId: driverProfileIds[0],
      busId: busIds[0],
      stops: [
        { name: 'Maple St & 3rd Ave', latitude: 40.7128, longitude: -74.006 },
        { name: 'Oak St & 5th Ave', latitude: 40.7148, longitude: -74.008 },
      ],
      studentIds: [],
      status: 'idle',
      startTime: null,
      endTime: null,
    },
    {
      id: 'demo-route-2',
      name: 'South Loop',
      driverId: driverProfileIds[1],
      busId: busIds[1],
      stops: [
        { name: 'Pine St & 1st Ave', latitude: 40.71, longitude: -74.01 },
        { name: 'Cedar St & 2nd Ave', latitude: 40.712, longitude: -74.012 },
      ],
      studentIds: [],
      status: 'idle',
      startTime: null,
      endTime: null,
    },
    {
      id: 'demo-route-3',
      name: 'East Express',
      driverId: null,
      busId: null,
      stops: [{ name: 'Elm St & 4th Ave', latitude: 40.715, longitude: -74.002 }],
      studentIds: [],
      status: 'idle',
      startTime: null,
      endTime: null,
    },
  ];

  const batch = firestore.batch();
  for (const route of routes) {
    const { id, ...data } = route;
    batch.set(firestore.collection(COLLECTIONS.ROUTES).doc(id), data);
  }
  await batch.commit();
  return routes.map((r) => r.id);
}

async function seedStudents(parentUserIds, routeIds) {
  const students = [
    { id: 'demo-student-1', name: 'Sophia', parentId: parentUserIds[0], routeId: routeIds[0], grade: '3', school: 'Royal Elementary', seatNumber: 1, status: 'active' },
    { id: 'demo-student-2', name: 'Liam', parentId: parentUserIds[0], routeId: routeIds[0], grade: '5', school: 'Royal Elementary', seatNumber: 2, status: 'active' },
    { id: 'demo-student-3', name: 'Olivia', parentId: parentUserIds[1], routeId: routeIds[0], grade: '2', school: 'Royal Elementary', seatNumber: 3, status: 'active' },
    { id: 'demo-student-4', name: 'Noah', parentId: parentUserIds[1], routeId: routeIds[1], grade: '4', school: 'Royal Middle School', seatNumber: 1, status: 'active' },
    { id: 'demo-student-5', name: 'Emma', parentId: parentUserIds[2], routeId: routeIds[1], grade: '6', school: 'Royal Middle School', seatNumber: 2, status: 'active' },
    { id: 'demo-student-6', name: 'Ava', parentId: parentUserIds[3], routeId: routeIds[2], grade: '1', school: 'Royal Elementary', seatNumber: 1, status: 'active' },
    { id: 'demo-student-7', name: 'Ethan', parentId: parentUserIds[3], routeId: routeIds[2], grade: '3', school: 'Royal Elementary', seatNumber: 2, status: 'active' },
    { id: 'demo-student-8', name: 'Mia', parentId: parentUserIds[4], routeId: routeIds[2], grade: '5', school: 'Royal Middle School', seatNumber: 3, status: 'active' },
  ];

  const batch = firestore.batch();
  for (const student of students) {
    const { id, ...data } = student;
    batch.set(firestore.collection(COLLECTIONS.STUDENTS).doc(id), data);
  }
  await batch.commit();
  return students.map((s) => s.id);
}

async function main() {
  console.log('Seeding Royal Transportation System demo data...');
  console.log(
    'Make sure GOOGLE_APPLICATION_CREDENTIALS is set, or FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY are present in your environment (see .env.example).'
  );

  const users = await seedUsers();
  console.log(`Created ${users.admins.length} admin user(s):`, users.admins);
  console.log(`Created ${users.drivers.length} driver user(s):`, users.drivers);
  console.log(`Created ${users.parents.length} parent user(s):`, users.parents);

  const busIds = await seedBuses();
  console.log(`Created ${busIds.length} bus(es):`, busIds);

  const driverProfileIds = await seedDriverProfiles(users.drivers);
  console.log(`Created ${driverProfileIds.length} driver profile(s):`, driverProfileIds);

  const routeIds = await seedRoutes(driverProfileIds, busIds);
  console.log(`Created ${routeIds.length} route(s):`, routeIds);

  const studentIds = await seedStudents(users.parents, routeIds);
  console.log(`Created ${studentIds.length} student(s):`, studentIds);

  console.log('Seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
