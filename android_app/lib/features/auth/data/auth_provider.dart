import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:android_app/core/network/dio_client.dart';
import 'package:android_app/core/models/user.dart';
import 'auth_repository.dart';

const _kTokenKey = 'auth_token';

/// Holds the current authenticated [User] or null.
final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((
  ref,
) {
  return AuthNotifier(
    ref.read(authRepositoryProvider),
    ref.read(secureStorageProvider),
  );
});

class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  final AuthRepository _repo;
  final FlutterSecureStorage _storage;

  AuthNotifier(this._repo, this._storage) : super(const AsyncValue.loading()) {
    _init();
  }

  Future<void> _init() async {
    final token = await _storage.read(key: _kTokenKey);
    if (token == null || token.isEmpty) {
      state = const AsyncValue.data(null);
      return;
    }
    try {
      final user = await _repo.getProfile();
      state = AsyncValue.data(user);
    } catch (_) {
      await _storage.delete(key: _kTokenKey);
      state = const AsyncValue.data(null);
    }
  }

  /// Returns null on success, or an error message on failure.
  Future<String?> login(String email, String password) async {
    try {
      final token = await _repo.login(email, password);
      await _storage.write(key: _kTokenKey, value: token);
      final user = await _repo.getProfile();
      state = AsyncValue.data(user);
      return null;
    } catch (e) {
      // Don't set error state — keep state as data(null) so router stays put.
      return e.toString();
    }
  }

  Future<String?> register(String name, String email, String password) async {
    try {
      await _repo.register(name, email, password);
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<void> refreshUser() async {
    try {
      final user = await _repo.getProfile();
      state = AsyncValue.data(user);
    } catch (_) {}
  }

  Future<String?> updateProfile({
    String? name,
    String? email,
    String? password,
  }) async {
    try {
      await _repo.updateProfile(name: name, email: email, password: password);
      await refreshUser();
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> deleteAccount() async {
    try {
      await _repo.deleteAccount();
      await logout();
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: _kTokenKey);
    state = const AsyncValue.data(null);
  }
}
