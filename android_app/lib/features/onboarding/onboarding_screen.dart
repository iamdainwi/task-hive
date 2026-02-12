import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF0F172A)],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              children: [
                const Spacer(flex: 2),

                // ── Logo ──
                Container(
                      width: 88,
                      height: 88,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF6366F1), Color(0xFF818CF8)],
                        ),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF6366F1).withAlpha(80),
                            blurRadius: 32,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(
                        LucideIcons.zap,
                        size: 42,
                        color: Colors.white,
                      ),
                    )
                    .animate()
                    .fadeIn(duration: 500.ms)
                    .scale(begin: const Offset(0.8, 0.8)),

                const SizedBox(height: 32),

                // ── Title ──
                Text(
                  'Task Hive',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -1,
                  ),
                ).animate().fadeIn(delay: 200.ms).moveY(begin: 20, end: 0),

                const SizedBox(height: 12),

                // ── Subtitle ──
                Text(
                  'Organize your work,\namplify your focus.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.white60,
                    height: 1.6,
                  ),
                ).animate().fadeIn(delay: 400.ms).moveY(begin: 20, end: 0),

                const SizedBox(height: 48),

                // ── Feature pills ──
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  alignment: WrapAlignment.center,
                  children: [
                    _FeaturePill(
                      icon: LucideIcons.checkCircle,
                      label: 'Smart Tasks',
                    ),
                    _FeaturePill(
                      icon: LucideIcons.calendar,
                      label: 'Due Dates',
                    ),
                    _FeaturePill(
                      icon: LucideIcons.barChart2,
                      label: 'Analytics',
                    ),
                    _FeaturePill(icon: LucideIcons.shield, label: 'Secure'),
                  ],
                ).animate().fadeIn(delay: 600.ms),

                const Spacer(flex: 3),

                // ── CTA Buttons ──
                ElevatedButton(
                  onPressed: () => context.go('/register'),
                  child: const Text('Get Started'),
                ).animate().fadeIn(delay: 800.ms).moveY(begin: 30, end: 0),

                const SizedBox(height: 12),

                OutlinedButton(
                  onPressed: () => context.go('/login'),
                  child: const Text('Sign In'),
                ).animate().fadeIn(delay: 900.ms).moveY(begin: 30, end: 0),

                const SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FeaturePill extends StatelessWidget {
  final IconData icon;
  final String label;
  const _FeaturePill({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(13),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withAlpha(20)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF818CF8)),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
