"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import type { Task } from "@/lib/types";

interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskDeleted: () => void;
}

export function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskDeleted,
}: DeleteTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!task) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete task");
        return;
      }

      toast.success("Task deleted");
      onOpenChange(false);
      onTaskDeleted();
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
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete task
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{task?.title}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
