"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Ban, CheckCircle, User, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar, Shield } from "lucide-react";
import { useUsers } from "@/lib/users-context";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function UserDetailPage() {
  const params = useParams();
  const { getUserById, setUserStatus } = useUsers();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const user = id ? getUserById(id) : undefined;

  if (!id || !user) {
    return (
      <div className="space-y-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">User not found.</p>
        </div>
      </div>
    );
  }

  const isActive = user.status === "active";
  const toggleStatus = () => {
    setUserStatus(user.id, isActive ? "blocked" : "active");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7]">
          <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>
          <p className="text-xs text-gray-500 mt-0.5">View only — not editable</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.mobile}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row: Total Orders, Total Spend, Joined Date, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-50">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">{user.totalOrders}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Read only</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">{formatCurrency(user.totalSpend)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Read only</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">{formatDate(user.joinedDate)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</p>
              <span
                className={`inline-flex mt-1.5 items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {user.status === "active" ? "Active" : "Blocked"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Block / Unblock */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Account status</h2>
        <p className="text-sm text-gray-500 mb-4">
          Block this user to prevent them from logging in or placing orders. Unblock to restore access.
        </p>
        <button
          type="button"
          onClick={toggleStatus}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive
              ? "bg-red-50 text-red-700 hover:bg-red-100"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {isActive ? (
            <>
              <Ban className="w-4 h-4" />
              Block user
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Unblock user
            </>
          )}
        </button>
      </div>
    </div>
  );
}
