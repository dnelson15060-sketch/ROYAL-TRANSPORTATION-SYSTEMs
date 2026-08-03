import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:royal_transportation/services/auth_service.dart';

class MockFirebaseAuth extends Mock implements FirebaseAuth {}

class MockFirebaseFirestore extends Mock implements FirebaseFirestore {}

class MockUser extends Mock implements User {}

void main() {
  late MockFirebaseAuth mockFirebaseAuth;
  late MockFirebaseFirestore mockFirestore;
  late AuthService authService;

  setUp(() {
    mockFirebaseAuth = MockFirebaseAuth();
    mockFirestore = MockFirebaseFirestore();
    authService = AuthService(
      firebaseAuth: mockFirebaseAuth,
      firestore: mockFirestore,
    );
  });

  group('AuthService.signOut', () {
    test('calls FirebaseAuth.signOut', () async {
      when(mockFirebaseAuth.signOut()).thenAnswer((_) async {});

      await authService.signOut();

      verify(mockFirebaseAuth.signOut()).called(1);
    });
  });

  group('AuthService.isLoggedIn', () {
    test('returns false when currentUser is null', () {
      when(mockFirebaseAuth.currentUser).thenReturn(null);

      expect(authService.isLoggedIn, isFalse);
    });

    test('returns true when currentUser is not null', () {
      when(mockFirebaseAuth.currentUser).thenReturn(MockUser());

      expect(authService.isLoggedIn, isTrue);
    });
  });
}
