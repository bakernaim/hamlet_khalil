"use client";

import { useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Select, Button, Modal, ErrorText } from "@/components/admin/ui";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function UsersManager() {
  const { items, loading, error, save, remove } = useResource<User>("/api/admin/users");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("editor");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    setUsername("");
    setName("");
    setRole("editor");
    setPassword("");
    setFormError("");
    setOpen(true);
  }
  function openEdit(u: User) {
    setEditingId(u.id);
    setUsername(u.username);
    setName(u.name);
    setRole(u.role);
    setPassword("");
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = editingId
      ? { name, role, password }
      : { username, name, role, password };
    const res = await save(payload, editingId ?? undefined);
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function onDelete(u: User) {
    if (!confirm(`Delete user "${u.username}"?`)) return;
    const res = await remove(u.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Staff Users</h1>
          <p className="text-ink/45 text-sm mt-1">People who can sign in and manage the site.</p>
        </div>
        <Button onClick={openNew}>+ New User</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-page-alt text-ink/50 text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16223a]">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 text-ink font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink/60">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-violet-500/15 text-violet-700 dark:text-violet-300" : "bg-ink/8 text-ink/60"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5">Edit</button>
                      <button onClick={() => onDelete(u)} className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editingId ? "Edit User" : "New User"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Username" hint={editingId ? "Username cannot be changed" : "Lowercase, no spaces"}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!!editingId}
              required={!editingId}
            />
          </Field>
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin (full access)</option>
              <option value="editor">Editor</option>
            </Select>
          </Field>
          <Field
            label={editingId ? "New password" : "Password"}
            hint={editingId ? "Leave blank to keep current password" : "At least 6 characters"}
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          <ErrorText>{formError}</ErrorText>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save User"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
