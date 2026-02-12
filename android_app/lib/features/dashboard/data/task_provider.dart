import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/core/models/task.dart';
import 'package:android_app/core/services/notification_service.dart';
import 'task_repository.dart';

final taskListProvider =
    StateNotifierProvider<TaskNotifier, AsyncValue<List<Task>>>((ref) {
      return TaskNotifier(ref.read(taskRepositoryProvider));
    });

class TaskNotifier extends StateNotifier<AsyncValue<List<Task>>> {
  final TaskRepository _repo;
  final _notif = NotificationService.instance;

  TaskNotifier(this._repo) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final tasks = await _repo.getAll();
      state = AsyncValue.data(tasks);
      // Re-schedule all notifications from fresh data
      _notif.rescheduleAll(tasks);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<String?> create(String title, String? desc, DateTime? due) async {
    try {
      final task = await _repo.create(title, desc, due);
      if (state.hasValue) {
        state = AsyncValue.data([task, ...state.value!]);
      }
      // Schedule notification for the new task
      _notif.scheduleForTask(task);
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> toggle(String id, bool status) async {
    _optimistic(id, (t) => t.copyWith(status: status));
    try {
      await _repo.update(id, status: status);
      // If completed, cancel its notification; if uncompleted, reschedule
      if (status) {
        _notif.cancelForTask(id);
      } else if (state.hasValue) {
        final task = state.value!.where((t) => t.id == id).firstOrNull;
        if (task != null) {
          _notif.scheduleForTask(task);
        }
      }
      return null;
    } catch (e) {
      await load();
      return e.toString();
    }
  }

  Future<String?> update(
    String id, {
    String? title,
    String? description,
    bool? status,
    DateTime? due,
  }) async {
    try {
      await _repo.update(
        id,
        title: title,
        description: description,
        status: status,
        dueDate: due,
      );
      await load(); // load() already reschedules all notifications
      return null;
    } catch (e) {
      return e.toString();
    }
  }

  Future<String?> delete(String id) async {
    final prev = state;
    if (state.hasValue) {
      state = AsyncValue.data(state.value!.where((t) => t.id != id).toList());
    }
    try {
      await _repo.delete(id);
      // Cancel notification for deleted task
      _notif.cancelForTask(id);
      return null;
    } catch (e) {
      state = prev;
      return e.toString();
    }
  }

  void _optimistic(String id, Task Function(Task) mutate) {
    if (!state.hasValue) return;
    final tasks = state.value!;
    final idx = tasks.indexWhere((t) => t.id == id);
    if (idx == -1) return;
    final updated = List<Task>.from(tasks)..[idx] = mutate(tasks[idx]);
    state = AsyncValue.data(updated);
  }
}
