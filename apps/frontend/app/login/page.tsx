"use client";
import React, { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = "/admin";
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button className="bg-sscWarm text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
      </form>
    </div>
  );
}
