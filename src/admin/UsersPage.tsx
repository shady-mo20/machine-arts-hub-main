import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRow {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "developer";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: UserRow[];
}

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "developer" as "admin" | "developer",
  status: "active" as "active" | "inactive",
};

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [passwordForReset, setPasswordForReset] = useState("");

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      return res.json();
    },
  });

  const upsertUser = useMutation({
    mutationFn: async () => {
      if (editingUser) {
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            role: form.role,
            status: form.status,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to update user");
        }
        return res.json();
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setDialogOpen(false);
      setEditingUser(null);
      setForm(emptyForm);
      setPasswordForReset("");
    },
  });

  const resetPassword = useMutation({
    mutationFn: async () => {
      if (!editingUser) return;
      const res = await fetch(
        `/api/admin/users/${editingUser.id}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newPassword: passwordForReset }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update password");
      }
      return res.json();
    },
    onSuccess: () => {
      setPasswordForReset("");
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async (user: UserRow) => {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: user.status === "active" ? "inactive" : "active",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const filtered =
    data?.users.filter((u) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }) ?? [];

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setPasswordForReset("");
    setDialogOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setEditingUser(u);
    setForm({
      fullName: u.fullName,
      email: u.email,
      password: "",
      role: u.role,
      status: u.status,
    });
    setPasswordForReset("");
    setDialogOpen(true);
  };

  const isSelf = (u: UserRow) => currentUser && currentUser.id === u.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-steel-light">
            Users
          </h1>
          <p className="text-sm text-steel mt-1">
            Manage admin and developer access to the dashboard.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          New User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Search by name, email, or role"
          className="max-w-xs bg-surface-dark/60 border-steel/40 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-xs text-steel">
          {filtered.length} user{filtered.length === 1 ? "" : "s"} found
        </div>
      </div>

      <div className="rounded-xl border border-steel/30 overflow-hidden bg-surface-dark/60">
        <Table>
          <TableHeader>
            <TableRow className="border-steel/30">
              <TableHead className="w-[220px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[120px]">Role</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[180px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-steel py-6">
                  Loading users...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-steel py-6">
                  No users match your filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((u) => (
              <TableRow key={u.id} className="border-steel/20">
                <TableCell className="font-medium text-steel-light">
                  {u.fullName}
                  {isSelf(u) && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-accent">
                      You
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-steel text-sm">
                  {u.email}
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {u.role}
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={
                      u.status === "active"
                        ? "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    }
                  >
                    {u.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-steel/40 text-xs"
                    onClick={() => openEdit(u)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-steel/40 text-xs"
                    disabled={isSelf(u)}
                    onClick={() => toggleStatus.mutate(u)}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingUser(null);
            setForm(emptyForm);
            setPasswordForReset("");
          }
        }}
      >
        <DialogContent className="bg-surface-dark border-steel/40 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-steel-light">
              {editingUser ? "Edit User" : "Create User"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value: "admin" | "developer") =>
                    setForm((f) => ({ ...f, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setForm((f) => ({ ...f, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}

            {editingUser && (
              <div className="space-y-2 pt-2 border-t border-steel/30">
                <Label htmlFor="newPassword">
                  Reset Password (optional)
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForReset}
                  onChange={(e) => setPasswordForReset(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  size="xs"
                  variant="outline"
                  className="mt-1 border-steel/40 text-xs"
                  disabled={!passwordForReset}
                  onClick={() => resetPassword.mutate()}
                >
                  Save New Password
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-steel/40"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => upsertUser.mutate()}
                disabled={upsertUser.isPending}
              >
                {editingUser ? "Save Changes" : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;

