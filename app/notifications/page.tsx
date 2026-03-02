"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ShoppingCart,
  Wallet,
  Settings,
  Users,
  UserCheck,
  Package,
  Scissors,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useNotifications } from "@/lib/notifications-context";
import type { Notification, NotificationCategory } from "@/lib/notifications-data";

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  system: Settings,
  customers: Users,
  affiliate_users: UserCheck,
  new_products: Package,
  new_services: Scissors,
  new_orders: ShoppingCart,
  withdraw_request: Wallet,
};

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  system: "System",
  customers: "Customers",
  affiliate_users: "Affiliate Users",
  new_products: "New Products",
  new_services: "New Services",
  new_orders: "New Orders",
  withdraw_request: "Withdraw Request",
};

type FilterValue = "all" | "unread" | "send" | NotificationCategory;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "affiliate_users", label: "Affiliate Users" },
  { value: "new_orders", label: "New Orders" },
  { value: "withdraw_request", label: "Withdraw Request" },
];

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

/** Two-column detail row: label left, value right. */
function DetailRow({
  label,
  value,
  valueBold = false,
}: {
  label: string;
  value: React.ReactNode;
  valueBold?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500 shrink-0">{label}</dt>
      <dd
        className={`text-sm text-right text-gray-900 min-w-0 ${
          valueBold ? "font-semibold" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function NotificationDetailDrawer({
  notification,
  onClose,
  onNavigate,
}: {
  notification: Notification;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const { payload } = notification;
  const isWithdraw = notification.category === "withdraw_request" && payload?.withdraw;
  const isOrder = (notification.category === "new_orders" && payload?.order) || false;
  const isReturn = !!payload?.return;

  const [bankRevealed, setBankRevealed] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = () => {
    onClose();
    onNavigate(
      payload?.withdraw?.affiliateId && payload?.withdraw?.withdrawalId
        ? `/withdraw-requests/${payload.withdraw.affiliateId}/${payload.withdraw.withdrawalId}`
        : "/withdraw-requests"
    );
    setConfirmAction(null);
  };

  const handleReject = () => {
    onClose();
    onNavigate(
      payload?.withdraw?.affiliateId && payload?.withdraw?.withdrawalId
        ? `/withdraw-requests/${payload.withdraw.affiliateId}/${payload.withdraw.withdrawalId}`
        : "/withdraw-requests"
    );
    setConfirmAction(null);
  };

  const sectionPadding = "px-5 py-5 sm:px-6 sm:py-6";
  const cardBg = "rounded-xl bg-gray-50/80 border border-gray-100";

  return (
    <div className="min-h-0 flex flex-col">
      {/* Header Section */}
      <div className={`${sectionPadding} pb-5 border-b border-gray-100`}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 leading-tight flex-1 min-w-0">
            {notification.title}
          </h2>
          <span
            className={`shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              notification.read ? "bg-gray-100 text-gray-600" : "bg-[#D96A86]/10 text-[#D96A86]"
            }`}
          >
            {notification.read ? "Read" : "Unread"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{formatDateTime(notification.timestamp)}</p>
      </div>

      {/* Event Summary */}
      <div className={`${sectionPadding} py-5`}>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Event summary
        </h3>
        <div className={`${cardBg} p-4 sm:p-5`}>
          <p className="text-sm text-gray-700 leading-relaxed">{notification.description}</p>
        </div>
      </div>

      {/* Details Section */}
      {(isWithdraw || isOrder || isReturn) && (
        <div className={`${sectionPadding} py-5 border-t border-gray-100`}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {isWithdraw ? "Withdraw details" : isOrder ? "Order details" : "Return details"}
          </h3>
          <div className={`${cardBg} p-4 sm:p-5`}>
            <dl className="space-y-0">
              {isWithdraw && payload?.withdraw && (
                <>
                  <DetailRow label="Affiliate" value={payload.withdraw.affiliateName} />
                  <DetailRow
                    label="Requested amount"
                    value={formatCurrency(payload.withdraw.requestedAmount)}
                    valueBold
                  />
                  <DetailRow
                    label="Wallet balance"
                    value={formatCurrency(payload.withdraw.walletBalance)}
                    valueBold
                  />
                  <div className="flex justify-between items-center gap-4 py-3 border-b border-gray-100">
                    <dt className="text-sm text-gray-500 shrink-0">Bank / UPI</dt>
                    <dd className="flex items-center gap-2 min-w-0 justify-end">
                      <span className="font-mono text-sm text-gray-900">
                        {bankRevealed && payload.withdraw.fullBankDetails
                          ? payload.withdraw.fullBankDetails
                          : payload.withdraw.bankUpiMasked}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBankRevealed((v) => !v)}
                        className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                        aria-label={bankRevealed ? "Mask" : "Reveal"}
                      >
                        {bankRevealed ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </dd>
                  </div>
                </>
              )}
              {isOrder && payload?.order && (
                <>
                  <DetailRow label="Order ID" value={payload.order.orderId} />
                  <DetailRow label="Customer" value={payload.order.customerName} />
                  <DetailRow
                    label="Amount"
                    value={formatCurrency(payload.order.amount)}
                    valueBold
                  />
                  <DetailRow label="Payment method" value={payload.order.paymentMethod} />
                </>
              )}
              {isReturn && payload?.return && (
                <>
                  <DetailRow label="Order ID" value={payload.return.orderId} />
                  <DetailRow label="Product" value={payload.return.productName} />
                  <div className="py-3 border-b border-gray-100">
                    <dt className="text-sm text-gray-500 mb-1">Return reason</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {payload.return.returnReason}
                    </dd>
                  </div>
                  <DetailRow label="Status" value={payload.return.returnStatus} />
                </>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className={`${sectionPadding} pt-5 mt-auto border-t border-gray-100`}>
        <div className="flex flex-col gap-3">
          {(isWithdraw || isOrder || isReturn || notification.redirectLink) && (
            <>
              {isWithdraw && notification.title.toLowerCase().includes("request") && (
                <div className="flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmAction("reject")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-700 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction("approve")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              )}
              {isOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const path =
                      payload?.order?.userId
                        ? `/users/${payload.order.userId}`
                        : (notification.redirectLink || "/orders");
                    onNavigate(path);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Order
                </button>
              )}
              {isReturn && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const path =
                      payload?.return?.userId
                        ? `/users/${payload.return.userId}`
                        : (notification.redirectLink || "/users");
                    onNavigate(path);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  View Return
                </button>
              )}
            </>
          )}
          {!isWithdraw && !isOrder && !isReturn && notification.redirectLink && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate(notification.redirectLink!);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
            >
              <Eye className="w-4 h-4" />
              View details
            </button>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            aria-hidden
            onClick={() => setConfirmAction(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,360px)] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-[70]"
          >
            <p className="text-sm font-medium text-gray-900">
              {confirmAction === "approve"
                ? "Approve this withdrawal request? You will be taken to the request details."
                : "Reject this withdrawal request? You will be taken to the request details."}
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction === "approve" ? handleApprove : handleReject}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                  confirmAction === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const Icon = CATEGORY_ICONS[notification.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border shadow-sm transition-all hover:shadow-md p-4 sm:p-5 flex gap-4 ${
        notification.read
          ? "bg-white border-gray-100"
          : "bg-[#fef5f7]/60 border-[#f8c6d0]/60"
      }`}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          notification.read ? "bg-gray-100 text-gray-600" : "bg-[#D96A86]/10 text-[#D96A86]"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3
            className={`text-sm font-semibold ${
              notification.read ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500 shrink-0">
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {notification.description}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Related: {notification.relatedUser}
        </p>
        {!notification.read && (
          <span className="inline-block mt-2 w-2 h-2 rounded-full bg-[#D96A86]" />
        )}
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    markAsRead,
    markAllAsRead,
    filterNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<FilterValue>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filtered = useMemo(
    () => filterNotifications(filter),
    [filter, filterNotifications]
  );

  const focusId = searchParams.get("focusId");

  useEffect(() => {
    if (!focusId) return;
    const match = filtered.find((n) => n.id === focusId);
    if (!match || match.read) return;
    markAsRead(match.id);
    setSelectedNotification({ ...match, read: true });
  }, [focusId, filtered, markAsRead]);

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    setSelectedNotification({ ...n, read: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">All Notifications</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-[#fef5f7] transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === opt.value
                ? "bg-[#D96A86] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-[#fef5f7]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notifications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))}
        </div>
      )}

      {/* Notification detail drawer */}
      <Drawer
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title="Notification"
        width="md"
      >
        {selectedNotification && (
          <NotificationDetailDrawer
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
            onNavigate={(path) => router.push(path)}
          />
        )}
      </Drawer>

    </div>
  );
}
