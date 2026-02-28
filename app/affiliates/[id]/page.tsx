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
    updateWithdrawalStatus,
  } = useAffiliates();

  const id =
    typeof params.id === "string" ? params.id : (params.id?.[0] as string);
  const affiliate = id ? getAffiliateById(id) : undefined;

  const [commissionRateDraft, setCommissionRateDraft] = useState<string>(() =>
    affiliate != null ? String(Number(affiliate.commissionRate)) : "0"
  );
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrationsPage, setRegistrationsPage] = useState(1);
  useEffect(() => {
    if (affiliate != null) {
      const normalized = String(Number(affiliate.commissionRate));
      setCommissionRateDraft(normalized === "NaN" ? "0" : normalized);
      setRegistrationsPage(1);
      setShowRegistrations(false);
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

  const referredUsers = affiliate.referredUsers ?? [];
  const REGISTRATIONS_PER_PAGE = 5;
  const totalRegistrationPages =
    referredUsers.length === 0
      ? 1
      : Math.ceil(referredUsers.length / REGISTRATIONS_PER_PAGE);
  const currentRegistrationPage = Math.min(
    registrationsPage,
    totalRegistrationPages
  );
  const registrationStartIndex =
    (currentRegistrationPage - 1) * REGISTRATIONS_PER_PAGE;
  const currentRegistrations = referredUsers.slice(
    registrationStartIndex,
    registrationStartIndex + REGISTRATIONS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <Link
        href="/affiliates"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Affiliates
      </Link>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6">
        <button
          type="button"
          onClick={() => {
            setShowRegistrations(true);
            setRegistrationsPage(1);
          }}
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink text-left"
        >
          <KpiCard
            title="Total Registered"
            value={affiliate.totalReferrals.toLocaleString()}
            icon="users"
            iconClassName="bg-blue-50 text-blue-600"
            className="w-full cursor-pointer"
            helperText="Click to view"
          />
        </button>
        <KpiCard
          title="Total Orders"
          value={affiliate.totalOrders.toLocaleString()}
          icon="shopping-cart"
          iconClassName="bg-amber-50 text-amber-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Wallet Balance"
          value={formatCurrency(affiliate.walletBalance)}
          icon="user-check"
          iconClassName="bg-emerald-50 text-emerald-700"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
      </div>

      {showRegistrations && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Registered Users
              </h2>
              <p className="text-xs text-gray-600">
                Users who registered via this affiliate&apos;s referral.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRegistrations(false)}
              className="text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {currentRegistrations.length === 0 ? (
              <p className="text-sm text-gray-500">
                No registered users found for this affiliate.
              </p>
            ) : (
              <>
                <ul className="space-y-3">
                  {currentRegistrations.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#fef5f7]/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] text-gray-500">
                          Registered on{" "}
                          {new Date(user.registeredAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {referredUsers.length > REGISTRATIONS_PER_PAGE && (
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-2">
                    <p className="text-xs text-gray-500">
                      Page {currentRegistrationPage} of {totalRegistrationPages}
                    </p>
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRegistrationsPage((prev) =>
                            Math.max(1, prev - 1)
                          )
                        }
                        disabled={currentRegistrationPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRegistrationsPage((prev) =>
                            Math.min(totalRegistrationPages, prev + 1)
                          )
                        }
                        disabled={
                          currentRegistrationPage === totalRegistrationPages
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Affiliate
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              {affiliate.name}
            </h1>
            <p className="text-xs text-gray-600">
              Joined {formatDate(affiliate.joinedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}
            >
              {AFFILIATE_STATUS_LABELS[affiliate.status] ?? affiliate.status}
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
        <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                Referral code:
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 font-mono text-xs text-gray-800">
                {affiliate.referralCode}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span className="truncate max-w-[160px] sm:max-w-xs">
                {affiliate.email}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 ml-auto">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{affiliate.phone}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-[#fef5f7] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Withdrawal History
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {affiliate.withdrawals.length === 0 ? (
              <p className="text-sm text-gray-500">
                No withdrawal requests yet.
              </p>
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="md:hidden space-y-3">
                  {affiliate.withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-xl border border-gray-100 bg-[#fef5f7]/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {w.id}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(w.amount)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{w.method}</p>
                      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-600">
                        <span>Requested {formatDate(w.requestedAt)}</span>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            WITHDRAWAL_STATUS_CLASSES[w.status] ??
                            "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {WITHDRAWAL_STATUS_LABELS[w.status] ?? w.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        {w.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleWithdrawalAction(w.id, "approve")
                              }
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleWithdrawalAction(w.id, "reject")
                              }
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
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
                </div>
              </>
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
    </div>
  );
}

