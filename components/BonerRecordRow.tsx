"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface EnrichedRecord {
  id: number;
  serial: string;
  location: string;
  note: string | null;
  created_at: string;
  image_path: string | null;
  thumb_url: string | null;
  large_url: string | null;
  canEdit: boolean;
}

export default function BonerRecordRow({ record }: { record: EnrichedRecord }) {
  const router = useRouter();
  const [lightbox, setLightbox] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to kill your boner?")) return;
    setDeleting(true);
    await fetch(`/api/records/${record.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <tr>
        <td className="w-28">{formatDate(record.created_at)}</td>
        <td className="w-36">{record.location}</td>
        <td>{record.note}</td>
        <td className="w-24">
          {record.thumb_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={record.thumb_url}
              alt="sighting"
              className="cursor-pointer h-10 object-contain"
              onClick={() => setLightbox(true)}
            />
          )}
        </td>
        <td className="w-24 text-xs space-x-1">
          {record.canEdit && (
            <>
              <Link href={`/records/${record.id}/edit`} className="underline">EDIT</Link>
              <span>|</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="underline text-red-600 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "KILLING..." : "KILL"}
              </button>
            </>
          )}
        </td>
      </tr>

      {/* Portal keeps lightbox div outside <table> so the DOM stays valid */}
      {lightbox && record.large_url && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setLightbox(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.large_url}
              alt="Boner sighting"
              className="max-w-full max-h-full"
            />
          </div>,
          document.body
        )
      }
    </>
  );
}
