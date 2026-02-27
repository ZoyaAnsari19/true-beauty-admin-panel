"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  FileText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useUsers } from "@/lib/users-context";
import { useOrders } from "@/lib/orders-context";
import { useAffiliates } from "@/lib/affiliates-context";
import { Tabination, type TabItem } from "@/components/ui/Tabination";
import { ProductOrderCard } from "@/components/ui/Card";
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
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-4 mb-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fef5f7] border border-[#f8c6d0]/40 min-w-[200px] md:min-w-0 shrink-0 md:shrink">
        <ShoppingBag className="w-5 h-5 text-gray-600 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{countLabel}</p>
          <p className="text-xl font-semibold text-gray-900">{count}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fef5f7] border border-[#f8c6d0]/40 min-w-[200px] md:min-w-0 shrink-0 md:shrink">
        <IndianRupee className="w-5 h-5 text-gray-600 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{amountLabel}</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}

function OrderCardsList({
  items,
  userId,
}: {
  items: OrderItem[];
  userId: string;
}) {
  const router = useRouter();
  const { orders } = useOrders();
  const { affiliates } = useAffiliates();

  const resolveOrderId = (item: OrderItem): string | null => {
    const byId = orders.find((o) => o.id === item.orderId);
    const order = byId ?? orders.find((o) =>
      o.items.some(
        (orderItem) =>
          orderItem.productName === item.productName &&
          orderItem.totalAmount === item.totalAmount
      )
    );
    return order?.id ?? null;
  };

  const getAffiliateByOrderId = (orderId: string) =>
    affiliates.find((a) =>
      a.commissionLogs.some((log) => log.orderId === orderId)
    );

  const resolveOrderAndItemId = (
    item: OrderItem
  ): { orderId: string; itemId: string } | null => {
    const byId = orders.find((o) => o.id === item.orderId);
    const order = byId ?? orders.find((o) =>
      o.items.some(
        (orderItem) =>
          orderItem.productName === item.productName &&
          orderItem.totalAmount === item.totalAmount
      )
    );
    if (!order) return null;
    const orderItem = order.items.find(
      (i) =>
        i.productName === item.productName && i.totalAmount === item.totalAmount
    );
    if (!orderItem) return null;
    return { orderId: order.id, itemId: orderItem.id };
  };

  const handleCardClick = (item: OrderItem) => {
    const resolved = resolveOrderAndItemId(item);
    if (!resolved) return;
    const { orderId, itemId } = resolved;
    router.push(
      `/users/${userId}/orderDetails?orderId=${encodeURIComponent(orderId)}&itemId=${encodeURIComponent(itemId)}`
    );
  };

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">No items to show.</p>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const orderId = resolveOrderId(item);
        const affiliate = orderId ? getAffiliateByOrderId(orderId) : undefined;
        return (
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
            onClick={() => handleCardClick(item)}
            showAffiliateBadge={!!affiliate}
          />
        );
      })}
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const { getUserById, setUserStatus } = useUsers();
  const { affiliates } = useAffiliates();
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
        <div className="p-6 bg-white space-y-6">
          {/* Name, Email, Mobile — single row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                <p className="text-gray-900 font-medium mt-0.5 truncate">{user.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-gray-900 font-medium mt-0.5 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</p>
                <p className="text-gray-900 font-medium mt-0.5">{user.mobile}</p>
              </div>
            </div>
          </div>
          {/* DOB, Gender — same 3-col grid as Name/Email/Mobile so Gender aligns with Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Cake className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of birth</p>
                <p className="text-gray-900 font-medium mt-0.5">{formatDate(user.dob)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <VenusAndMars className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</p>
                <p className="text-gray-900 font-medium mt-0.5">{user.gender}</p>
              </div>
            </div>
            <div />
          </div>
          {/* Divider after DOB / Gender */}
          <div className="border-t border-gray-200 my-0" role="separator" aria-hidden="true" />
          {/* City, State, Pincode — single row with equal spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">City</p>
                <p className="text-gray-900 font-medium mt-0.5 truncate">{user.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">State</p>
                <p className="text-gray-900 font-medium mt-0.5">{user.state}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
                <Hash className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</p>
                <p className="text-gray-900 font-medium mt-0.5">{user.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address — separate card below City row */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fef5f7] shrink-0">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
              <p className="text-gray-900 font-medium mt-0.5">{user.address}</p>
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

  const kycStatus = user.kyc?.status ?? "not_submitted";
  const kycStatusLabel: Record<string, string> = {
    not_submitted: "Not Submitted",
    pending: "Pending Review",
    verified: "Verified",
  };
  const kycStatusClass: Record<string, string> = {
    not_submitted: "bg-gray-100 text-gray-700",
    pending: "bg-amber-50 text-amber-700",
    verified: "bg-emerald-50 text-emerald-700",
  };

  const kycContent = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              KYC &amp; Verification
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Required for withdrawals, not for product orders.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              kycStatusClass[kycStatus] ??
              "bg-gray-100 text-gray-700"
            }`}
          >
            {kycStatus === "verified" ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {kycStatusLabel[kycStatus] ?? "Not Submitted"}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Aadhar Card */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Aadhar Card <span className="text-red-500">*</span>
            </p>
            <div className="mt-2 rounded-xl border-2 border-dashed border-gray-200 bg-[#fef5f7]/60 px-4 py-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.kyc?.aadharUrl ? "Uploaded Aadhar document" : "No document uploaded"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.kyc?.aadharUrl
                      ? "Click view to open the document in a new tab."
                      : "User has not submitted Aadhar yet."}
                  </p>
                </div>
              </div>
              {user.kyc?.aadharUrl && (
                <a
                  href={user.kyc.aadharUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#D96A86] bg-white border border-[#f8c6d0]/70 hover:bg-[#fef5f7] transition-colors"
                >
                  View Aadhar
                </a>
              )}
            </div>
          </div>

          {/* PAN Card */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              PAN Card <span className="text-red-500">*</span>
            </p>
            <div className="mt-2 rounded-xl border-2 border-dashed border-gray-200 bg-[#fef5f7]/60 px-4 py-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.kyc?.panUrl ? "Uploaded PAN document" : "No document uploaded"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.kyc?.panUrl
                      ? "Click view to open the document in a new tab."
                      : "User has not submitted PAN yet."}
                  </p>
                </div>
              </div>
              {user.kyc?.panUrl && (
                <a
                  href={user.kyc.panUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#D96A86] bg-white border border-[#f8c6d0]/70 hover:bg-[#fef5f7] transition-colors"
                >
                  View PAN
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-[#fff7f8]">
          <p className="text-xs text-gray-500">
            * KYC verification is required to enable withdrawal functionality.
            Users can still place product orders without KYC verification.
          </p>
        </div>
      </div>
    </div>
  );

  const purchasesContent = (
    <div>
      <OrdersTabSummary
        count={user.purchases.length}
        total={totalAmount(user.purchases)}
        countLabel="Total Orders"
        amountLabel="Total Amount"
      />
      <OrderCardsList items={user.purchases} userId={id} />
    </div>
  );

  const returnsContent = (
    <div>
      <OrdersTabSummary
        count={uniqueOrderCount(user.returnsOrders)}
        total={totalAmount(user.returnsOrders)}
        countLabel="Total Returns"
        amountLabel="Total Amount"
      />
      <OrderCardsList items={user.returnsOrders} userId={id} />
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
      <OrderCardsList items={user.cancelledOrders} userId={id} />
    </div>
  );

  const refundsContent = (
    <div>
      <OrdersTabSummary
        count={uniqueOrderCount(user.refundedOrders)}
        total={totalAmount(user.refundedOrders)}
        countLabel="Total Refunds"
        amountLabel="Total Amount"
      />
      <OrderCardsList items={user.refundedOrders} userId={id} />
    </div>
  );

  const affiliateForUser = affiliates.find((a) => a.email === user.email);

  const walletContent = (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Wallet Amount
          </h2>
        </div>
        <div className="p-6">
          {affiliateForUser ? (
            <>
              <p className="text-sm text-gray-600 mb-2">
                Current affiliate wallet balance for this user.
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(affiliateForUser.walletBalance)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              This user does not have an affiliate wallet.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const tabs: TabItem[] = affiliateForUser
    ? [
        { id: "purchases", label: "Orders", content: purchasesContent },
        { id: "returns", label: "Returns", content: returnsContent },
        { id: "cancelled", label: "Cancelled", content: cancelledContent },
        { id: "refunds", label: "Refunds", content: refundsContent },
        { id: "wallet", label: "Wallet Amount", content: walletContent },
        { id: "basic", label: "Basic Info", content: basicInfoContent },
        { id: "kyc", label: "KYC", content: kycContent },
      ]
    : [
        { id: "purchases", label: "Orders", content: purchasesContent },
        { id: "returns", label: "Returns", content: returnsContent },
        { id: "cancelled", label: "Cancelled", content: cancelledContent },
        { id: "refunds", label: "Refunds", content: refundsContent },
        { id: "basic", label: "Basic Info", content: basicInfoContent },
        { id: "kyc", label: "KYC", content: kycContent },
      ];

  return (
    <div className="space-y-6">
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* Tabs */}
      <Tabination tabs={tabs} defaultTabId="purchases" />
    </div>
  );
}
