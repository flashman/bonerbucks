"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
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
    const res = await fetch(`/api/records/${record.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (data.boner_deleted) router.push("/boners");
    else router.refresh();
  }

  return (
    <>
      <tr>
        <td data-label="DATE" className="w-28">{formatDate(record.created_at)}</td>
        <td data-label="CITY" className="w-36">{record.location}</td>
        <td data-label="NOTES">{record.note}</td>
        <td data-label="PIC" className="w-24">
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

      {lightbox && record.large_url && (
        <Lightbox src={record.large_url} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}
