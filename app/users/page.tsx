"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Ban, Eye, MoreVertical } from "lucide-react";
import { useUsers } from "@/lib/users-context";
import { type User, type UserStatus } from "@/lib/users-data";
import { KpiCard } from "@/components/ui/kpiCard";
import { Filters, type FilterOption } from "@/components/ui/filters";

function UserActionsMenu({ user }: { user: User }) {
  const { setUserStatus } = useUsers();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isActive = user.status === "active";

  const toggleStatus = () => {
    setUserStatus(user.id, isActive ? "blocked" : "active");
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-[#fef5f7] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
          <Link
            href={`/users/${user.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              toggleStatus();
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors text-left ${
              isActive
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-[#fef5f7]"
            }`}
          >
            <Ban className="w-4 h-4 shrink-0" />
            <span>{isActive ? "Block" : "Unblock"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersPage() {
  const { users } = useUsers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | UserStatus>("");

  const filtered = useMemo(() => {
    let list = [...users];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.mobile.includes(q) ||
          u.address.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((u) => u.status === statusFilter);
    }
    return list;
  }, [users, search, statusFilter]);

  const kpis = useMemo(() => {
    const totalUsers = users.length;
    const totalOrders = users.reduce((s, u) => s + u.totalOrders, 0);
    const activeCount = users.filter((u) => u.status === "active").length;
    const blockedCount = users.filter((u) => u.status === "blocked").length;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const newThisMonth = users.filter((u) => {
      const d = new Date(u.joinedDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    return {
      totalUsers,
      totalOrders,
      activeCount,
      blockedCount,
      newThisMonth,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard
          title="Total Users"
          value={kpis.totalUsers.toLocaleString()}
          change="—"
          icon="users"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          change="—"
          icon="shopping-cart"
          iconClassName="bg-green-50 text-green-600"
        />
        <KpiCard
          title="Active Accounts"
          value={kpis.activeCount.toLocaleString()}
          change="—"
          icon="user-check"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Blocked Accounts"
          value={kpis.blockedCount.toLocaleString()}
          change="—"
          icon="user-x"
          iconClassName="bg-red-50 text-red-600"
        />
        <KpiCard
          title="New This Month"
          value={kpis.newThisMonth.toLocaleString()}
          change="—"
          icon="trending-up"
          iconClassName="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Filters */}
      <Filters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, mobile, or address..."
        filterOptions={STATUS_OPTIONS}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as "" | UserStatus)}
      />

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200 bg-[#fef5f7]">
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500 text-sm"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-[#fef5f7]/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.mobile}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(user.joinedDate)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <UserActionsMenu user={user} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
