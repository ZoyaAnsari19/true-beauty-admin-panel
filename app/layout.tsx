"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/products": "Products",
  "/services": "Services",
  "/orders": "Orders",
  "/affiliates": "Affiliates",
  "/withdrawals": "Withdrawals",
  "/commission": "Commission & Coupons",
  "/theme": "Web Theme",
  "/inventory": "Inventory",
  "/settings": "Settings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <html lang="en">
      <head>
        <title>True Beauty Admin Panel</title>
        <meta name="description" content="Admin panel for True Beauty management" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-[#fef5f7]">
          <SideBar />
          <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
            <TopBar pageTitle={pageTitle} />
            <main className="flex-1 overflow-y-auto p-6 bg-[#ffffff]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
