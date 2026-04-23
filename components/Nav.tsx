"use client";

import type { User } from "@supabase/supabase-js";

interface NavProps {
  user: User | null;
  profile: { name: string; role: number } | null;
}

export default function Nav({ user, profile }: NavProps) {
  return (
    <div className="nav">
      <h3>
        <a href="/boners">TRACK A BONER</a>
        {" | "}
        <a href="/boners/new">REPORT A BONER</a>
        {" | "}
        <a href="/make">MAKE A BONER</a>
        {user && (
          <>
            {" | "}
            <a href="/account">MY BONERS</a>
            {profile?.role === 1 && (
              <>
                {" | "}
                <a href="/admin/records">ADMIN</a>
              </>
            )}
          </>
        )}
      </h3>
    </div>
  );
}
