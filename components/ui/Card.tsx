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
    instock: "bg-emerald-50 text-emerald-700",
    lowstock: "bg-amber-50 text-amber-700",
    outofstock: "bg-red-50 text-red-700",
  };
  const statusKey = orderStatus.toLowerCase().replace(/\s+/g, "");
  const statusClass = statusColors[statusKey] ?? "bg-gray-50 text-gray-700";

  return (
    <div
      className={`flex flex-col h-full p-4 rounded-2xl border border-[#f8c6d0]/60 bg-white shadow-sm hover:shadow-md transition-shadow ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      {/* Product image on top */}
      <div className="w-full rounded-xl bg-[#fef5f7] overflow-hidden flex items-center justify-center">
        {productImage ? (
          <Image
            src={productImage}
            alt={productName}
            width={320}
            height={192}
            className="w-full h-40 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-40 sm:h-48 flex items-center justify-center text-gray-400 text-3xl font-light">
            —
          </div>
        )}
      </div>

      {/* Structured product details below */}
      <div className="mt-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {productName}
            </h3>
          </div>
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusClass}`}
          >
            {orderStatus}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Qty: {quantity}</span>
            <span>{formatDate(orderDate)}</span>
            {showAffiliateBadge && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200/60">
                Via Affiliate
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-red-600">
            {defaultFormatCurrency(totalAmount, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
