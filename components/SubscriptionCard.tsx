"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, AlertTriangle, Calendar, IndianRupee } from "lucide-react";
import { useSubscription } from "@/lib/subscription-context";

const NEAR_EXPIRY_DAYS = 7;

export function SubscriptionCard() {
  const { subscription, remainingDays } = useSubscription();

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Subscription
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              No active plan. Subscribe to access all admin features.
            </p>
            <Link
              href="/subscription"
              className="inline-flex items-center justify-center rounded-xl bg-[#D96A86] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#C85A76] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#D96A86] focus-visible:ring-offset-2"
            >
              Buy Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = subscription.status === "expired";
  const isNearExpiry = !isExpired && remainingDays <= NEAR_EXPIRY_DAYS;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isExpired ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Current Plan
            </h2>
            <p className="text-2xl font-semibold text-gray-900 mt-0.5">
              {subscription.planName}
            </p>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {subscription.price.toLocaleString("en-IN")}/month
            </p>
          </div>
        </div>
        {isExpired && (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
            Expired
          </span>
        )}
        {isNearExpiry && !isExpired && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {remainingDays} day{remainingDays !== 1 ? "s" : ""} left
          </span>
        )}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start date
          </span>
          <span className="font-medium text-gray-900">
            {formatDate(subscription.startDate)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Expiry date
          </span>
          <span className="font-medium text-gray-900">
            {formatDate(subscription.expiryDate)}
          </span>
        </div>
        {!isExpired && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Remaining</span>
            <span className="font-semibold text-gray-900">
              {remainingDays} day{remainingDays !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {isNearExpiry && !isExpired && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-800">
              Your plan expires in {remainingDays} day{remainingDays !== 1 ? "s" : ""}.
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Renew now to avoid interruption.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700"
              >
                Renew Plan
              </Link>
            </div>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-rose-800">
              Your plan has expired.
            </p>
            <p className="text-xs text-rose-700 mt-0.5">
              Subscribe or renew to continue using the admin panel.
            </p>
            <Link
              href="/subscription"
              className="inline-flex items-center justify-center rounded-lg bg-[#D96A86] px-3 py-2 text-xs font-medium text-white hover:bg-[#C85A76] mt-3"
            >
              Buy Plan
            </Link>
          </div>
        </div>
      )}

      {!isExpired && !isNearExpiry && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/subscription"
            className="text-sm font-medium text-[#D96A86] hover:text-[#C85A76]"
          >
            Change or renew plan →
          </Link>
        </div>
      )}
    </div>
  );
}
