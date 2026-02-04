"use client";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">© {new Date().getFullYear()} Abyei Students in Rwanda — Musanze</div>
        <div>
          <a href="/admin" className="text-sm text-slate-700">Admin</a>
        </div>
      </div>
    </footer>
  );
}
