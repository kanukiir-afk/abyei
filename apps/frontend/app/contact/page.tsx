"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm<ContactForm>({ mode: "onTouched" });
  const onSubmit = async (data: ContactForm) => {
    try {
      await api.post("/api/contact", data);
      alert("Message sent — we'll be in touch soon.");
      reset();
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
      <p className="mb-4 text-slate-600">Questions, events, or partnership inquiries — send us a message.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border p-2 rounded" {...register("name", { required: true })} />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border p-2 rounded" type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label className="block text-sm">Subject</label>
          <input className="w-full border p-2 rounded" {...register("subject", { required: true })} />
        </div>
        <div>
          <label className="block text-sm">Message</label>
          <textarea className="w-full border p-2 rounded" {...register("message", { required: true })} />
        </div>
        <div>
          <button className="bg-sscPrimary text-white px-4 py-2 rounded">Send Message</button>
        </div>
      </form>
    </div>
  );
}
