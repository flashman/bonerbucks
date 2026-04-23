"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="login-page" style={{ margin: "-18px -9999px", padding: "150px 0" }}>
      <div className="login-box" style={{ width: 370, margin: "0 auto", textAlign: "left" }}>
        <h2 style={{ color: "white", marginBottom: 20 }}>LOGIN</h2>

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <h4 style={{ marginBottom: 4 }}>
            <span className="label">USERNAME:</span>
            <input
              type="email" required autoComplete="email"
              style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 235 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </h4>
          <br />
          <h4 style={{ marginBottom: 4 }}>
            <span className="label">PASSWORD:</span>
            <input
              type="password" required autoComplete="current-password"
              style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 235 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </h4>
          <br />
          <h4>
            <button type="submit" disabled={loading}>
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </h4>
          <br />
          <h5 style={{ color: "white", fontWeight: "normal" }}>
            Don&apos;t have an account? Maybe you should{" "}
            <a href="/signup" style={{ color: "white" }}>signup</a>.
          </h5>
        </form>
      </div>
    </div>
  );
}
