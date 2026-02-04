"use client";
import React from "react";

export type NewsCardProps = {
  id?: string;
  image?: string;
  title: string;
  excerpt?: string;
  date?: string;
  href?: string;
};

export default function NewsCard({ image, title, excerpt, date, href }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden group" aria-labelledby={`news-${title}`}>
      {image ? (
        <img src={image} alt="" className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
      ) : (
        <div className="w-full h-40 bg-emerald-50 flex items-center justify-center text-emerald-600">Img</div>
      )}
      <div className="p-4">
        <h3 id={`news-${title}`} className="text-lg font-semibold text-slate-900">
          {title}
        </h3>
        {date && <time className="text-sm text-slate-500 block mb-2">{date}</time>}
        {excerpt && <p className="text-sm text-slate-700">{excerpt}</p>}
        {href && (
          <a href={href} className="inline-block mt-3 text-sm text-sscPrimary font-medium">
            Read more →
          </a>
        )}
      </div>
    </article>
  );
}
