"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  useEffect(() => {
    api.get("/api/events").then((r) => {
      setUpcoming(r.data.upcoming || []);
      setPast(r.data.past || []);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
      <section className="mb-6">
        <h2 className="text-xl">Upcoming</h2>
        {upcoming.map((ev) => (
          <div key={ev.id} className="p-3 border rounded my-2">
            <div className="font-semibold">{ev.title}</div>
            <div className="text-sm text-slate-600">{new Date(ev.startAt).toLocaleString()}</div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl">Past</h2>
        {past.map((ev) => (
          <div key={ev.id} className="p-3 border rounded my-2">
            <div className="font-semibold">{ev.title}</div>
            <div className="text-sm text-slate-600">{new Date(ev.startAt).toLocaleString()}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
