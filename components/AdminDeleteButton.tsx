"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("DESTROY THIS RECORD?")) return;
    setLoading(true);
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="underline text-red-600 cursor-pointer disabled:opacity-50"
    >
      {loading ? "..." : "DESTROY"}
    </button>
  );
}
