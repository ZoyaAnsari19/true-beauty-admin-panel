"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useOrders } from "@/lib/orders-context";
import type { OrderStatus, PaymentStatus } from "@/lib/orders-data";
import Table from "@/components/Table";
import { Filters, type FilterOption } from "@/components/ui/filters";
import { KpiCard } from "@/components/ui/kpiCard";
import {
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_CLASSES,
  PAYMENT_STATUS_LABELS,
} from "@/lib/orders-ui";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "processing", label: ORDER_STATUS_LABELS.processing },
  { value: "shipped", label: ORDER_STATUS_LABELS.shipped },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
  { value: "returned", label: ORDER_STATUS_LABELS.returned },
  { value: "refunded", label: ORDER_STATUS_LABELS.refunded },
];

const PAYMENT_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "", label: "All payments" },
  { value: "pending", label: PAYMENT_STATUS_LABELS.pending },
  { value: "paid", label: PAYMENT_STATUS_LABELS.paid },
  { value: "failed", label: PAYMENT_STATUS_LABELS.failed },
  { value: "refunded", label: PAYMENT_STATUS_LABELS.refunded },
];

export default function OrdersPage() {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    "" | PaymentStatus
  >("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((o) => o.orderStatus === statusFilter);
    }
    if (paymentStatusFilter) {
      list = list.filter((o) => o.paymentStatus === paymentStatusFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((o) => new Date(o.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      // include entire end day
      to.setHours(23, 59, 59, 999);
      list = list.filter((o) => new Date(o.createdAt) <= to);
    }
    return list;
  }, [orders, search, statusFilter, paymentStatusFilter, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "refunded")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "pending" || o.orderStatus === "processing"
    ).length;
    const refundRequests = orders.filter((o) => o.refundStatus === "requested")
      .length;
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      refundRequests,
    };
  }, [orders]);

  const columns = [
    {
      header: "Order ID",
      accessor: (order: (typeof orders)[number]) => (
        <span className="font-medium text-gray-900">{order.id}</span>
      ),
    },
    {
      header: "Customer",
      accessor: (order: (typeof orders)[number]) => (
        <span className="text-sm text-gray-800">{order.customerName}</span>
      ),
    },
    {
      header: "Products",
      accessor: (order: (typeof orders)[number]) => (
        <span className="text-sm text-gray-700">{order.productsCount}</span>
      ),
    },
    {
      header: "Total Amount",
      accessor: (order: (typeof orders)[number]) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(order.totalAmount)}
        </span>
      ),
    },
    {
      header: "Payment Method",
      accessor: (order: (typeof orders)[number]) => (
        <span className="text-xs uppercase tracking-wide text-gray-700">
          {order.paymentMethod.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Payment Status",
      accessor: (order: (typeof orders)[number]) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            PAYMENT_STATUS_CLASSES[order.paymentStatus] ??
            "bg-gray-50 text-gray-700"
          }`}
        >
          {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
        </span>
      ),
    },
    {
      header: "Order Status",
      accessor: (order: (typeof orders)[number]) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            ORDER_STATUS_CLASSES[order.orderStatus] ??
            "bg-gray-50 text-gray-700"
          }`}
        >
          {ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
        </span>
      ),
    },
    {
      header: "Order Date",
      accessor: (order: (typeof orders)[number]) => (
        <span className="text-sm text-gray-600">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      header: "Actions",
      cellClassName: "text-right",
      accessor: (order: (typeof orders)[number]) => (
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#D96A86] bg-[#fef5f7] hover:bg-[#f8c6d0] transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <KpiCard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          icon="shopping-cart"
          iconClassName="bg-green-50 text-green-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon="indian-rupee"
          iconClassName="bg-purple-50 text-purple-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Pending / Processing"
          value={kpis.pendingOrders.toLocaleString()}
          icon="trending-up"
          iconClassName="bg-amber-50 text-amber-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Refund Requests"
          value={kpis.refundRequests.toLocaleString()}
          icon="user-x"
          iconClassName="bg-red-50 text-red-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
          <div className="flex-1">
            <Filters
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search by Order ID or customer..."
              filterOptions={STATUS_FILTER_OPTIONS}
              filterValue={statusFilter}
              onFilterChange={(value) =>
                setStatusFilter(value as "" | OrderStatus)
              }
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={paymentStatusFilter}
              onChange={(e) =>
                setPaymentStatusFilter(e.target.value as "" | PaymentStatus)
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
            >
              {PAYMENT_STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
          <p className="text-gray-500 mb-2 text-sm sm:text-base">
            No orders match your filters.
          </p>
          <p className="text-xs text-gray-400">
            Try adjusting the date range or clearing filters.
          </p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-xs font-semibold text-gray-500">
                      {order.id}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.productsCount} items ·{" "}
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          PAYMENT_STATUS_CLASSES[order.paymentStatus] ??
                          "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                          order.paymentStatus}
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          ORDER_STATUS_CLASSES[order.orderStatus] ??
                          "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.orderStatus] ??
                          order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#D96A86] bg-[#fef5f7] hover:bg-[#f8c6d0] transition-colors shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table
              data={filteredOrders}
              columns={columns}
              searchable={false}
              filterable={false}
              itemsPerPage={10}
            />
          </div>
        </>
      )}
    </div>
  );
}

