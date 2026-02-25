"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { KpiCard } from "@/components/ui/kpiCard";

const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
] as const;

type RangeId = (typeof RANGE_OPTIONS)[number]["id"];

export default function Home() {
  const [activeRange, setActiveRange] = useState<RangeId>("today");

  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12.5%",
      icon: "users" as const,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Orders",
      value: "3,421",
      change: "+8.2%",
      icon: "shopping-cart" as const,
      iconClassName: "bg-green-50 text-green-600",
    },
    {
      title: "Revenue",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(45231),
      change: "+15.3%",
      icon: "indian-rupee" as const,
      iconClassName: "bg-purple-50 text-purple-600",
    },
    {
      title: "Growth",
      value: "24.8%",
      change: "+2.4%",
      icon: "trending-up" as const,
      iconClassName: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard header with range toggle */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex-shrink-0">
          <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs sm:text-sm">
            {RANGE_OPTIONS.map((range) => {
              const isActive = activeRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setActiveRange(range.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards — horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
          <KpiCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconClassName={stat.iconClassName}
            className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
          />
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-4 rounded-xl bg-[#fef5f7] hover:bg-[#f8c6d0] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f8c6d0] flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New user registered
                  </p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">View</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Manage Products
          </h3>
          <p className="text-sm text-gray-600">
            Add, edit, or remove products from your catalog
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            View Orders
          </h3>
          <p className="text-sm text-gray-600">
            Track and manage customer orders
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics
          </h3>
          <p className="text-sm text-gray-600">
            View detailed analytics and reports
          </p>
        </div>
      </div>
    </div>
  );
}
