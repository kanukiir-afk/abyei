"use client";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Decorative flag triangle + star */}
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden className="rounded-sm">
            <polygon points="0,0 28,32 0,64" fill="var(--brand-blue)" />
            <g transform="translate(6,22) scale(0.6)">
              <polygon points="16,0 20,11 32,11 22,18 26,29 16,22 6,29 10,18 0,11 12,11" fill="var(--brand-white)" />
            </g>
          </svg>
          <Link href="/" className="text-slate-900 font-semibold text-lg">Abyei Students in Rwanda</Link>
        </div>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-4 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/join">Join</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
