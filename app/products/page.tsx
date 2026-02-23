"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Eye, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import type { Product, ProductStatus } from "@/lib/products-data";
import type { ProductFormValues } from "@/lib/products-context";
import { Drawer } from "@/components/ui/Drawer";
import { ProductForm } from "@/components/ui/ProductForm";
import Table from "@/components/Table";
import { Filters, type FilterOption } from "@/components/ui/filters";
import { KpiCard } from "@/components/ui/kpiCard";

const STOCK_LABELS: Record<string, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const STOCK_CLASSES: Record<string, string> = {
  in_stock: "bg-green-50 text-green-700",
  low_stock: "bg-amber-50 text-amber-700",
  out_of_stock: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  draft: "Draft",
  inactive: "Inactive",
};

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: STATUS_LABELS.active },
  { value: "draft", label: STATUS_LABELS.draft },
  { value: "inactive", label: STATUS_LABELS.inactive },
];

const CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "All categories" },
  { value: "Skincare", label: "Skincare" },
  { value: "Makeup", label: "Makeup" },
  { value: "Bath & Body", label: "Bath & Body" },
  { value: "Haircare", label: "Haircare" },
  { value: "Fragrance", label: "Fragrance" },
  { value: "Wellness", label: "Wellness" },
  { value: "Gifting", label: "Gifting" },
  { value: "Jewellery", label: "Jewellery" },
  { value: "Offers", label: "Offers" },
];

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-100 text-gray-700",
  inactive: "bg-red-50 text-red-700",
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function ProductActionsMenu({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-[#fef5f7] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
          <Link
            href={`/products/${product.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(product);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(product);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const { products, addProduct, updateProduct, softDeleteProduct } = useProducts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ProductStatus>("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const kpis = useMemo(() => {
    const totalProducts = products.length;
    const activeCount = products.filter((p) => p.status === "active").length;
    const draftCount = products.filter((p) => p.status === "draft").length;
    const inactiveCount = products.filter((p) => p.status === "inactive").length;
    const lowStockCount = products.filter((p) => p.stockStatus === "low_stock").length;
    const outOfStockCount = products.filter((p) => p.stockStatus === "out_of_stock").length;
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    );

    return {
      totalProducts,
      activeCount,
      draftCount,
      inactiveCount,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter) {
      list = list.filter((p) => p.status === statusFilter);
    }

    return list;
  }, [products, search, categoryFilter, statusFilter]);

  const handleAdd = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Remove "${product.name}" from the list? This can be restored later.`)) {
      softDeleteProduct(product.id);
    }
  };

  const handleFormSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
    } else {
      addProduct(values);
    }
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      header: "Product name",
      accessor: (product: Product) => (
        <div className="font-medium text-gray-900">{product.name}</div>
      ),
    },
    {
      header: "Category",
      accessor: (product: Product) => (
        <span className="text-sm text-gray-700">{product.category}</span>
      ),
    },
    {
      header: "Price",
      accessor: (product: Product) => (
        <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
      ),
    },
    {
      header: "Stock",
      accessor: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900 font-medium">{product.stock}</span>
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              STOCK_CLASSES[product.stockStatus] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {STOCK_LABELS[product.stockStatus] ?? product.stockStatus}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (product: Product) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            STATUS_CLASSES[product.status] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {STATUS_LABELS[product.status] ?? product.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cellClassName: "text-center",
      accessor: (product: Product) => (
        <div className="inline-flex justify-center w-full">
          <ProductActionsMenu
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <KpiCard
          title="Total Products"
          value={kpis.totalProducts.toLocaleString()}
          change="—"
          icon="shopping-cart"
          iconClassName="bg-blue-50 text-blue-600"
          className="min-w-[260px] sm:min-w-0"
        />
        <KpiCard
          title="Active Products"
          value={kpis.activeCount.toLocaleString()}
          change="—"
          icon="user-check"
          iconClassName="bg-emerald-50 text-emerald-600"
          className="min-w-[260px] sm:min-w-0"
        />
        <KpiCard
          title="Draft Products"
          value={kpis.draftCount.toLocaleString()}
          change="—"
          icon="users"
          iconClassName="bg-gray-100 text-gray-700"
          className="min-w-[260px] sm:min-w-0"
        />
        <KpiCard
          title="Out of Stock"
          value={kpis.outOfStockCount.toLocaleString()}
          change="—"
          icon="user-x"
          iconClassName="bg-red-50 text-red-600"
          changePositive={false}
          className="min-w-[260px] sm:min-w-0"
        />
      </div>

      <Filters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, category, or description..."
        filterOptions={STATUS_OPTIONS}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as "" | ProductStatus)}
        categoryOptions={CATEGORY_OPTIONS}
        categoryValue={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Product table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No products match your filters.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      ) : (
        <Table<Product>
          data={filteredProducts}
          columns={columns}
          searchable={false}
          filterable={false}
          itemsPerPage={10}
        />
      )}

      {/* Add/Edit drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleFormCancel}
        title={editingProduct ? "Edit Product" : "Add Product"}
        width="lg"
      >
        <ProductForm
          initialValues={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Drawer>
    </div>
  );
}
