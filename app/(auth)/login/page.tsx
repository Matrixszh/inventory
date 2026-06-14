"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithEmail } from "@/lib/auth";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setError(null);
      const user = await loginWithEmail(values.email, values.password);
      setUser(user);
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign in.");
    }
  });

  return (
    <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden rounded-3xl border border-white/10 bg-[#1A1D27] p-10 lg:block">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">Inventory Management</p>
        <h1 className="mt-6 text-4xl font-semibold text-slate-50">Run stock operations with real-time control.</h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-slate-400">
          Track inventory, monitor movements, forecast demand, audit every change, and manage role-based access from one dark-mode-first dashboard.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#1A1D27] p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-400">Welcome Back</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-50">Sign in</h2>
          <p className="mt-2 text-sm text-slate-400">Use your Firebase email and password to access the dashboard.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Email</span>
            <Input
              type="email"
              placeholder="admin@stock.local"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Password</span>
            <Input
              type="password"
              placeholder="••••••••"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
          </label>

          {error ? <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
