"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  MoreVertical,
  Package,
  History,
  Plus,
  Minus,
  Boxes,
} from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { PRODUCT_CATEGORIES, DEFAULT_STOCK_THRESHOLD } from "@/lib/products-data";
import type { Product, ProductStockStatus } from "@/lib/products-data";
import { Drawer } from "@/components/ui/Drawer";
import { Filters, type FilterOption } from "@/components/ui/filters";
import { KpiCard } from "@/components/ui/kpiCard";
import Table from "@/components/Table";

const STOCK_LABELS: Record<ProductStockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

const STOCK_CLASSES: Record<ProductStockStatus, string> = {
  in_stock: "bg-green-100 text-green-800",
  low_stock: "bg-amber-100 text-amber-800",
  out_of_stock: "bg-red-100 text-red-800",
};

const STOCK_FILTER_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  { value: "in_stock", label: STOCK_LABELS.in_stock },
  { value: "low_stock", label: STOCK_LABELS.low_stock },
  { value: "out_of_stock", label: STOCK_LABELS.out_of_stock },
];

const CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "All categories" },
  ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
];

const STOCK_ADJUST_REASONS = [
  "Restock",
  "Sale / Order",
  "Return",
  "Damage / Write-off",
  "Correction",
  "Other",
] as const;

export interface StockHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  at: string;
  type: "add" | "reduce";
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function InventoryActionMenu({
  product,
  onUpdateStock,
  onViewHistory,
}: {
  product: Product;
  onUpdateStock: (p: Product) => void;
  onViewHistory: (p: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-[#fef5f7] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
          <Link
            href={`/products/${product.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left w-full"
          >
            <Eye className="w-4 h-4 shrink-0" />
            View Details
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onUpdateStock(product);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Package className="w-4 h-4 shrink-0" />
            Update Stock
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onUpdateStock(product);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Adjust Stock
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onViewHistory(product);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <History className="w-4 h-4 shrink-0" />
            View Stock History
          </button>
        </div>
      )}
    </div>
  );
}

export default function InventoryPage() {
  const { products, updateProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ProductStockStatus>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistoryEntry[]>([]);

  const kpis = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.stockStatus === "in_stock").length;
    const lowStock = products.filter((p) => p.stockStatus === "low_stock").length;
    const outOfStock = products.filter((p) => p.stockStatus === "out_of_stock").length;
    return { total, inStock, lowStock, outOfStock };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (statusFilter) list = list.filter((p) => p.stockStatus === statusFilter);
    return list;
  }, [products, search, categoryFilter, statusFilter]);

  const openUpdateDrawer = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const openHistoryDrawer = (product: Product) => {
    setSelectedProduct(product);
    setHistoryDrawerOpen(true);
  };

  const productHistory = useMemo(() => {
    if (!selectedProduct) return [];
    return stockHistory
      .filter((h) => h.productId === selectedProduct.id)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [stockHistory, selectedProduct]);

  const columns = useMemo(
    () => [
      {
        header: "Product",
        accessor: (row: Product) => (
          <div className="font-medium text-gray-900">{row.name}</div>
        ),
      },
      {
        header: "SKU",
        accessor: (row: Product) => (
          <span className="text-sm text-gray-600 font-mono">
            {row.sku ?? "—"}
          </span>
        ),
      },
      {
        header: "Category",
        accessor: (row: Product) => (
          <span className="text-sm text-gray-700">{row.category}</span>
        ),
      },
      {
        header: "Current Stock",
        accessor: (row: Product) => (
          <span className="font-medium text-gray-900">{row.stock}</span>
        ),
      },
      {
        header: "Threshold",
        accessor: (row: Product) => (
          <span className="text-sm text-gray-600">
            {row.stockThreshold ?? DEFAULT_STOCK_THRESHOLD}
          </span>
        ),
      },
      {
        header: "Status",
        accessor: (row: Product) => (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              STOCK_CLASSES[row.stockStatus]
            }`}
          >
            {STOCK_LABELS[row.stockStatus]}
          </span>
        ),
      },
      {
        header: "Last Updated",
        accessor: (row: Product) => (
          <span className="text-sm text-gray-500">{formatDate(row.updatedAt)}</span>
        ),
      },
      {
        header: "Action",
        cellClassName: "text-center",
        accessor: (row: Product) => (
          <div className="inline-flex justify-center w-full">
            <InventoryActionMenu
              product={row}
              onUpdateStock={openUpdateDrawer}
              onViewHistory={openHistoryDrawer}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Inventory Management
      </h1>

      {/* KPI Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <KpiCard
          title="Total Products"
          value={kpis.total.toLocaleString()}
          icon="shopping-cart"
          iconClassName="bg-blue-50 text-blue-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="In Stock"
          value={kpis.inStock.toLocaleString()}
          icon="user-check"
          iconClassName="bg-emerald-50 text-emerald-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Low Stock"
          value={kpis.lowStock.toLocaleString()}
          icon="trending-up"
          iconClassName="bg-amber-50 text-amber-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
        <KpiCard
          title="Out of Stock"
          value={kpis.outOfStock.toLocaleString()}
          icon="user-x"
          iconClassName="bg-red-50 text-red-600"
          className="min-w-[260px] md:min-w-0 shrink-0 md:shrink"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-[#fef5f7] rounded-2xl p-4 border border-gray-100">
        <Filters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by product name, SKU, or category..."
          searchPlaceholderMobile="Search..."
          categoryOptions={CATEGORY_OPTIONS}
          categoryValue={categoryFilter}
          onCategoryChange={setCategoryFilter}
          filterOptions={STOCK_FILTER_OPTIONS}
          filterValue={statusFilter}
          onFilterChange={(v) => setStatusFilter(v as "" | ProductStockStatus)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table<Product>
          data={filteredProducts}
          columns={columns}
          searchable={false}
          filterable={false}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {/* Update Stock Drawer */}
      <UpdateStockDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={(type, quantity, reason) => {
          if (!selectedProduct) return;
          const prev = selectedProduct.stock;
          const newStock = Math.max(
            0,
            type === "add" ? prev + quantity : prev - quantity
          );
          updateProduct(selectedProduct.id, { stock: newStock });
          setStockHistory((h) => [
            ...h,
            {
              id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              at: new Date().toISOString(),
              type,
              quantity,
              reason,
              previousStock: prev,
              newStock,
            },
          ]);
          setDrawerOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Stock History Drawer */}
      <Drawer
        open={historyDrawerOpen}
        onClose={() => {
          setHistoryDrawerOpen(false);
          setSelectedProduct(null);
        }}
        title={
          selectedProduct
            ? `Stock History — ${selectedProduct.name}`
            : "Stock History"
        }
        width="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              SKU: {selectedProduct.sku ?? "—"} · Current stock:{" "}
              <strong>{selectedProduct.stock}</strong>
            </p>
            {productHistory.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                No stock adjustments recorded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {productHistory.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          entry.type === "add"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.type === "add" ? (
                          <Plus className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.type === "add" ? "Added" : "Reduced"}{" "}
                          {entry.quantity} · {entry.reason}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(entry.at)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-sm text-gray-600">
                      {entry.previousStock} → {entry.newStock}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

function UpdateStockDrawer({
  open,
  onClose,
  product,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (type: "add" | "reduce", quantity: number, reason: string) => void;
}) {
  const [type, setType] = useState<"add" | "reduce">("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<(typeof STOCK_ADJUST_REASONS)[number]>(
    STOCK_ADJUST_REASONS[0]
  );

  const reset = () => {
    setType("add");
    setQuantity("");
    setReason(STOCK_ADJUST_REASONS[0]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Math.floor(Number(quantity)) || 0;
    if (q <= 0) return;
    if (product && type === "reduce" && q > product.stock) return;
    onSave(type, q, reason);
    reset();
  }

  if (!open) return null;

  const currentStock = product?.stock ?? 0;
  const qNum = Math.floor(Number(quantity)) || 0;
  const canReduce = type === "reduce" && qNum > 0 && qNum <= currentStock;
  const canAdd = type === "add" && qNum > 0;
  const valid = type === "add" ? canAdd : canReduce;

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title={product ? `Update Stock — ${product.name}` : "Update Stock"}
      width="md"
    >
      {product && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600">
            SKU: {product.sku ?? "—"} · Current stock:{" "}
            <strong className="text-gray-900">{currentStock}</strong>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add or Reduce
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType("add")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                  type === "add"
                    ? "border-[#D96A86] bg-[#fef5f7] text-[#D96A86]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              <button
                type="button"
                onClick={() => setType("reduce")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                  type === "reduce"
                    ? "border-[#D96A86] bg-[#fef5f7] text-[#D96A86]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Minus className="w-4 h-4" />
                Reduce
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="inv-qty" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="inv-qty"
              type="number"
              min={1}
              max={type === "reduce" ? currentStock : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent"
              placeholder={type === "reduce" ? `Max ${currentStock}` : "0"}
            />
            {type === "reduce" && qNum > currentStock && (
              <p className="mt-1 text-xs text-red-600">
                Cannot reduce more than current stock ({currentStock}).
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inv-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              id="inv-reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value as (typeof STOCK_ADJUST_REASONS)[number])
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent bg-white"
            >
              {STOCK_ADJUST_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="flex-1 py-3 rounded-xl bg-[#D96A86] text-white font-medium hover:bg-[#C85A76] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Update Stock
            </button>
          </div>
        </form>
      )}
    </Drawer>
  );
}
