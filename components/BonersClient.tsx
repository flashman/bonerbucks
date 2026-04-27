"use client";

import { useState } from "react";
import SortableTable, { type Row } from "@/components/SortableTable";

interface Props {
  rows: Row[];
  error?: string;
}

export default function BonersClient({ rows, error }: Props) {
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? rows.filter((r) => {
        const q = filter.toLowerCase();
        return r.serial.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
      })
    : rows;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
        <h2 style={{ margin: 0 }}>TRACKED BONERS</h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="SEARCH SERIAL OR LOCATION..."
          style={{ fontFamily: "verdana", fontSize: 12, border: "1px solid #999", padding: "2px 6px", width: 220 }}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <SortableTable rows={filtered} />
    </>
  );
}
