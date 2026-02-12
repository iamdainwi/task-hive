"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  ListTodo,
} from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Smart Task Management",
    description:
      "Create, organize, and track your tasks with an intuitive interface. Set due dates, mark progress, and stay on top of everything.",
  },
  {
    icon: Calendar,
    title: "Due Date Tracking",
    description:
      "Never miss a deadline. Visual due date indicators and overdue alerts keep you informed and accountable.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Get a bird's-eye view of your productivity with real-time stats showing completed, pending, and overdue tasks.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with JWT authentication and encrypted passwords. Only you can access your tasks.",
  },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Task Hive</span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? null : user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-chart-1/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-chart-2/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-chart-2" />
              Free & Open Source
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Organize your work,
              <br />
              <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-4 bg-clip-text text-transparent">
                amplify your focus
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Task Hive is a modern task management app that helps you stay
              organized, track deadlines, and boost productivity — all in one
              clean, distraction-free interface.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/register">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay productive
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features, beautifully simple.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get organized?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join Task Hive today and take control of your tasks.
          </p>
          <Button size="lg" className="mt-8 h-12 px-8 text-base" asChild>
            <Link href="/register">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>Task Hive</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js & shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
