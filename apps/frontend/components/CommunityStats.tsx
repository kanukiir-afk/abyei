"use client";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

type Stats = { members: number; events: number; yearsActive: number };

export default function CommunityStats() {
  const [stats, setStats] = useState<Stats>({ members: 0, events: 0, yearsActive: 1 });

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/stats")
      .then((r) => mounted && setStats(r.data))
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  return (
    <section aria-labelledby="community-stats" className="py-8 bg-flag-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="community-stats" className="text-2xl font-semibold mb-4">Community Stats</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-sscPrimary">{stats.members}</div>
            <div className="text-sm text-slate-600">Members</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-sscPrimary">{stats.events}</div>
            <div className="text-sm text-slate-600">Events hosted</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-sscPrimary">{stats.yearsActive}</div>
            <div className="text-sm text-slate-600">Years active</div>
          </div>
        </div>
      </div>
    </section>
  );
}
