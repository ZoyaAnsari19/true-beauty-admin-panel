"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Plus,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useCoupons } from "@/lib/coupons-context";
import { useProducts } from "@/lib/products-context";
import type { Coupon } from "@/lib/coupons-data";
import type { CouponFormValues } from "@/lib/coupons-context";
import { Drawer } from "@/components/ui/Drawer";
import { CouponForm } from "@/components/ui/CouponForm";
import Table from "@/components/Table";
import DeletePopup from "@/components/ui/deletePopup";

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  disabled: "Disabled",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  disabled: "bg-gray-100 text-gray-600",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function CouponActionsMenu({
  coupon,
  onView,
  onEdit,
  onDisable,
  onDelete,
}: {
  coupon: Coupon;
  onView: (c: Coupon) => void;
  onEdit: (c: Coupon) => void;
  onDisable: (c: Coupon) => void;
  onDelete: (c: Coupon) => void;
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
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onView(coupon);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit(coupon);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors text-left"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDisable(coupon);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors text-left"
          >
            {coupon.status === "active" ? (
              <>
                <Ban className="w-4 h-4" />
                Disable
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Enable
              </>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete(coupon);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ViewCouponDrawer({
  coupon,
  open,
  onClose,
}: {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!coupon) return null;
  return (
    <Drawer open={open} onClose={onClose} title="Coupon Details" width="md">
      <div className="space-y-4 text-sm">
        <div>
          <span className="text-gray-500 block mb-0.5">Coupon Code</span>
          <span className="font-mono font-semibold text-gray-900">{coupon.code}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 block mb-0.5">Type</span>
            <span className="capitalize">{coupon.discountType}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Discount</span>
            <span>
              {coupon.discountType === "percentage"
                ? `${coupon.discountValue}%`
                : formatCurrency(coupon.discountValue)}
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Min Order Value</span>
          <span>{formatCurrency(coupon.minOrderValue)}</span>
        </div>
        {coupon.discountType === "percentage" && coupon.maxDiscountCap != null && (
          <div>
            <span className="text-gray-500 block mb-0.5">Max Discount Cap</span>
            <span>{formatCurrency(coupon.maxDiscountCap)}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 block mb-0.5">Usage Limit (Total)</span>
            <span>{coupon.usageLimitTotal ?? "Unlimited"}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Usage Limit (Per User)</span>
            <span>{coupon.usageLimitPerUser ?? "Unlimited"}</span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Used Count</span>
          <span>{coupon.usedCount}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Applicable Role</span>
          <span className="capitalize">{coupon.applicableRole}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 block mb-0.5">Start Date</span>
            <span>{formatDate(coupon.startDate)}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Expiry Date</span>
            <span>{formatDate(coupon.expiryDate)}</span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Status</span>
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              STATUS_CLASSES[coupon.status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {STATUS_LABELS[coupon.status] ?? coupon.status}
          </span>
        </div>
      </div>
    </Drawer>
  );
}

export default function AddCouponsPage() {
  const { coupons, addCoupon, updateCoupon, toggleCouponStatus, deleteCoupon } =
    useCoupons();
  const { products } = useProducts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const productOptions = useMemo(
    () => products.filter((p) => !p.deletedAt).map((p) => ({ id: p.id, name: p.name })),
    [products]
  );

  const handleCreate = () => {
    setEditingCoupon(null);
    setDrawerOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDrawerOpen(true);
  };

  const handleView = (coupon: Coupon) => {
    setViewingCoupon(coupon);
    setViewDrawerOpen(true);
  };

  const handleFormSubmit = (values: CouponFormValues) => {
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, values);
    } else {
      addCoupon(values);
    }
    setDrawerOpen(false);
    setEditingCoupon(null);
  };

  const handleFormCancel = () => {
    setDrawerOpen(false);
    setEditingCoupon(null);
  };

  const handleDisable = (coupon: Coupon) => {
    toggleCouponStatus(coupon.id);
  };

  const handleDelete = (coupon: Coupon) => {
    setDeleteTarget(coupon);
  };

  const columns = useMemo(
    () => [
      {
        header: "Coupon Code",
        accessor: (c: Coupon) => (
          <span className="font-mono font-medium text-gray-900">{c.code}</span>
        ),
      },
      {
        header: "Type",
        accessor: (c: Coupon) => (
          <span className="capitalize text-gray-700">{c.discountType}</span>
        ),
      },
      {
        header: "Discount",
        accessor: (c: Coupon) => (
          <span className="text-gray-900">
            {c.discountType === "percentage"
              ? `${c.discountValue}%`
              : formatCurrency(c.discountValue)}
          </span>
        ),
      },
      {
        header: "Min Order Value",
        accessor: (c: Coupon) => (
          <span className="text-gray-700">{formatCurrency(c.minOrderValue)}</span>
        ),
      },
      {
        header: "Usage Limit",
        accessor: (c: Coupon) => (
          <span className="text-gray-700">
            {c.usageLimitTotal ?? "∞"}
          </span>
        ),
      },
      {
        header: "Used Count",
        accessor: (c: Coupon) => (
          <span className="text-gray-700">{c.usedCount}</span>
        ),
      },
      {
        header: "Expiry Date",
        accessor: (c: Coupon) => (
          <span className="text-gray-700">{formatDate(c.expiryDate)}</span>
        ),
      },
      {
        header: "Status",
        accessor: (c: Coupon) => (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              STATUS_CLASSES[c.status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {STATUS_LABELS[c.status] ?? c.status}
          </span>
        ),
      },
      {
        header: "Actions",
        cellClassName: "text-center",
        accessor: (c: Coupon) => (
          <div className="inline-flex justify-center w-full">
            <CouponActionsMenu
              coupon={c}
              onView={handleView}
              onEdit={handleEdit}
              onDisable={handleDisable}
              onDelete={handleDelete}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Coupons
        </h1>
        <button
          type="button"
          onClick={handleCreate}
          className="shrink-0 inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors shadow-sm text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table<Coupon>
          data={coupons}
          columns={columns}
          searchable={true}
          filterable={false}
          itemsPerPage={10}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={handleFormCancel}
        title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
        width="xl"
      >
        <CouponForm
          initialValues={editingCoupon}
          productOptions={productOptions}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Drawer>

      <ViewCouponDrawer
        coupon={viewingCoupon}
        open={viewDrawerOpen}
        onClose={() => {
          setViewDrawerOpen(false);
          setViewingCoupon(null);
        }}
      />

      <DeletePopup
        open={deleteTarget != null}
        title="Delete coupon"
        description={
          deleteTarget
            ? `Permanently delete coupon "${deleteTarget.code}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCoupon(deleteTarget.id);
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
