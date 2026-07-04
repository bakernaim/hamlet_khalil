"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, ErrorText } from "@/components/admin/ui";
import ThemeToggle from "@/components/site/ThemeToggle";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <ThemeToggle className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-ink/15 text-ink/60 hover:text-ink transition-colors" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">🕌</span>
            <span className="text-lg font-bold text-accent">Hamlet Al Khalil</span>
          </div>
          <h1 className="text-xl font-semibold text-ink">Admin Dashboard</h1>
          <p className="text-ink/40 text-sm mt-1">Sign in to manage your website</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-card border border-line rounded-2xl p-6"
        >
          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1.5">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-ink/30 text-xs mt-6">
          Hamlet Al Khalil — Staff access only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
