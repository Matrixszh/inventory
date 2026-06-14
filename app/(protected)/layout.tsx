import { ChatDrawer } from "@/components/layout/chat-drawer";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F1117]">
      <Sidebar />
      <main className="min-h-screen flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8">{children}</main>
      <ChatDrawer />
    </div>
  );
}
