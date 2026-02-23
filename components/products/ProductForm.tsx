"use client";

import React, { useEffect } from "react";
import type { Product } from "@/lib/products-data";
import type { ProductFormValues } from "@/lib/products-context";

const STATUS_OPTIONS: { value: Product["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" },
];

interface ProductFormProps {
  initialValues?: Product | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

const emptyForm: ProductFormValues = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  stockStatus: "in_stock",
  status: "active",
  image: "",
  description: "",
};

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = React.useState<ProductFormValues>(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name,
        category: initialValues.category,
        price: initialValues.price,
        stock: initialValues.stock,
        stockStatus: initialValues.stockStatus,
        status: initialValues.status,
        image: initialValues.image ?? "",
        images: initialValues.images,
        description: initialValues.description ?? "",
      });
    } else {
      setValues(emptyForm);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      category: values.category.trim() || "Uncategorized",
      price: values.price || 0,
      stock: values.stock ?? 0,
      description: values.description?.trim() ?? "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          placeholder="e.g. True Beauty Night Cream"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          id="category"
          type="text"
          required
          value={values.category}
          onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          placeholder="e.g. Skincare"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step={0.01}
            required
            value={values.price === 0 ? "" : values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) || 0 }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            id="stock"
            type="number"
            min={0}
            step={1}
            required
            value={values.stock === 0 ? "" : values.stock}
            onChange={(e) => setValues((v) => ({ ...v, stock: Math.max(0, Math.floor(Number(e.target.value))) }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as Product["status"] }))
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          value={values.image ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, image: e.target.value || null }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          placeholder="https://..."
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all resize-none"
          placeholder="Product description..."
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-[#e8a0ad] hover:bg-[#e891a0] transition-colors"
        >
          {initialValues ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
