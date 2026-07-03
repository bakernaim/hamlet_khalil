"use client";

import { useState } from "react";
import { Field, Input, Button, ErrorText } from "@/components/admin/ui";

export default function AccountManager({
  username,
  name,
  role,
}: {
  username: string;
  name: string;
  role: string;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (newPassword !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change password");
        return;
      }
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ink">My Account</h1>
        <p className="text-ink/45 text-sm mt-1">Your profile and password.</p>
      </header>

      <div className="rounded-2xl bg-card border border-line p-5 mb-6 max-w-lg">
        <h2 className="text-ink font-semibold text-sm mb-4">Profile</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex gap-3">
            <dt className="w-24 text-ink/45">Username</dt>
            <dd className="text-ink/80">{username}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 text-ink/45">Name</dt>
            <dd className="text-ink/80">{name}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 text-ink/45">Role</dt>
            <dd className="text-ink/80 capitalize">{role}</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-card border border-line p-5 space-y-4 max-w-lg"
      >
        <h2 className="text-ink font-semibold text-sm">Change password</h2>
        <Field label="Current password">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        <Field label="New password" hint="At least 6 characters">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="Confirm new password">
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>
        <ErrorText>{error}</ErrorText>
        {saved && (
          <p className="text-sm text-accent bg-[#00b86a]/10 border border-[#00b86a]/25 rounded-lg px-3 py-2">
            Password updated successfully
          </p>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
