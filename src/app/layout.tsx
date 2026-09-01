import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import CloudSyncProvider from "@/components/CloudSyncProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "G-Town PM Dashboard",
  description: "과천 G타운 공정 관리 대시보드",
};

export const viewport = {
  width: 1150, 
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-slate-50 text-sm">
        <CloudSyncProvider>
          <Sidebar />
          <main className="flex-1 overflow-x-hidden w-full p-4 sm:p-6 lg:p-8 ml-64 min-h-screen">
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </main>
        </CloudSyncProvider>
      </body>
    </html>
  );
}
