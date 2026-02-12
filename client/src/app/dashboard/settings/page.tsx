"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Lock,
  Palette,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, token, logout, refreshUser } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Profile
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setProfileLoading(true);
    try {
      const body: Record<string, string> = {};
      if (name !== user?.name) body.name = name.trim();
      if (email !== user?.email) body.email = email.trim();

      if (Object.keys(body).length === 0) {
        toast.info("No changes to save");
        setProfileLoading(false);
        return;
      }

      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated!");
      await refreshUser();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account");
        return;
      }

      toast.success("Account deleted");
      logout();
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your name and email address.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Name</Label>
                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={profileLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={profileLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Set a new password for your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Separator />

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all your data. This action
                cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Delete your account?
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account and all your
                      tasks. This action cannot be undone. Type{" "}
                      <strong>DELETE</strong> to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder='Type "DELETE" to confirm'
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    disabled={deleteLoading}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteOpen(false);
                        setDeleteConfirm("");
                      }}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || deleteConfirm !== "DELETE"}
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting…
                        </>
                      ) : (
                        "Permanently Delete"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred color scheme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
