"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useUsers } from "@/lib/users-context";
import { type User, type UserStatus } from "@/lib/users-data";

function BlockUnblockButton({ user }: { user: User }) {
  const { setUserStatus } = useUsers();
  const isActive = user.status === "active";
  const toggle = () =>
    setUserStatus(user.id, isActive ? "blocked" : "active");
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-[#f8c6d0] transition-colors"
    >
      {isActive ? (
        <>
          <Ban className="w-4 h-4" />
          Block
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4" />
          Unblock
        </>
      )}
    </button>
  );
}

const STATUS_OPTIONS: { value: "" | UserStatus; label: string }[] = [
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All statuses";

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors min-w-[160px] justify-between"
          >
            <span>{statusLabel}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showStatusDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusDropdown(false)}
              />
              <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value || "all"}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setShowStatusDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#fef5f7] transition-colors ${
                      statusFilter === opt.value ? "bg-[#fef5f7] font-medium" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

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
                <th className="text-right py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/users/${user.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-[#f8c6d0] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <BlockUnblockButton user={user} />
                      </div>
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
