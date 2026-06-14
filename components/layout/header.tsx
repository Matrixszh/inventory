"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export function Header({ title, description }: { title: string; description: string }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logoutCurrentUser();
    router.replace("/login");
  };

  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#252836] px-4 py-2">
          <p className="text-sm font-medium text-slate-50">{user?.name ?? "Guest"}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">{user?.role ?? "No role"}</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
