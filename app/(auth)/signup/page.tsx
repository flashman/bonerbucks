"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("PASSWORDS DO NOT MATCH."); return; }
    if (password.length < 6) { setError("PASSWORD MUST BE AT LEAST 6 CHARACTERS."); return; }
    if (!name.trim()) { setError("USERNAME IS REQUIRED."); return; }

    setLoading(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: `${siteUrl}/account`,
        },
      });
      if (authErr) { setError(authErr.message.toUpperCase()); return; }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h2>SIGNUP</h2>
      <p className="text-sm">Join the boner tracking project.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h4 className="mb-1">USERNAME:</h4>
          <input
            type="text" required autoComplete="username"
            className="input" value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <h4 className="mb-1">EMAIL:</h4>
          <input
            type="email" required autoComplete="email"
            className="input" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <h4 className="mb-1">PASSWORD:</h4>
          <input
            type="password" required autoComplete="new-password"
            className="input" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <h4 className="mb-1">CONFIRM:</h4>
          <input
            type="password" required autoComplete="new-password"
            className="input" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn disabled:opacity-50">
          {loading ? "SIGNING UP..." : "SIGNUP"}
        </button>
      </form>

      <p className="text-sm">
        Already have an account? <Link href="/login">LOGIN</Link>
      </p>
    </div>
  );
}
