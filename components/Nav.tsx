"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface NavProps {
  user: User | null;
  profile: { name: string; role: number } | null;
}

export default function Nav({ user, profile }: NavProps) {
  return (
    <nav className="border-b border-black py-3 text-center">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-bold uppercase">
        <Link href="/boners">TRACK A BONER</Link>
        <span className="text-gray-400">|</span>
        <Link href="/boners/new">REPORT A BONER</Link>
        <span className="text-gray-400">|</span>
        <Link href="/make">MAKE A BONER</Link>

        {user ? (
          <>
            <span className="text-gray-400">|</span>
            <Link href="/account">MY BONERS ({profile?.name})</Link>
            {profile?.role === 1 && (
              <>
                <span className="text-gray-400">|</span>
                <Link href="/admin/records">ADMIN</Link>
              </>
            )}
            <span className="text-gray-400">|</span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="font-bold uppercase underline hover:no-underline cursor-pointer">
                LOGOUT
              </button>
            </form>
          </>
        ) : (
          <>
            <span className="text-gray-400">|</span>
            <Link href="/login">LOGIN</Link>
            <span className="text-gray-400">|</span>
            <Link href="/signup">SIGNUP</Link>
          </>
        )}
      </div>
    </nav>
  );
}
