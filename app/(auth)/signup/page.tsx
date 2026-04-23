"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="login-page" style={{ margin: "-18px -9999px", padding: "80px 0" }}>
      <div className="login-box" style={{ width: 370, margin: "0 auto", textAlign: "left" }}>
        <h2 style={{ color: "white", marginBottom: 20 }}>SIGNUP</h2>

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {[
            { label: "USERNAME:", type: "text",     val: name,     set: setName,     ac: "username" },
            { label: "EMAIL:",    type: "email",    val: email,    set: setEmail,    ac: "email" },
            { label: "PASSWORD:", type: "password", val: password, set: setPassword, ac: "new-password" },
            { label: "CONFIRM:",  type: "password", val: confirm,  set: setConfirm,  ac: "new-password" },
          ].map(({ label, type, val, set, ac }) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <h4>
                <span className="label">{label}</span>
                <input
                  type={type}
                  required
                  autoComplete={ac}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 235 }}
                />
              </h4>
            </div>
          ))}
          <br />
          <h4>
            <button type="submit" disabled={loading}>
              {loading ? "SIGNING UP..." : "SIGNUP"}
            </button>
          </h4>
          <br />
          <h5 style={{ color: "white", fontWeight: "normal" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "white" }}>Login</a>.
          </h5>
        </form>
      </div>
    </div>
  );
}
