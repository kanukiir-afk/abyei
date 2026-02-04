"use client";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

type Leader = { id: string; name: string; role: string; photo?: string };

export default function LeadershipPreview() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get("/api/admin/leaders");
        if (mounted) setLeaders(response.data || []);
      } catch (error) {
        if (mounted) setLeaders([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section aria-labelledby="leadership" className="py-8 bg-flag-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 id="leadership" className="text-2xl font-semibold">Leadership</h2>
          <a href="/about" className="text-sm text-slate-700 hover:text-slate-900">About us</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {leaders.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-xl text-center shadow-sm animate-pulse" />
              ))
            : leaders.map((l) => (
                <a
                  href={`/about#${l.id}`}
                  key={l.id}
                  className="lead-card block bg-white rounded-xl p-4 text-center shadow hover:shadow-lg transition-shadow focus:outline-none"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-white shadow-inner">
                    <img src={l.photo || "/images/avatar-placeholder.png"} alt={`Photo of ${l.name}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-semibold text-slate-900">{l.name}</div>
                  <div className="text-sm text-emerald-600 mt-1">{l.role}</div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
