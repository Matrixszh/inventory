"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  BrainCircuit,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "VIEWER"] },
  { href: "/inventory", label: "Inventory", icon: Boxes, roles: ["ADMIN", "MANAGER", "VIEWER"] },
  { href: "/predictions", label: "Predictions", icon: BrainCircuit, roles: ["ADMIN", "MANAGER", "VIEWER"] },
  { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["ADMIN", "MANAGER", "VIEWER"] },
  { href: "/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "MANAGER"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const filteredItems = navItems.filter((item) => (user ? item.roles.includes(user.role) : false));

  return (
    <>
      <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#1A1D27] p-6 lg:block">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-400">Inventory OS</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-50">Stock Control</h1>
        </div>
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-indigo-500 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#1A1D27]/95 p-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {filteredItems.slice(0, 5).map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-medium",
                  active ? "bg-indigo-500 text-white" : "text-slate-300",
                )}
              >
                <item.icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
