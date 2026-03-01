"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  generateCouponCode,
  type ApplicableRole,
  type Coupon,
  type CouponDiscountType,
  type CouponStatus,
} from "@/lib/coupons-data";
import { PRODUCT_CATEGORIES } from "@/lib/products-data";
import type { CouponFormValues } from "@/lib/coupons-context";

const STATUS_OPTIONS: { value: CouponStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

const DISCOUNT_TYPE_OPTIONS: { value: CouponDiscountType; label: string }[] = [
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed" },
];

const ROLE_OPTIONS: { value: ApplicableRole; label: string }[] = [
  { value: "all", label: "All" },
  { value: "customers", label: "Customers" },
  { value: "affiliate", label: "Affiliate users" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  ...PRODUCT_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
];

const emptyForm: CouponFormValues = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  minOrderValue: 0,
  maxDiscountCap: null,
  usageLimitTotal: null,
  usageLimitPerUser: null,
  applicableRole: "all",
  applicableProductIds: [],
  applicableCategoryIds: [],
  startDate: "",
  expiryDate: "",
  status: "active",
};

function toLocalDateOnly(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

interface CouponFormProps {
  initialValues?: Coupon | null;
  productOptions?: { id: string; name: string }[];
  onSubmit: (values: CouponFormValues) => void;
  onCancel: () => void;
}

export function CouponForm({
  initialValues,
  productOptions = [],
  onSubmit,
  onCancel,
}: CouponFormProps) {
  const [values, setValues] = useState<CouponFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        code: initialValues.code,
        discountType: initialValues.discountType,
        discountValue: initialValues.discountValue,
        minOrderValue: initialValues.minOrderValue,
        maxDiscountCap: initialValues.maxDiscountCap,
        usageLimitTotal: initialValues.usageLimitTotal,
        usageLimitPerUser: initialValues.usageLimitPerUser,
        applicableRole: initialValues.applicableRole,
        applicableProductIds: initialValues.applicableProductIds ?? [],
        applicableCategoryIds: initialValues.applicableCategoryIds ?? [],
        startDate: toLocalDateOnly(initialValues.startDate),
        expiryDate: toLocalDateOnly(initialValues.expiryDate),
        status: initialValues.status,
      });
    } else {
      setValues(emptyForm);
    }
    setErrors({});
  }, [initialValues]);

  const validate = useMemo(() => {
    return (
      v: CouponFormValues,
      isEdit: boolean
    ): Record<string, string> => {
      const err: Record<string, string> = {};
      if (!v.code.trim()) err.code = "Coupon code is required.";
      if (v.discountType === "percentage") {
        const n = Number(v.discountValue);
        if (Number.isNaN(n) || n <= 0 || n > 100)
          err.discountValue = "Enter a percentage between 1 and 100.";
        if (v.maxDiscountCap != null && v.maxDiscountCap < 0)
          err.maxDiscountCap = "Max discount cap cannot be negative.";
      } else {
        const n = Number(v.discountValue);
        if (Number.isNaN(n) || n < 0) err.discountValue = "Enter a valid fixed amount (≥ 0).";
      }
      const minOrder = Number(v.minOrderValue);
      if (Number.isNaN(minOrder) || minOrder < 0)
        err.minOrderValue = "Min order must be 0 or more.";
      if (v.usageLimitTotal != null && (Number.isNaN(Number(v.usageLimitTotal)) || Number(v.usageLimitTotal) < 0))
        err.usageLimitTotal = "Usage limit (total) must be 0 or more.";
      if (v.usageLimitPerUser != null && (Number.isNaN(Number(v.usageLimitPerUser)) || Number(v.usageLimitPerUser) < 0))
        err.usageLimitPerUser = "Usage limit (per user) must be 0 or more.";
      if (!v.startDate?.trim()) err.startDate = "Start date is required.";
      if (!v.expiryDate?.trim()) err.expiryDate = "Expiry date is required.";
      const start = v.startDate ? new Date(v.startDate).getTime() : 0;
      const expiry = v.expiryDate ? new Date(v.expiryDate).getTime() : 0;
      if (v.expiryDate && v.startDate && expiry < start)
        err.expiryDate = err.expiryDate || "Expiry date must be after start date.";
      if (!isEdit && v.expiryDate && new Date(v.expiryDate) < new Date())
        err.expiryDate = err.expiryDate || "Expiry date cannot be in the past.";
      return err;
    };
  }, []);

  const handleAutoGenerate = () => {
    setValues((prev) => ({ ...prev, code: generateCouponCode() }));
    setErrors((prev) => ({ ...prev, code: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = { ...values };
    const err = validate(v, !!initialValues);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const num = (x: number | string | null | undefined): number | null =>
      x == null || x === "" ? null : Number(x);
    onSubmit({
      ...v,
      code: v.code.trim().toUpperCase(),
      discountValue: Number(v.discountValue) || 0,
      minOrderValue: Number(v.minOrderValue) || 0,
      maxDiscountCap: v.discountType === "percentage" ? num(v.maxDiscountCap) : null,
      usageLimitTotal: num(v.usageLimitTotal),
      usageLimitPerUser: num(v.usageLimitPerUser),
      applicableProductIds: v.applicableProductIds ?? [],
      applicableCategoryIds: v.applicableCategoryIds ?? [],
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Coupon Code */}
      <div>
        <label htmlFor="coupon-code" className={labelClass}>
          Coupon Code <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="coupon-code"
            type="text"
            value={values.code}
            onChange={(e) =>
              setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))
            }
            className={`${inputClass} flex-1`}
            placeholder="e.g. SAVE20"
          />
          <button
            type="button"
            onClick={handleAutoGenerate}
            className="shrink-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Auto generate
          </button>
        </div>
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
      </div>

      {/* Discount Type & Value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="discount-type" className={labelClass}>
            Discount Type
          </label>
          <select
            id="discount-type"
            value={values.discountType}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                discountType: e.target.value as CouponDiscountType,
              }))
            }
            className={`${inputClass} bg-white`}
          >
            {DISCOUNT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="discount-value" className={labelClass}>
            Discount Value{" "}
            {values.discountType === "percentage" ? "(%)" : "(₹)"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="discount-value"
            type="number"
            min={values.discountType === "percentage" ? 1 : 0}
            max={values.discountType === "percentage" ? 100 : undefined}
            step={values.discountType === "percentage" ? 1 : 0.01}
            value={values.discountValue || ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                discountValue: e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
            className={inputClass}
            placeholder={values.discountType === "percentage" ? "e.g. 20" : "e.g. 100"}
          />
          {errors.discountValue && (
            <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>
          )}
        </div>
      </div>

      {/* Min Order & Max Discount Cap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="min-order" className={labelClass}>
            Min Order (₹)
          </label>
          <input
            id="min-order"
            type="number"
            min={0}
            step={1}
            value={values.minOrderValue ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                minOrderValue:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
            className={inputClass}
            placeholder="0"
          />
          {errors.minOrderValue && (
            <p className="mt-1 text-sm text-red-600">{errors.minOrderValue}</p>
          )}
        </div>
        {values.discountType === "percentage" && (
          <div>
            <label htmlFor="max-cap" className={labelClass}>
              Max Discount Cap (₹)
            </label>
            <input
              id="max-cap"
              type="number"
              min={0}
              step={1}
              value={values.maxDiscountCap ?? ""}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  maxDiscountCap:
                    e.target.value === ""
                      ? null
                      : Number(e.target.value),
                }))
              }
              className={inputClass}
              placeholder="Optional"
            />
            {errors.maxDiscountCap && (
              <p className="mt-1 text-sm text-red-600">{errors.maxDiscountCap}</p>
            )}
          </div>
        )}
      </div>

      {/* Usage limits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="usage-total" className={labelClass}>
            Usage Limit (Total)
          </label>
          <input
            id="usage-total"
            type="number"
            min={0}
            value={values.usageLimitTotal ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                usageLimitTotal:
                  e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            className={inputClass}
            placeholder="Unlimited"
          />
          {errors.usageLimitTotal && (
            <p className="mt-1 text-sm text-red-600">{errors.usageLimitTotal}</p>
          )}
        </div>
        <div>
          <label htmlFor="usage-per-user" className={labelClass}>
            Usage Limit (Per User)
          </label>
          <input
            id="usage-per-user"
            type="number"
            min={0}
            value={values.usageLimitPerUser ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                usageLimitPerUser:
                  e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            className={inputClass}
            placeholder="Unlimited"
          />
          {errors.usageLimitPerUser && (
            <p className="mt-1 text-sm text-red-600">{errors.usageLimitPerUser}</p>
          )}
        </div>
      </div>

      {/* Applicable Role */}
      <div>
        <label htmlFor="applicable-role" className={labelClass}>
          Applicable Role
        </label>
        <select
          id="applicable-role"
          value={values.applicableRole}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              applicableRole: e.target.value as ApplicableRole,
            }))
          }
          className={`${inputClass} bg-white`}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applicable Categories */}
      <div>
        <label htmlFor="applicable-categories" className={labelClass}>
          Applicable Categories
        </label>
        <select
          id="applicable-categories"
          value={(values.applicableCategoryIds ?? [])[0] ?? ""}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              applicableCategoryIds: e.target.value ? [e.target.value] : [],
            }))
          }
          className={`${inputClass} bg-white`}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applicable Products */}
      <div>
        <label htmlFor="applicable-products" className={labelClass}>
          Applicable Products
        </label>
        <select
          id="applicable-products"
          value={(values.applicableProductIds ?? [])[0] ?? ""}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              applicableProductIds: e.target.value ? [e.target.value] : [],
            }))
          }
          className={`${inputClass} bg-white`}
        >
          <option value="">All products</option>
          {productOptions.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Start & Expiry Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className={labelClass}>
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="start-date"
            type="date"
            value={values.startDate}
            onChange={(e) =>
              setValues((v) => ({ ...v, startDate: e.target.value }))
            }
            className={inputClass}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="expiry-date" className={labelClass}>
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            id="expiry-date"
            type="date"
            value={values.expiryDate}
            onChange={(e) =>
              setValues((v) => ({ ...v, expiryDate: e.target.value }))
            }
            className={inputClass}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="coupon-status" className={labelClass}>
          Status
        </label>
        <select
          id="coupon-status"
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as CouponStatus }))
          }
          className={`${inputClass} bg-white`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
        >
          {initialValues ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
