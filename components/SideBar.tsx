"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Scissors,
  ShoppingCart,
  UserCheck,
  Wallet,
  Gift,
  Palette,
  Boxes,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "Services", icon: Scissors, href: "/services" },
  { label: "Orders", icon: ShoppingCart, href: "/orders" },
  { label: "Affiliates", icon: UserCheck, href: "/affiliates" },
  { label: "Withdrawals", icon: Wallet, href: "/withdrawals" },
  { label: "Commission/Coupons", icon: Gift, href: "/commission" },
  { label: "Web Theme", icon: Palette, href: "/theme" },
  { label: "Inventory", icon: Boxes, href: "/inventory" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-[#fef5f7] border-r border-gray-200 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">True Beauty</h1>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-[#f8c6d0] transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/users" && pathname.startsWith("/users/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#f8c6d0] text-gray-900 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-[#fef5f7] hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#fef5f7] rounded-lg shadow-md border border-gray-200 md:hidden hover:bg-[#f8c6d0] transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </>
  );
}
