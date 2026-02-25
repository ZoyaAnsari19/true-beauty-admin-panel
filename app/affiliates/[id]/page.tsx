"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  CheckCircle2,
  IndianRupee,
  Mail,
  Phone,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { KpiCard } from "@/components/ui/kpiCard";
import { useAffiliates } from "@/lib/affiliates-context";
import {
  AFFILIATE_STATUS_CLASSES,
  AFFILIATE_STATUS_LABELS,
  WITHDRAWAL_STATUS_CLASSES,
  WITHDRAWAL_STATUS_LABELS,
} from "@/lib/affiliates-ui";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AffiliateDetailPage() {
  const params = useParams();
  const {
    getAffiliateById,
    setAffiliateStatus,
    updateCommissionRate,
    adjustWallet,
    updateWithdrawalStatus,
  } = useAffiliates();

  const id =
    typeof params.id === "string" ? params.id : (params.id?.[0] as string);
  const affiliate = id ? getAffiliateById(id) : undefined;

  const [commissionRateDraft, setCommissionRateDraft] = useState<string>(() =>
    affiliate != null ? String(Number(affiliate.commissionRate)) : "0"
  );
  const [adjustAmount, setAdjustAmount] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState<string>("");

  useEffect(() => {
    if (affiliate != null) {
      const normalized = String(Number(affiliate.commissionRate));
      setCommissionRateDraft(normalized === "NaN" ? "0" : normalized);
    }
  }, [affiliate?.id, affiliate?.commissionRate]);

  if (!id || !affiliate) {
    return (
      <div className="space-y-6">
        <Link
          href="/affiliates"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Affiliates
        </Link>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Affiliate not found.</p>
        </div>
      </div>
    );
  }

  const handleToggleBlock = () => {
    const nextStatus = affiliate.status === "active" ? "blocked" : "active";
    const confirmed = window.confirm(
      nextStatus === "blocked"
        ? "Block this affiliate? They will stop earning new commission."
        : "Unblock this affiliate and allow them to earn again?"
    );
    if (!confirmed) return;
    setAffiliateStatus(affiliate.id, nextStatus);
  };

  const handleCommissionInputChange = (raw: string) => {
    let s = raw.replace(/[^\d.]/g, "");
    const parts = s.split(".");
    if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
    else if (parts.length === 2) s = parts[0] + "." + parts[1].slice(0, 2);
    if (s === "" || s === ".") {
      setCommissionRateDraft(s);
      return;
    }
    if (s.endsWith(".") || s === "0.") {
      setCommissionRateDraft(s);
      return;
    }
    const num = parseFloat(s);
    if (Number.isNaN(num)) {
      setCommissionRateDraft("0");
      return;
    }
    const clamped = Math.min(100, Math.max(0, num));
    setCommissionRateDraft(clamped.toString());
  };

  const handleCommissionSave = () => {
    const value = parseFloat(commissionRateDraft);
    if (!Number.isFinite(value) || value < 0 || value > 100) return;
    updateCommissionRate(affiliate.id, value);
  };

  const handleWalletAdjust = () => {
    const value = Number(adjustAmount);
    if (!Number.isFinite(value) || value === 0) return;
    adjustWallet(affiliate.id, value, adjustReason);
    setAdjustAmount("");
    setAdjustReason("");
  };

  const handleWithdrawalAction = (
    withdrawalId: string,
    action: "approve" | "reject"
  ) => {
    const target = affiliate.withdrawals.find((w) => w.id === withdrawalId);
    if (!target || target.status !== "pending") return;

    const confirmed = window.confirm(
      action === "approve"
        ? `Approve withdrawal of ${formatCurrency(target.amount)}?`
        : "Reject this withdrawal request?"
    );
    if (!confirmed) return;

    updateWithdrawalStatus(
      affiliate.id,
      withdrawalId,
      action === "approve" ? "approved" : "rejected"
    );
  };

  const statusClass =
    AFFILIATE_STATUS_CLASSES[affiliate.status] ?? "bg-gray-100 text-gray-700";

  const totalPayouts = affiliate.withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/affiliates"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Affiliates
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Affiliate
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              {affiliate.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span>{affiliate.email}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>{affiliate.phone}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>Joined {formatDate(affiliate.joinedAt)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}
            >
              {AFFILIATE_STATUS_LABELS[affiliate.status] ?? affiliate.status}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#D96A86]" />
              {affiliate.commissionRate.toFixed(1).replace(/\.0$/, "")}% base
              commission
            </span>
            <button
              type="button"
              onClick={handleToggleBlock}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                affiliate.status === "active"
                  ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                  : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              {affiliate.status === "active" ? (
                <>
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block affiliate</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unblock affiliate</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">
              Referral code:
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 font-mono text-xs text-gray-800">
              {affiliate.referralCode}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>{affiliate.email}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{affiliate.phone}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          title="Total Referrals"
          value={affiliate.totalReferrals.toLocaleString()}
          icon="users"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="Total Orders"
          value={affiliate.totalOrders.toLocaleString()}
          icon="shopping-cart"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Total Commission"
          value={formatCurrency(affiliate.totalCommission)}
          icon="indian-rupee"
          iconClassName="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title="Wallet Balance"
          value={formatCurrency(affiliate.walletBalance)}
          icon="user-check"
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Commission Logs
              </h2>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              {affiliate.commissionLogs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No commission activity recorded yet.
                </p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-2.5 pr-4 text-left font-semibold">
                        Date
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Description
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Type
                      </th>
                      <th className="py-2.5 pl-4 text-right font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliate.commissionLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-2.5 pr-4 whitespace-nowrap text-gray-700">
                          {formatDate(log.date)}
                        </td>
                        <td className="py-2.5 px-4 text-gray-800">
                          {log.description}
                          {log.orderId && (
                            <span className="ml-1 text-xs text-gray-500">
                              (Order {log.orderId})
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap text-xs text-gray-600">
                          {log.type === "order_commission"
                            ? "Order commission"
                            : log.type === "manual_adjustment"
                              ? "Manual adjustment"
                              : "Withdrawal"}
                        </td>
                        <td className="py-2.5 pl-4 text-right whitespace-nowrap">
                          <span
                            className={
                              log.amount >= 0
                                ? "text-emerald-700 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {log.amount >= 0 ? "+" : "-"}
                            {formatCurrency(Math.abs(log.amount))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Withdrawal History
              </h2>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              {affiliate.withdrawals.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No withdrawal requests yet.
                </p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-2.5 pr-4 text-left font-semibold">
                        ID
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Amount
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Method
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Requested
                      </th>
                      <th className="py-2.5 px-4 text-left font-semibold">
                        Status
                      </th>
                      <th className="py-2.5 pl-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliate.withdrawals.map((w) => (
                      <tr
                        key={w.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-2.5 pr-4 whitespace-nowrap text-gray-700">
                          {w.id}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap text-gray-900 font-medium">
                          {formatCurrency(w.amount)}
                        </td>
                        <td className="py-2.5 px-4 text-gray-700">
                          {w.method}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap text-gray-700">
                          {formatDate(w.requestedAt)}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              WITHDRAWAL_STATUS_CLASSES[w.status] ??
                              "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {WITHDRAWAL_STATUS_LABELS[w.status] ?? w.status}
                          </span>
                        </td>
                        <td className="py-2.5 pl-4 whitespace-nowrap text-right">
                          {w.status === "pending" ? (
                            <div className="inline-flex gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleWithdrawalAction(w.id, "approve")
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleWithdrawalAction(w.id, "reject")
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              {w.processedAt
                                ? `Processed on ${formatDate(w.processedAt)}`
                                : "-"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {affiliate.withdrawals.length > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  Total approved payouts:{" "}
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(totalPayouts)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Commission Settings
            </h2>
            <p className="text-xs text-gray-500">
              Update this affiliate&apos;s base commission percentage.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={commissionRateDraft}
                  onChange={(e) => handleCommissionInputChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
                  aria-label="Commission percentage"
                />
                <span className="text-sm font-medium text-gray-700">%</span>
              </div>
              <button
                type="button"
                onClick={handleCommissionSave}
                disabled={
                  commissionRateDraft === "" ||
                  Number.isNaN(parseFloat(commissionRateDraft)) ||
                  parseFloat(commissionRateDraft) < 0 ||
                  parseFloat(commissionRateDraft) > 100
                }
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Adjust Wallet Manually
            </h2>
            <p className="text-xs text-gray-500">
              Credit or debit this affiliate&apos;s wallet and add a note for
              future reference.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Amount (use negative value to debit)
                </label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#fef5f7] text-[#D96A86]">
                    <Wallet className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
                    placeholder="e.g. 500 or -250"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Reason / note
                </label>
                <textarea
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent resize-none"
                  placeholder="Short explanation for this adjustment..."
                />
              </div>
              <button
                type="button"
                onClick={handleWalletAdjust}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!adjustAmount}
              >
                Apply adjustment
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              Summary
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Total commission earned:</span>{" "}
                {formatCurrency(affiliate.totalCommission)}
              </p>
              <p>
                <span className="font-medium">Total payouts processed:</span>{" "}
                {formatCurrency(totalPayouts)}
              </p>
              <p>
                <span className="font-medium">Current wallet balance:</span>{" "}
                {formatCurrency(affiliate.walletBalance)}
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              These values are for reporting inside the admin panel and do not
              replace your accounting system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

