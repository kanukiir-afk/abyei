"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api";

type FormData = {
  fullName: string;
  message?: string;
};

export default function JoinPage() {
  const { register, handleSubmit, reset } = useForm<FormData>({ mode: "onTouched" });
  const onSubmit = async (data: FormData) => {
    try {
      // reuse members register endpoint
      await api.post("/api/members/register", { fullName: data.fullName, interests: data.message });
      alert("Thank you — your request to join has been submitted.");
      reset();
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Join the Community</h1>
      <p className="mb-4 text-slate-600">We're happy you're interested — fill the form and we'll get back to you.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Full name</label>
          <input className="w-full border p-2 rounded" {...register("fullName", { required: true })} />
        </div>
        <div>
          <label className="block text-sm">Message (optional)</label>
          <textarea className="w-full border p-2 rounded" {...register("message")} />
        </div>
        <div>
          <button className="bg-sscAccent text-white px-4 py-2 rounded">Request to Join</button>
        </div>
      </form>
    </div>
  );
}
