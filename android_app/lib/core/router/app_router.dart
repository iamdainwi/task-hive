import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/features/auth/data/auth_provider.dart';
import 'package:android_app/features/auth/presentation/login_screen.dart';
import 'package:android_app/features/auth/presentation/register_screen.dart';
import 'package:android_app/features/dashboard/presentation/dashboard_screen.dart';
import 'package:android_app/features/onboarding/onboarding_screen.dart';
import 'package:android_app/features/settings/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/onboarding',
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final onAuthRoute =
          state.uri.path == '/login' ||
          state.uri.path == '/register' ||
          state.uri.path == '/onboarding';

      // Still loading – don't redirect
      if (authState.isLoading) {
        return null;
      }

      if (!isLoggedIn && !onAuthRoute) {
        return '/onboarding';
      }
      if (isLoggedIn && onAuthRoute) {
        return '/dashboard';
      }
      if (state.uri.path == '/') {
        return isLoggedIn ? '/dashboard' : '/onboarding';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/onboarding',
        builder: (ctx, st) => const OnboardingScreen(),
      ),
      GoRoute(path: '/login', builder: (ctx, st) => const LoginScreen()),
      GoRoute(path: '/register', builder: (ctx, st) => const RegisterScreen()),
      GoRoute(
        path: '/dashboard',
        builder: (ctx, st) => const DashboardScreen(),
      ),
      GoRoute(path: '/settings', builder: (ctx, st) => const SettingsScreen()),
    ],
  );
});
