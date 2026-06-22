"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";

export interface Row {
  serial: string;
  sightings: number;
  last_seen: string;
  last_seen_raw: string | null;
  location: string;
  thumb_url: string | null;
  large_url: string | null;
}

type SortKey = keyof Row;
type Dir = "asc" | "desc";

const PAGE_SIZE = 50;

export default function SortableTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("last_seen");
  const [dir, setDir] = useState<Dir>("desc");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const sorted = [...rows].sort((a, b) => {
    const av = sortKey === "last_seen" ? (a.last_seen_raw ?? "")
             : sortKey === "thumb_url" ? (a.thumb_url ? 1 : 0)
             : a[sortKey];
    const bv = sortKey === "last_seen" ? (b.last_seen_raw ?? "")
             : sortKey === "thumb_url" ? (b.thumb_url ? 1 : 0)
             : b[sortKey];
    if (av == null || av === "") return 1;
    if (bv == null || bv === "") return -1;
    const cmp = typeof av === "number"
      ? (av as number) - (bv as number)
      : String(av).localeCompare(String(bv));
    return dir === "asc" ? cmp : -cmp;
  });

  const total = sorted.length;
  const visible = sorted.slice(0, visibleCount);

  function handleSort(key: SortKey) {
    if (key === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDir("asc"); }
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, total));
        }
      },
      { rootMargin: "500px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [total]);

  function arrow(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return dir === "asc" ? " ↑" : " ↓";
  }

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div className="table-scroll">
        <table className="sortable w-full">
          <thead>
            <tr>
              <th onClick={() => handleSort("serial")} className="cursor-pointer select-none">BONER{arrow("serial")}</th>
              <th onClick={() => handleSort("sightings")} className="cursor-pointer select-none w-20">SIGHTINGS{arrow("sightings")}</th>
              <th onClick={() => handleSort("last_seen")} className="cursor-pointer select-none">LAST SEEN{arrow("last_seen")}</th>
              <th onClick={() => handleSort("location")} className="cursor-pointer select-none">IN{arrow("location")}</th>
              <th onClick={() => handleSort("thumb_url")} className="cursor-pointer select-none">PIC{arrow("thumb_url")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.serial}>
                <td data-label="BONER">
                  <Link href={`/boners/${row.serial}`}>{row.serial}</Link>
                </td>
                <td data-label="SIGHTINGS" className="text-center">{row.sightings}</td>
                <td data-label="LAST SEEN">{row.last_seen}</td>
                <td data-label="IN">{row.location}</td>
                <td data-label="PIC">
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
        <div ref={sentinelRef} />
      </div>
    </>
  );
}
