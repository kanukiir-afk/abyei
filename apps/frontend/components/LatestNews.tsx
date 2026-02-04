"use client";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import NewsCard from "./NewsCard";

type NewsItem = { id: string; title: string; excerpt?: string; image?: string; publishedAt?: string };

export default function LatestNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/news")
      .then((r) => {
        const news = r.data?.items || r.data || [];
        if (mounted) setItems(Array.isArray(news) ? news : []);
      })
      .catch(() => mounted && setItems([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section aria-labelledby="latest-news" className="py-8 bg-flag-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 id="latest-news" className="text-2xl font-semibold">Latest News</h2>
          <a href="/news" className="text-sm font-medium underline">View all news</a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded" />
          ))}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <NewsCard key={it.id} title={it.title} excerpt={it.excerpt} image={it.image} date={it.publishedAt} href={`/news/${it.id}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
