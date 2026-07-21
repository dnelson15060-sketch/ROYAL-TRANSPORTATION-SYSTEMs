/**
 * Manual Jest mock for the firebase-admin package.
 *
 * Jest automatically substitutes this module whenever test files (or code
 * they import) `require('firebase-admin')`, so no network calls or real
 * credentials are ever needed while running the test suite.
 */

function createDocMock() {
  return {
    get: jest.fn().mockResolvedValue({ exists: false, data: () => undefined }),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    collection: jest.fn(() => createCollectionMock()),
  };
}

function createCollectionMock() {
  const collection = {
    doc: jest.fn(() => createDocMock()),
    add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    where: jest.fn(() => collection),
    get: jest.fn().mockResolvedValue({ docs: [], empty: true }),
  };
  return collection;
}

const firestoreMock = jest.fn(() => ({
  collection: jest.fn(() => createCollectionMock()),
  batch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  })),
}));

firestoreMock.FieldValue = {
  serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
};

const authMock = jest.fn(() => ({
  verifyIdToken: jest.fn().mockResolvedValue({ uid: 'mock-uid', email: 'mock@example.com' }),
  createUser: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
  getUser: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
}));

const messagingMock = jest.fn(() => ({
  send: jest.fn().mockResolvedValue('mock-message-id'),
}));

module.exports = {
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn(),
  },
  auth: authMock,
  firestore: firestoreMock,
  messaging: messagingMock,
};
