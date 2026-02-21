"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
}

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

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex h-screen bg-[#fef5f7]">
      <SideBar />
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        <TopBar pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#ffffff]">
          {children}
        </main>
      </div>
    </div>
  );
}
