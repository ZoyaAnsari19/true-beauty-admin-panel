"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Cake,
  VenusAndMars,
  Building2,
  Hash,
  Globe,
} from "lucide-react";
import { useUsers } from "@/lib/users-context";
import { Tabination, type TabItem } from "@/components/ui/Tabination";
import { ProductOrderCard } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/kpiCard";
import type { OrderItem } from "@/lib/users-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function uniqueOrderCount(items: OrderItem[]): number {
  return new Set(items.map((i) => i.orderId)).size;
}

function totalAmount(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.totalAmount, 0);
}

function OrdersTabSummary({
  count,
  total,
  countLabel,
  amountLabel,
}: {
  count: number;
  total: number;
  countLabel: string;
  amountLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fef5f7] border border-[#f8c6d0]/40">
        <ShoppingBag className="w-5 h-5 text-gray-600" />
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{countLabel}</p>
          <p className="text-xl font-semibold text-gray-900">{count}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fef5f7] border border-[#f8c6d0]/40">
        <IndianRupee className="w-5 h-5 text-gray-600" />
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{amountLabel}</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}

function OrderCardsList({ items }: { items: OrderItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">No items to show.</p>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ProductOrderCard
          key={`${item.orderId}-${item.productName}-${index}`}
          productImage={item.productImage}
          productName={item.productName}
          price={item.price}
          quantity={item.quantity}
          totalAmount={item.totalAmount}
          orderDate={item.orderDate}
          orderStatus={item.orderStatus}
          formatDate={(d) =>
            new Date(d).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
        />
      ))}
    </div>
  );
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

  const basicInfoContent = (
    <div className="space-y-6">
      {/* Basic Info card */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7]">
          <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>
          <p className="text-xs text-gray-500 mt-0.5">View only — not editable</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
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
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Cake className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of birth</p>
              <p className="text-gray-900 font-medium mt-0.5">{formatDate(user.dob)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <VenusAndMars className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.gender}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">City</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.city}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Globe className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">State</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.state}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7]">
              <Hash className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.pincode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account status */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Account status</h2>
        <p className="text-sm text-gray-500 mb-4">
          Block this user to prevent them from logging in or placing orders. Unblock to restore access.
        </p>
        <button
          type="button"
          onClick={toggleStatus}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
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

  const purchasesContent = (
    <div>
      <OrdersTabSummary
        count={user.purchases.length}
        total={totalAmount(user.purchases)}
        countLabel="Total Purchases"
        amountLabel="Total Amount"
      />
      <OrderCardsList items={user.purchases} />
    </div>
  );

  const returnsContent = (
    <div>
      <OrdersTabSummary
        count={uniqueOrderCount(user.returnsOrders)}
        total={totalAmount(user.returnsOrders)}
        countLabel="Total Returns"
        amountLabel="Total Return Amount"
      />
      <OrderCardsList items={user.returnsOrders} />
    </div>
  );

  const cancelledContent = (
    <div>
      <OrdersTabSummary
        count={uniqueOrderCount(user.cancelledOrders)}
        total={totalAmount(user.cancelledOrders)}
        countLabel="Total Cancelled"
        amountLabel="Total Amount"
      />
      <OrderCardsList items={user.cancelledOrders} />
    </div>
  );

  const refundsContent = (
    <div>
      <OrdersTabSummary
        count={uniqueOrderCount(user.refundedOrders)}
        total={totalAmount(user.refundedOrders)}
        countLabel="Total Refunds"
        amountLabel="Total Refund Amount"
      />
      <OrderCardsList items={user.refundedOrders} />
    </div>
  );

  const tabs: TabItem[] = [
    { id: "basic", label: "Basic Info", content: basicInfoContent },
    { id: "purchases", label: "Purchases", content: purchasesContent },
    { id: "returns", label: "Returns", content: returnsContent },
    { id: "cancelled", label: "Cancelled", content: cancelledContent },
    { id: "refunds", label: "Refunds", content: refundsContent },
  ];

  const totalRefundAmount = totalAmount(user.refundedOrders);

  return (
    <div className="space-y-6">
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* KPI cards — always visible above tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Orders"
          value={String(user.totalOrders)}
          change="—"
          icon="shopping-cart"
          iconClassName="bg-green-50 text-green-600"
        />
        <KpiCard
          title="Total Spend"
          value={formatCurrency(user.totalSpend)}
          change="—"
          icon="indian-rupee"
          iconClassName="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title="Total Refund Amount"
          value={formatCurrency(totalRefundAmount)}
          change="—"
          icon="indian-rupee"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Account Status"
          value={user.status === "active" ? "Active" : "Blocked"}
          change="—"
          icon={user.status === "active" ? "user-check" : "user-x"}
          iconClassName={
            user.status === "active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }
        />
      </div>

      {/* Tabs */}
      <Tabination tabs={tabs} defaultTabId="basic" />
    </div>
  );
}
