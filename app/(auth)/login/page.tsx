"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) { setError(authErr.message.toUpperCase()); return; }
      router.push("/account");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h2>LOGIN</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            type="password" required autoComplete="current-password"
            className="input" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn disabled:opacity-50">
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup">SIGNUP</Link>
      </p>
    </div>
  );
}
