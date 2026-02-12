import 'dart:async';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:android_app/core/models/task.dart';

/// Manages scheduling & cancelling local notifications for task due-dates.
class NotificationService {
  NotificationService._();
  static final instance = NotificationService._();

  final _plugin = FlutterLocalNotificationsPlugin();
  bool _initialised = false;

  /// Call once at app startup.
  Future<void> init() async {
    if (_initialised) return;

    tz.initializeTimeZones();

    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );
    const settings = InitializationSettings(android: androidSettings);

    await _plugin.initialize(settings);

    // Create the notification channel
    const channel = AndroidNotificationChannel(
      'task_due_reminders',
      'Task Due Reminders',
      description: 'Reminds you 1 hour before a task is due',
      importance: Importance.high,
    );

    await _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >()
        ?.createNotificationChannel(channel);

    _initialised = true;
  }

  /// Schedule a notification **1 hour before** [task.dueDate].
  /// Does nothing if the task has no due date, is already completed,
  /// or the notification time is already in the past.
  Future<void> scheduleForTask(Task task) async {
    if (task.dueDate == null || task.status) return;

    final fireAt = task.dueDate!.subtract(const Duration(hours: 1));
    if (fireAt.isBefore(DateTime.now())) return;

    final tzFireAt = tz.TZDateTime.from(fireAt, tz.local);

    await _plugin.zonedSchedule(
      task.id.hashCode, // unique int id derived from task UUID
      'Task due soon!',
      '"${task.title}" is due in 1 hour',
      tzFireAt,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'task_due_reminders',
          'Task Due Reminders',
          channelDescription: 'Reminds you 1 hour before a task is due',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
      ),
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      matchDateTimeComponents: null,
    );
  }

  /// Cancel the notification for a specific task.
  Future<void> cancelForTask(String taskId) async {
    await _plugin.cancel(taskId.hashCode);
  }

  /// Cancel all existing notifications, then re-schedule from fresh list.
  Future<void> rescheduleAll(List<Task> tasks) async {
    await _plugin.cancelAll();
    for (final task in tasks) {
      await scheduleForTask(task);
    }
  }
}
