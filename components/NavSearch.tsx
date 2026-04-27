"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function expand() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function submit() {
    const q = query.trim();
    setOpen(false);
    setQuery("");
    if (q) router.push(`/boners?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") { setOpen(false); setQuery(""); }
  }

  if (!open) {
    return (
      <button
        onClick={expand}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontFamily: "inherit", fontSize: 12, padding: 0 }}
      >
        SEARCH
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={submit}
      style={{ fontFamily: "verdana", fontSize: 11, border: "none", borderBottom: "1px solid #999", outline: "none", width: 120, background: "transparent", color: "#555", padding: "0 2px" }}
      placeholder="search boners..."
    />
  );
}
