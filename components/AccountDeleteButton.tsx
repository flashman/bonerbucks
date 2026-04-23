"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountDeleteButton({ id, serial }: { id: number; serial: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to kill your boner?")) return;
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
      title={`Delete sighting of ${serial}`}
    >
      {loading ? "KILLING..." : "KILL"}
    </button>
  );
}
