"use client";
import Link from 'next/link'
import type { User } from "@supabase/supabase-js";

interface NavProps {
  user: User | null;
  profile: { name: string; role: number } | null;
}

export default function Nav({ user, profile }: NavProps) {
  return (
    <div className="nav">
      <h3>
        <Link href="/boners">TRACK A BONER</Link>
        {" | "}
        <Link href="/boners/new">REPORT A BONER</Link>
        {" | "}
        <Link href="/make">MAKE A BONER</Link>
        {user && (
          <>
            {" | "}
            <Link href="/account">MY BONERS</Link>
            {profile?.role === 1 && (
              <>
                {" | "}
                <Link href="/admin/records">ADMIN</Link>
              </>
            )}
          </>
        )}
      </h3>
    </div>
  );
}
