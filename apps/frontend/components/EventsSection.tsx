"use client";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import EventCard from "./EventCard";

type EventItem = { id: string; title: string; date: string; location?: string; excerpt?: string };

export default function EventsSection() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/events")
      .then((r) => {
        const events = r.data?.upcoming || r.data?.items || [];
        if (mounted) setItems(Array.isArray(events) ? events : []);
      })
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const next = items[0];

  return (
    <section aria-labelledby="upcoming-events" className="py-8 bg-flag-green">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 id="upcoming-events" className="text-2xl font-semibold">Upcoming Events</h2>
          <a href="/events" className="text-sm font-medium underline">See all events</a>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 bg-slate-100 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-40 bg-slate-100 rounded animate-pulse" />
              <div className="h-40 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {next && (
              <div>
                <h3 className="text-xl font-semibold">Next: {next.title}</h3>
                <EventCard title={next.title} dateLabel={next.date} location={next.location} excerpt={next.excerpt} highlight />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.slice(1, 5).map((it) => (
                <EventCard key={it.id} title={it.title} dateLabel={it.date} location={it.location} excerpt={it.excerpt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
