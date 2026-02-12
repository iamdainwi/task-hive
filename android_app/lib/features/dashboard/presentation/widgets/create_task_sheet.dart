import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:android_app/features/dashboard/data/task_provider.dart';

class CreateTaskSheet extends ConsumerStatefulWidget {
  const CreateTaskSheet({super.key});

  @override
  ConsumerState<CreateTaskSheet> createState() => _CreateTaskSheetState();
}

class _CreateTaskSheetState extends ConsumerState<CreateTaskSheet> {
  final _title = TextEditingController();
  final _desc = TextEditingController();
  DateTime? _dueDate;
  bool _loading = false;

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
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
        .create(
          title,
          _desc.text.trim().isEmpty ? null : _desc.text.trim(),
          _dueDate,
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
  void dispose() {
    _title.dispose();
    _desc.dispose();
    super.dispose();
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

          // Header
          Row(
            children: [
              const Icon(LucideIcons.plus, size: 20, color: Color(0xFF6366F1)),
              const SizedBox(width: 8),
              Text(
                'New Task',
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

          // Title
          TextFormField(
            controller: _title,
            autofocus: true,
            style: const TextStyle(fontSize: 16),
            decoration: const InputDecoration(
              hintText: 'What needs to be done?',
              prefixIcon: Icon(LucideIcons.type, size: 18),
            ),
          ),
          const SizedBox(height: 14),

          // Description
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

          // Due date chip
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

          // Submit
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
                : const Text('Create Task'),
          ),
        ],
      ),
    );
  }
}
