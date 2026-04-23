import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bonerbucks",
  description: "The Boner Tracking Project",
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
        {/* HEADER */}
        <div className="border-b-2 border-black text-center py-4">
          <a href="/" className="no-underline">
            <h1 className="text-3xl tracking-widest">BONERBUCKS.ORG</h1>
          </a>
        </div>

        <Nav user={user} profile={profile} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>

        {/* FOOTER */}
        <div className="border-t-2 border-black text-center py-4 mt-12 text-xs uppercase">
          <p>
            bonerbucks.org &mdash; the boner tracking project &mdash;{" "}
            <a href="/about">about</a> &mdash;{" "}
            <a href="/blog">blog</a> &mdash;{" "}
            <a href="mailto:contact@bonerbucks.org">contact</a>
          </p>
        </div>
      </body>
    </html>
  );
}
