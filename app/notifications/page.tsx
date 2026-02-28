"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Plus,
  ShoppingCart,
  Wallet,
  Settings,
  Users,
  UserCheck,
  Package,
  Scissors,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useNotifications } from "@/lib/notifications-context";
import type { Notification, NotificationCategory, TargetRole } from "@/lib/notifications-data";

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

const TARGET_ROLE_OPTIONS: { value: TargetRole; label: string }[] = [
  { value: "all", label: "All" },
  { value: "customers", label: "Customers" },
  { value: "affiliate_users", label: "Affiliate Users" },
];

const CATEGORY_OPTIONS: { value: NotificationCategory; label: string }[] = [
  { value: "system", label: "System" },
  { value: "customers", label: "Customers" },
  { value: "affiliate_users", label: "Affiliate Users" },
  { value: "new_products", label: "New Products" },
  { value: "new_services", label: "New Services" },
  { value: "new_orders", label: "New Orders" },
  { value: "withdraw_request", label: "Withdraw Request" },
];

type FilterValue = "all" | "unread" | "send" | NotificationCategory;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "send", label: "Send" },
  { value: "system", label: "System" },
  { value: "customers", label: "Customers" },
  { value: "affiliate_users", label: "Affiliate Users" },
  { value: "new_products", label: "New Products" },
  { value: "new_services", label: "New Services" },
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{notification.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{formatDateTime(notification.timestamp)}</p>
        <span
          className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
            notification.read ? "bg-gray-100 text-gray-600" : "bg-[#D96A86]/10 text-[#D96A86]"
          }`}
        >
          {notification.read ? "Read" : "Unread"}
        </span>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Event summary
        </p>
        <p className="text-sm text-gray-700">{notification.description}</p>
      </div>

      {isWithdraw && payload?.withdraw && (
        <div className="rounded-xl border border-gray-100 bg-[#fef5f7]/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Withdraw details
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Affiliate</dt>
              <dd className="font-medium text-gray-900">{payload.withdraw.affiliateName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Requested amount</dt>
              <dd className="font-medium text-gray-900">
                {formatCurrency(payload.withdraw.requestedAmount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Wallet balance</dt>
              <dd className="font-medium text-gray-900">
                {formatCurrency(payload.withdraw.walletBalance)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Bank/UPI</dt>
              <dd className="font-mono text-gray-700">{payload.withdraw.bankUpiMasked}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate(notification.redirectLink || "/withdraw-requests");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#D96A86] bg-[#fef5f7] hover:bg-[#f8c6d0]/50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            {notification.title.toLowerCase().includes("request") && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate(
                      payload.withdraw?.affiliateId && payload.withdraw?.withdrawalId
                        ? `/withdraw-requests/${payload.withdraw.affiliateId}/${payload.withdraw.withdrawalId}`
                        : "/withdraw-requests"
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate("/withdraw-requests");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isOrder && payload?.order && (
        <div className="rounded-xl border border-gray-100 bg-[#fef5f7]/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Order details
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Order ID</dt>
              <dd className="font-mono font-medium text-gray-900">{payload.order.orderId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Customer</dt>
              <dd className="font-medium text-gray-900">{payload.order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Amount</dt>
              <dd className="font-medium text-gray-900">
                {formatCurrency(payload.order.amount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Payment method</dt>
              <dd className="text-gray-700">{payload.order.paymentMethod}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate(notification.redirectLink || "/orders");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Order
          </button>
        </div>
      )}

      {isReturn && payload?.return && (
        <div className="rounded-xl border border-gray-100 bg-[#fef5f7]/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Return details
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Order ID</dt>
              <dd className="font-mono font-medium text-gray-900">{payload.return.orderId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Product</dt>
              <dd className="font-medium text-gray-900">{payload.return.productName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-gray-500 text-xs">Return reason</dt>
              <dd className="text-sm text-gray-700">{payload.return.returnReason}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium text-gray-900">{payload.return.returnStatus}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate(notification.redirectLink || "/users");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            View Return
          </button>
        </div>
      )}

      {!isWithdraw && !isOrder && !isReturn && notification.redirectLink && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onNavigate(notification.redirectLink!);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
        >
          <Eye className="w-4 h-4" />
          View details
        </button>
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
  const {
    markAsRead,
    markAllAsRead,
    createNotification,
    filterNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<FilterValue>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createTargetRole, setCreateTargetRole] = useState<TargetRole>("all");
  const [createCategory, setCreateCategory] =
    useState<NotificationCategory>("system");
  const [createRedirectLink, setCreateRedirectLink] = useState("");

  const filtered = useMemo(
    () => filterNotifications(filter),
    [filter, filterNotifications]
  );

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    setSelectedNotification({ ...n, read: true });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = createTitle.trim();
    const description = createDescription.trim();
    if (!title || !description) return;

    createNotification({
      title,
      description,
      targetRole: createTargetRole,
      category: createCategory,
      redirectLink: createRedirectLink.trim() || undefined,
    });

    setCreateTitle("");
    setCreateDescription("");
    setCreateTargetRole("all");
    setCreateCategory("system");
    setCreateRedirectLink("");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-[#fef5f7] transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Notification
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

      {/* Create Notification Drawer */}
      <Drawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Notification"
        width="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="create-title"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Title
            </label>
            <input
              id="create-title"
              type="text"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              placeholder="Notification title"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="create-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="create-description"
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              placeholder="Short description"
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="create-target-role"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Target Role
            </label>
            <select
              id="create-target-role"
              value={createTargetRole}
              onChange={(e) => setCreateTargetRole(e.target.value as TargetRole)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
            >
              {TARGET_ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="create-category"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Category
            </label>
            <select
              id="create-category"
              value={createCategory}
              onChange={(e) =>
                setCreateCategory(e.target.value as NotificationCategory)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="create-redirect"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Redirect link (optional)
            </label>
            <input
              id="create-redirect"
              type="text"
              value={createRedirectLink}
              onChange={(e) => setCreateRedirectLink(e.target.value)}
              placeholder="/orders, /withdraw-requests, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
