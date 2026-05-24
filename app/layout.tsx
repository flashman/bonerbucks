import type { Metadata } from "next";
import Link from 'next/link'
import "./globals.css";
import Nav from "@/components/Nav";
import NavSearch from "@/components/NavSearch";
import { createClient } from "@/lib/supabase/server";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Bonerbucks",
  description: "The Boner Tracking Project",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en">
      <body>
        {/* ── HEADER — matches original _head.html.erb ── */}
        <div className="head">
          <div style={{ textAlign: "right", maxWidth: 700, margin: "0 auto", height: 25 }}>
            <HoverLogin user={user} profile={profile} />
          </div>
          <Link href="/">
            <div style={{ textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bonerbuck.gif" width={700} height={302} alt="Bonerbucks" style={{ margin: "0 auto", display: "block" }} />
            </div>
          </Link>
        </div>

        {/* ── NAV ── */}
        <Nav user={user} profile={profile} />

        {/* ── CONTENT ── */}
        <div style={{ textAlign: "center" }}>
          <div className="content">
            {children}
          </div>
        </div>

        {/* ── FOOTER — matches original _foot.html.erb ── */}
        <div className="foot">
          <h5>
            <span className="about">
              <Link href="/about">ABOUT</Link> | <Link href="/blog">BLOG</Link>
            </span>
            <span className="copyright">&copy; Copyright 2026</span>
          </h5>
        </div>
        <GoogleAnalytics gaId="G-5XW7105XYK" />
      </body>
    </html>
  );
}

/* Inline because it's tiny and only used in the layout */
function HoverLogin({
  user,
  profile,
}: {
  user: { id: string } | null;
  profile: { name: string } | null;
}) {
  if (user) {
    return (
      <h6 className="login" style={{ fontSize: 12 }}>
        <NavSearch /> |{" "}
        <Link href="/account">ACCOUNT ({profile?.name})</Link> |{" "}
        <form action="/api/auth/logout" method="POST" style={{ display: "inline" }}>
          <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontFamily: "inherit", fontSize: "inherit" }}>
            LOGOUT
          </button>
        </form>
      </h6>
    );
  }
  return (
    <h6 className="login" style={{ fontSize: 12 }}>
      <NavSearch /> | <Link href="/login">LOGIN</Link>
    </h6>
  );
}
