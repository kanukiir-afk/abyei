"use client";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";

type Form = { email: string; password: string };

export default function AdminLogin() {
  const { register, handleSubmit, formState } = useForm<Form>({ mode: "onTouched" });
  const onSubmit = async (data: Form) => {
    try {
      await api.post("/api/auth/login", data);
      window.location.href = "/admin";
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm w-full bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Admin sign in</h3>
      <label className="block text-sm">Email</label>
      <input aria-label="Admin email" className="w-full border p-2 rounded mb-2" {...register("email", { required: true })} />
      <label className="block text-sm">Password</label>
      <input aria-label="Admin password" type="password" className="w-full border p-2 rounded mb-3" {...register("password", { required: true })} />
      <button className="w-full bg-sscPrimary text-white py-2 rounded" disabled={formState.isSubmitting}>Sign in</button>
    </form>
  );
}
