import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:android_app/core/models/task.dart';
import 'package:android_app/features/dashboard/data/task_provider.dart';

class EditTaskSheet extends ConsumerStatefulWidget {
  final Task task;
  const EditTaskSheet({super.key, required this.task});

  @override
  ConsumerState<EditTaskSheet> createState() => _EditTaskSheetState();
}

class _EditTaskSheetState extends ConsumerState<EditTaskSheet> {
  late final TextEditingController _title;
  late final TextEditingController _desc;
  late DateTime? _dueDate;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _title = TextEditingController(text: widget.task.title);
    _desc = TextEditingController(text: widget.task.description ?? '');
    _dueDate = widget.task.dueDate;
  }

  @override
  void dispose() {
    _title.dispose();
    _desc.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF6366F1),
            onPrimary: Colors.white,
            surface: Color(0xFF1E293B),
            onSurface: Colors.white,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _dueDate = picked);
  }

  Future<void> _submit() async {
    final title = _title.text.trim();
    if (title.isEmpty) return;

    setState(() => _loading = true);
    final error = await ref
        .read(taskListProvider.notifier)
        .update(
          widget.task.id,
          title: title,
          description: _desc.text.trim(),
          due: _dueDate,
        );

    if (!mounted) return;
    if (error != null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(error)));
      setState(() => _loading = false);
    } else {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          Row(
            children: [
              const Icon(LucideIcons.edit3, size: 20, color: Color(0xFF6366F1)),
              const SizedBox(width: 8),
              Text(
                'Edit Task',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 20),

          TextFormField(
            controller: _title,
            style: const TextStyle(fontSize: 16),
            decoration: const InputDecoration(
              hintText: 'Task title',
              prefixIcon: Icon(LucideIcons.type, size: 18),
            ),
          ),
          const SizedBox(height: 14),

          TextFormField(
            controller: _desc,
            maxLines: 3,
            minLines: 1,
            decoration: const InputDecoration(
              hintText: 'Description (optional)',
              prefixIcon: Icon(LucideIcons.alignLeft, size: 18),
            ),
          ),
          const SizedBox(height: 16),

          GestureDetector(
            onTap: _pickDate,
            child: Chip(
              avatar: Icon(
                LucideIcons.calendar,
                size: 14,
                color: _dueDate != null
                    ? const Color(0xFF6366F1)
                    : Colors.white54,
              ),
              label: Text(
                _dueDate != null
                    ? DateFormat('MMM d, y').format(_dueDate!)
                    : 'Set due date',
              ),
              deleteIcon: _dueDate != null
                  ? const Icon(Icons.close, size: 14)
                  : null,
              onDeleted: _dueDate != null
                  ? () => setState(() => _dueDate = null)
                  : null,
            ),
          ),
          const SizedBox(height: 24),

          ElevatedButton(
            onPressed: _loading ? null : _submit,
            child: _loading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Text('Save Changes'),
          ),
        ],
      ),
    );
  }
}
