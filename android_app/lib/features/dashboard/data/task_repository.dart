import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/core/network/dio_client.dart';
import 'package:android_app/core/models/task.dart';

final taskRepositoryProvider = Provider<TaskRepository>(
  (ref) => TaskRepository(ref.read(dioProvider)),
);

class TaskRepository {
  final Dio _dio;
  const TaskRepository(this._dio);

  Future<List<Task>> getAll() async {
    try {
      final res = await _dio.get('/task');
      final List data = res.data['tasks'];
      return data.map((e) => Task.fromJson(e)).toList();
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) return [];
      throw _err(e);
    }
  }

  Future<Task> create(
    String title,
    String? description,
    DateTime? dueDate,
  ) async {
    try {
      final body = <String, dynamic>{'title': title};
      if (description != null && description.isNotEmpty) {
        body['description'] = description;
      }
      if (dueDate != null) body['dueDate'] = dueDate.toIso8601String();

      final res = await _dio.post('/task', data: body);
      // API returns { message, task: [...] }
      final taskData = res.data['task'];
      if (taskData is List) return Task.fromJson(taskData.first);
      return Task.fromJson(taskData);
    } on DioException catch (e) {
      throw _err(e);
    }
  }

  Future<Task> update(
    String id, {
    String? title,
    String? description,
    bool? status,
    DateTime? dueDate,
  }) async {
    try {
      final body = <String, dynamic>{};
      if (title != null) body['title'] = title;
      if (description != null) body['description'] = description;
      if (status != null) body['status'] = status;
      if (dueDate != null) body['dueDate'] = dueDate.toIso8601String();

      final res = await _dio.put('/task/$id', data: body);
      // update returns the task object directly (not wrapped)
      return Task.fromJson(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _err(e);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/task/$id');
    } on DioException catch (e) {
      throw _err(e);
    }
  }

  String _err(DioException e) {
    final data = e.response?.data;
    if (data is Map) {
      return data['error']?.toString() ??
          data['message']?.toString() ??
          'Something went wrong';
    }
    return e.message ?? 'Network error';
  }
}
