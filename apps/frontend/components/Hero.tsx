import React from "react";

export default function Hero() {
  return (
    <header className="bg-sscPrimary text-white">
      <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold">South Sudanese Community — Musanze</h1>
          <p className="mt-4 text-lg text-amber-100">Bringing South Sudanese families together in Musanze through culture, support, and events.</p>
          <div className="mt-6 flex gap-3">
            <a href="/register" className="bg-sscAccent text-white px-4 py-2 rounded">Register</a>
            <a href="/join" className="bg-white text-sscPrimary px-4 py-2 rounded">Join Community</a>
            <a href="/contact" className="border border-white text-white px-4 py-2 rounded">Contact Us</a>
          </div>
        </div>
        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="bg-white text-sscPrimary p-6 rounded shadow">
            <h3 className="text-xl font-semibold">Admin Login</h3>
            <form action="/admin/login" method="get" className="mt-4">
              <label className="block text-sm">Email</label>
              <input name="email" type="email" className="w-full mt-1 p-2 border rounded" />
              <label className="block text-sm mt-2">Password</label>
              <input name="password" type="password" className="w-full mt-1 p-2 border rounded" />
              <button className="mt-4 w-full bg-sscWarm text-white py-2 rounded">Login</button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
