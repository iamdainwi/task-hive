"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Tasks", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">Task Hive</span>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-border/40 bg-card/50 lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent pathname={pathname} />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold">
              {pathname === "/dashboard" && "Tasks"}
              {pathname === "/dashboard/settings" && "Settings"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
