"use client";
import React from "react";

export type EventCardProps = {
  id?: string;
  title: string;
  dateLabel: string;
  location?: string;
  excerpt?: string;
  highlight?: boolean;
};

export default function EventCard({ title, dateLabel, location, excerpt, highlight }: EventCardProps) {
  return (
    <article className={`border rounded-lg p-4 ${highlight ? "ring-2 ring-sscAccent" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="text-center bg-emerald-50 text-emerald-700 rounded px-3 py-2 font-medium">{dateLabel}</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {location && <p className="text-sm text-slate-600">{location}</p>}
          {excerpt && <p className="mt-2 text-sm text-slate-700">{excerpt}</p>}
        </div>
      </div>
    </article>
  );
}
