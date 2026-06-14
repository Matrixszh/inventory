import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Production-ready inventory operations dashboard powered by Next.js and Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0F1117] text-slate-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
