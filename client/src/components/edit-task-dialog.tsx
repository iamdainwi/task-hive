"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.due_date ? parseISO(task.due_date) : undefined);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update task");
        return;
      }

      toast.success("Task updated!");
      onOpenChange(false);
      onTaskUpdated();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Update your task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description (optional)</Label>
            <Textarea
              id="edit-desc"
              placeholder="Add more details…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
