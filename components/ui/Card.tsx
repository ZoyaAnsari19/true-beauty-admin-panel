"use client";

import React from "react";
import Image from "next/image";

export interface ProductOrderCardProps {
  productImage?: string | null;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  orderStatus: string;
  currency?: string;
  formatDate?: (dateStr: string) => string;
  onClick?: () => void;
  /** Show "Via Affiliate" badge when order was made through affiliate link */
  showAffiliateBadge?: boolean;
}

function defaultFormatCurrency(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}

function defaultFormatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductOrderCard({
  productImage,
  productName,
  price,
  quantity,
  totalAmount,
  orderDate,
  orderStatus,
  currency = "INR",
  formatDate = defaultFormatDate,
  onClick,
  showAffiliateBadge = false,
}: ProductOrderCardProps) {
  const statusColors: Record<string, string> = {
    delivered: "bg-green-50 text-green-700",
    completed: "bg-green-50 text-green-700",
    shipped: "bg-blue-50 text-blue-700",
    processing: "bg-amber-50 text-amber-700",
    returned: "bg-amber-50 text-amber-700",
    cancelled: "bg-red-50 text-red-700",
    refunded: "bg-teal-50 text-teal-700",
    pending: "bg-gray-50 text-gray-700",
    inprogress: "bg-amber-50 text-amber-700",
  };
  const statusKey = orderStatus.toLowerCase().replace(/\s+/g, "");
  const statusClass = statusColors[statusKey] ?? "bg-gray-50 text-gray-700";

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-2xl border border-[#f8c6d0]/60 bg-white shadow-sm hover:shadow-md transition-shadow ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
        {/* Product image */}
        <div className="shrink-0 w-full sm:w-24 h-24 sm:h-24 rounded-xl bg-[#fef5f7] overflow-hidden flex items-center justify-center">
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-light">
              —
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {productName}
            </h3>
            <p className="text-sm font-medium text-red-600">
              {defaultFormatCurrency(price, currency)}
            </p>
            <div className="flex items-center text-xs text-gray-500 flex-wrap gap-y-1">
              <div className="flex items-center gap-x-4">
                <span>Qty: {quantity}</span>
                <span>{formatDate(orderDate)}</span>
              </div>
              <div className="flex-1 flex justify-center gap-2 min-w-0">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                >
                  {orderStatus}
                </span>
                {showAffiliateBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200/60">
                    Via Affiliate
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="text-base font-semibold text-gray-900">
              {defaultFormatCurrency(totalAmount, currency)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
