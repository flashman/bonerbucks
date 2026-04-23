"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Row {
  serial: string;
  sightings: number;
  last_seen: string;
  location: string;
  thumb_url: string | null;
  large_url: string | null;
}

type SortKey = keyof Row;
type Dir = "asc" | "desc";

export default function SortableTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("serial");
  const [dir, setDir] = useState<Dir>("asc");
  const [lightbox, setLightbox] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (key === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDir("asc"); }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === "number"
      ? (av as number) - (bv as number)
      : String(av).localeCompare(String(bv));
    return dir === "asc" ? cmp : -cmp;
  });

  function arrow(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return dir === "asc" ? " ↑" : " ↓";
  }

  return (
    <>
      {lightbox && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox} alt="Boner" className="max-w-full max-h-full" />
          </div>,
          document.body
        )
      }

      <table className="sortable w-full">
        <thead>
          <tr>
            <th onClick={() => handleSort("serial")} className="cursor-pointer select-none">BONER{arrow("serial")}</th>
            <th onClick={() => handleSort("sightings")} className="cursor-pointer select-none w-20">SIGHTINGS{arrow("sightings")}</th>
            <th onClick={() => handleSort("last_seen")} className="cursor-pointer select-none">LAST SEEN{arrow("last_seen")}</th>
            <th onClick={() => handleSort("location")} className="cursor-pointer select-none">IN{arrow("location")}</th>
            <th>PIC</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.serial}>
              <td>
                <Link href={`/boners/${row.serial}`}>{row.serial}</Link>
              </td>
              <td className="text-center">{row.sightings}</td>
              <td>{row.last_seen}</td>
              <td>{row.location}</td>
              <td>
                {row.thumb_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.thumb_url}
                    alt="sighting"
                    className="cursor-pointer h-10 object-contain"
                    onClick={() => setLightbox(row.large_url!)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
