import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:android_app/core/models/task.dart';
import 'package:android_app/features/auth/data/auth_provider.dart';
import 'package:android_app/features/dashboard/data/task_provider.dart';
import 'widgets/task_card.dart';
import 'widgets/create_task_sheet.dart';
import 'widgets/edit_task_sheet.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});
  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  String _search = '';

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }

  List<Task> _filter(List<Task> tasks, int tab) {
    var list = tasks;
    if (_search.isNotEmpty) {
      list = list
          .where(
            (t) =>
                t.title.toLowerCase().contains(_search.toLowerCase()) ||
                (t.description ?? '').toLowerCase().contains(
                  _search.toLowerCase(),
                ),
          )
          .toList();
    }
    switch (tab) {
      case 1:
        return list.where((t) => !t.status).toList();
      case 2:
        return list.where((t) => t.status).toList();
      case 3:
        return list.where((t) => t.isOverdue).toList();
      default:
        return list;
    }
  }

  void _openCreate() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => const CreateTaskSheet(),
    );
  }

  void _openEdit(Task task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => EditTaskSheet(task: task),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).value;
    final tasksAsync = ref.watch(taskListProvider);

    return Scaffold(
      body: SafeArea(
        child: NestedScrollView(
          headerSliverBuilder: (context, _) => [
            // ── Header ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 22,
                      backgroundColor: Theme.of(context).primaryColor,
                      child: Text(
                        user?.initials ?? 'U',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hello, ${user?.firstName ?? 'there'} 👋',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Manage your tasks',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(LucideIcons.settings, size: 20),
                      onPressed: () => context.push('/settings'),
                    ),
                  ],
                ),
              ),
            ),

            // ── Stats ──
            SliverToBoxAdapter(
              child: tasksAsync.when(
                data: (tasks) => _StatsRow(tasks: tasks),
                loading: () => const SizedBox.shrink(),
                error: (_, _) => const SizedBox.shrink(),
              ),
            ),

            // ── Search ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
                child: TextField(
                  onChanged: (v) => setState(() => _search = v),
                  decoration: InputDecoration(
                    hintText: 'Search tasks…',
                    prefixIcon: const Icon(LucideIcons.search, size: 18),
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: const Color(0xFF1E293B),
                  ),
                ),
              ),
            ),

            // ── Tabs ──
            SliverPersistentHeader(
              pinned: true,
              delegate: _TabBarDelegate(
                TabBar(
                  controller: _tabCtrl,
                  isScrollable: true,
                  tabAlignment: TabAlignment.start,
                  dividerColor: Colors.transparent,
                  indicatorColor: Theme.of(context).primaryColor,
                  indicatorSize: TabBarIndicatorSize.label,
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.white54,
                  tabs: const [
                    Tab(text: 'All'),
                    Tab(text: 'Active'),
                    Tab(text: 'Done'),
                    Tab(text: 'Overdue'),
                  ],
                ),
              ),
            ),
          ],
          body: tasksAsync.when(
            data: (tasks) => TabBarView(
              controller: _tabCtrl,
              children: List.generate(4, (i) {
                final filtered = _filter(tasks, i);
                if (filtered.isEmpty) return _EmptyState(tabIndex: i);
                return RefreshIndicator(
                  onRefresh: () => ref.read(taskListProvider.notifier).load(),
                  color: Theme.of(context).primaryColor,
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
                    itemCount: filtered.length,
                    itemBuilder: (_, idx) => TaskCard(
                      task: filtered[idx],
                      onTap: () => _openEdit(filtered[idx]),
                    ),
                  ),
                );
              }),
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    LucideIcons.wifiOff,
                    size: 48,
                    color: Colors.white24,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Failed to load tasks',
                    style: TextStyle(color: Colors.white.withAlpha(100)),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () => ref.read(taskListProvider.notifier).load(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openCreate,
        icon: const Icon(LucideIcons.plus),
        label: const Text('New Task'),
      ),
    );
  }
}

// ── Stats Row ──
class _StatsRow extends StatelessWidget {
  final List<Task> tasks;
  const _StatsRow({required this.tasks});

  @override
  Widget build(BuildContext context) {
    final total = tasks.length;
    final done = tasks.where((t) => t.status).length;
    final active = total - done;
    final overdue = tasks.where((t) => t.isOverdue).length;

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
      child: Row(
        children: [
          _StatChip(
            value: '$total',
            label: 'Total',
            color: const Color(0xFF6366F1),
          ),
          const SizedBox(width: 10),
          _StatChip(
            value: '$active',
            label: 'Active',
            color: const Color(0xFF3B82F6),
          ),
          const SizedBox(width: 10),
          _StatChip(
            value: '$done',
            label: 'Done',
            color: const Color(0xFF22C55E),
          ),
          const SizedBox(width: 10),
          _StatChip(
            value: '$overdue',
            label: 'Overdue',
            color: const Color(0xFFEF4444),
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String value;
  final String label;
  final Color color;
  const _StatChip({
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withAlpha(18),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withAlpha(30)),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: color,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(fontSize: 11, color: color.withAlpha(180)),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Empty State ──
class _EmptyState extends StatelessWidget {
  final int tabIndex;
  const _EmptyState({required this.tabIndex});

  String get _msg {
    switch (tabIndex) {
      case 1:
        return 'No active tasks — enjoy the break!';
      case 2:
        return 'No completed tasks yet.';
      case 3:
        return 'No overdue tasks';
      default:
        return 'Tap + to create your first task.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(LucideIcons.inbox, size: 56, color: Colors.white.withAlpha(30)),
          const SizedBox(height: 12),
          Text(
            _msg,
            style: TextStyle(color: Colors.white.withAlpha(80), fontSize: 14),
          ),
        ],
      ),
    );
  }
}

// ── Persistent tab bar delegate ──
class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  _TabBarDelegate(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height;
  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(color: const Color(0xFF0F172A), child: tabBar);
  }

  @override
  bool shouldRebuild(covariant _TabBarDelegate oldDelegate) => false;
}
