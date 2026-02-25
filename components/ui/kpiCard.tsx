"use client";

import React from "react";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  UserCheck,
  UserX,
  type LucideIcon,
} from "lucide-react";

/** Icon names that can be passed from Server Components (serializable). */
export type KpiIconName =
  | "users"
  | "shopping-cart"
  | "indian-rupee"
  | "trending-up"
  | "user-check"
  | "user-x";

const KPI_ICONS: Record<KpiIconName, LucideIcon> = {
  users: Users,
  "shopping-cart": ShoppingCart,
  "indian-rupee": IndianRupee,
  "trending-up": TrendingUp,
  "user-check": UserCheck,
  "user-x": UserX,
};

export interface KpiCardProps {
  /** Card label (e.g. "Total Users", "Revenue") */
  title: string;
  /** Main metric value (e.g. "12,543", "₹45,231") */
  value: string;
  /** Icon name (serializable; use when rendering from a Server Component). */
  icon: KpiIconName;
  /** Tailwind classes for icon container: background + icon color (e.g. "bg-blue-50 text-blue-600") */
  iconClassName?: string;
  /** Optional extra class for the card root */
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon: iconName,
  iconClassName = "bg-gray-100 text-gray-600",
  className = "",
}: KpiCardProps) {
  const Icon = KPI_ICONS[iconName];
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div
          className={`shrink-0 p-3 rounded-xl ${iconClassName}`}
          aria-hidden
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
