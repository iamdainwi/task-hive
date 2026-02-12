class Task {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final bool status;
  final DateTime? dueDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Task({
    required this.id,
    required this.userId,
    required this.title,
    this.description,
    required this.status,
    this.dueDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Task.fromJson(Map<String, dynamic> json) => Task(
    id: json['id'] as String,
    userId: json['user_id'] as String,
    title: json['title'] as String,
    description: json['description'] as String?,
    status: json['status'] as bool? ?? false,
    dueDate: json['due_date'] != null
        ? DateTime.tryParse(json['due_date'].toString())
        : null,
    createdAt: DateTime.parse(json['created_at'].toString()),
    updatedAt: DateTime.parse(json['updated_at'].toString()),
  );

  Task copyWith({
    String? title,
    String? description,
    bool? status,
    DateTime? dueDate,
  }) => Task(
    id: id,
    userId: userId,
    title: title ?? this.title,
    description: description ?? this.description,
    status: status ?? this.status,
    dueDate: dueDate ?? this.dueDate,
    createdAt: createdAt,
    updatedAt: DateTime.now(),
  );

  bool get isOverdue =>
      !status && dueDate != null && dueDate!.isBefore(DateTime.now());

  bool get isDueToday {
    if (dueDate == null) return false;
    final now = DateTime.now();
    return dueDate!.year == now.year &&
        dueDate!.month == now.month &&
        dueDate!.day == now.day;
  }

  bool get isDueSoon {
    if (dueDate == null || status) return false;
    final diff = dueDate!.difference(DateTime.now()).inDays;
    return diff >= 0 && diff <= 2;
  }
}
