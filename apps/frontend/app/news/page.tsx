"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function NewsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api.get("/api/news").then((r) => setItems(r.data.items || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Community News</h1>
      <div className="grid gap-4">
        {items.map((it) => (
          <article key={it.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="text-slate-600">{it.content?.slice(0, 200)}...</p>
          </article>
        ))}
      </div>
    </div>
  );
}
