"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";
import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date &&
    !task.status &&
    isPast(parseISO(task.due_date)) &&
    !isToday(parseISO(task.due_date));

  const isDueToday = task.due_date && isToday(parseISO(task.due_date));

  return (
    <div
      className={`group flex items-start gap-3 rounded-lg border p-4 transition-all hover:shadow-md ${
        task.status
          ? "border-border/30 bg-muted/30"
          : isOverdue
          ? "border-destructive/30 bg-destructive/5"
          : "border-border/50 bg-card"
      }`}
    >
      <Checkbox
        checked={task.status}
        onCheckedChange={() => onToggle(task)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`font-medium leading-snug ${
              task.status
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {task.title}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p
            className={`mt-1 text-sm leading-relaxed ${
              task.status ? "text-muted-foreground/60" : "text-muted-foreground"
            }`}
          >
            {task.description.length > 120
              ? `${task.description.slice(0, 120)}…`
              : task.description}
          </p>
        )}

        {task.due_date && (
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={
                task.status
                  ? "secondary"
                  : isOverdue
                  ? "destructive"
                  : isDueToday
                  ? "default"
                  : "outline"
              }
              className="text-xs"
            >
              <Calendar className="mr-1 h-3 w-3" />
              {isOverdue
                ? `Overdue · ${format(parseISO(task.due_date), "MMM d")}`
                : isDueToday
                ? "Due today"
                : format(parseISO(task.due_date), "MMM d, yyyy")}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
