"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { TaskCard } from "@/components/task-card";
import type { Task } from "@/lib/types";
import { toast } from "sonner";
import { isPast, isToday, parseISO } from "date-fns";
import {
  Search,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Inbox,
} from "lucide-react";

type FilterType = "all" | "active" | "completed" | "overdue";
type SortType = "newest" | "oldest" | "title" | "due-date";

export default function DashboardPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  // Edit / Delete dialog state
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      } else {
        setTasks([]);
      }
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Toggle task completion
  const toggleTask = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !task.status }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: !t.status } : t
          )
        );
        toast.success(
          task.status ? "Task marked as active" : "Task completed!"
        );
      }
    } catch {
      toast.error("Failed to update task");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status).length;
    const active = tasks.filter((t) => !t.status).length;
    const overdue = tasks.filter(
      (t) =>
        t.due_date &&
        !t.status &&
        isPast(parseISO(t.due_date)) &&
        !isToday(parseISO(t.due_date))
    ).length;
    return { total, completed, active, overdue };
  }, [tasks]);

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (filter) {
      case "active":
        result = result.filter((t) => !t.status);
        break;
      case "completed":
        result = result.filter((t) => t.status);
        break;
      case "overdue":
        result = result.filter(
          (t) =>
            t.due_date &&
            !t.status &&
            isPast(parseISO(t.due_date)) &&
            !isToday(parseISO(t.due_date))
        );
        break;
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "due-date":
        result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return (
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          );
        });
        break;
    }

    return result;
  }, [tasks, search, filter, sort]);

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: ListTodo,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Active",
      value: stats.active,
      icon: Clock,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-4 w-16" />
                  <Skeleton className="h-8 w-10" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => (
              <Card
                key={stat.label}
                className="border-border/40 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
                    >
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortType)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">By title</SelectItem>
              <SelectItem value="due-date">By due date</SelectItem>
            </SelectContent>
          </Select>

          <CreateTaskDialog onTaskCreated={fetchTasks} />
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterType)}
      >
        <TabsList>
          <TabsTrigger value="all">
            All
            {stats.total > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {stats.total}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            {stats.active > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {stats.active}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Done
            {stats.completed > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {stats.completed}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            {stats.overdue > 0 && (
              <span className="ml-1.5 text-xs text-destructive">
                {stats.overdue}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">
            {search
              ? "No matching tasks"
              : filter !== "all"
              ? `No ${filter} tasks`
              : "No tasks yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search query"
              : "Create your first task to get started!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={(t) => {
                setEditTask(t);
                setEditOpen(true);
              }}
              onDelete={(t) => {
                setDeleteTask(t);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <EditTaskDialog
        task={editTask}
        open={editOpen}
        onOpenChange={setEditOpen}
        onTaskUpdated={fetchTasks}
      />
      <DeleteTaskDialog
        task={deleteTask}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onTaskDeleted={fetchTasks}
      />
    </div>
  );
}
