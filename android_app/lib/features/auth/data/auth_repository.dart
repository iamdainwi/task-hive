import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/core/network/dio_client.dart';
import 'package:android_app/core/models/user.dart';

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(ref.read(dioProvider)),
);

class AuthRepository {
  final Dio _dio;
  const AuthRepository(this._dio);

  Future<String> login(String email, String password) async {
    try {
      final res = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return res.data['token'] as String;
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      await _dio.post(
        '/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  Future<User> getProfile() async {
    try {
      final res = await _dio.get('/user/me');
      return User.fromJson(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  Future<void> updateProfile({
    String? name,
    String? email,
    String? password,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (name != null) data['name'] = name;
      if (email != null) data['email'] = email;
      if (password != null) data['password'] = password;
      await _dio.put('/user/me', data: data);
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  Future<void> deleteAccount() async {
    try {
      await _dio.delete('/user/me');
    } on DioException catch (e) {
      throw _extractError(e);
    }
  }

  String _extractError(DioException e) {
    final data = e.response?.data;
    if (data is Map) {
      return data['error']?.toString() ??
          data['message']?.toString() ??
          'Something went wrong';
    }
    return e.message ?? 'Network error';
  }
}
