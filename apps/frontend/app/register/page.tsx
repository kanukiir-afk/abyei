"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api";

type FormData = {
  fullName: string;
  phone?: string;
  tribe?: string;
  interests?: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, formState } = useForm<FormData>({ mode: "onTouched" });
  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/api/members/register", data);
      alert("Registration submitted. Check your email for confirmation.");
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Member Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Full name</label>
          <input className="w-full border p-2 rounded" {...register("fullName", { required: true, minLength: 2 })} />
        </div>
        
        <div>
          <label className="block text-sm">Phone</label>
          <input className="w-full border p-2 rounded" {...register("phone")} />
        </div>
        
        <div>
          <label className="block text-sm">Tribe (optional)</label>
          <input className="w-full border p-2 rounded" {...register("tribe")} />
        </div>
        <div>
          <label className="block text-sm">Interests</label>
          <textarea className="w-full border p-2 rounded" {...register("interests")} />
        </div>
        <div>
          <button className="bg-sscAccent text-white px-4 py-2 rounded">Submit</button>
        </div>
      </form>
    </div>
  );
}
