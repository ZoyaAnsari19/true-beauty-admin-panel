"use client";

import React, { useEffect } from "react";
import type { Service } from "@/lib/services-data";
import type { ServiceFormValues } from "@/lib/services-context";

const STATUS_OPTIONS: { value: Service["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CATEGORY_OPTIONS = [
  "Facials",
  "Hair",
  "Nails",
  "Makeup",
  "Threading & Waxing",
  "Massage",
  "Body Care",
  "Other",
];

const emptyForm: ServiceFormValues = {
  name: "",
  description: "",
  category: "",
  price: 0,
  durationMinutes: 0,
  image: "",
  status: "active",
};

interface ServiceFormProps {
  initialValues?: Service | null;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
}

export function ServiceForm({
  initialValues,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [values, setValues] = React.useState<ServiceFormValues>(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name,
        description: initialValues.description ?? "",
        category: initialValues.category,
        price: initialValues.price,
        durationMinutes: initialValues.durationMinutes,
        image: initialValues.image ?? "",
        status: initialValues.status,
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
      description: values.description?.trim() ?? "",
      category: values.category.trim() || "Other",
      price: values.price || 0,
      durationMinutes: Math.max(0, values.durationMinutes ?? 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          id="service-name"
          type="text"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          placeholder="e.g. Classic Facial"
        />
      </div>
      <div>
        <label htmlFor="service-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="service-description"
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all resize-none"
          placeholder="Brief description of the service..."
        />
      </div>
      <div>
        <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="service-category"
          required
          value={values.category}
          onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="service-price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="service-price"
            type="number"
            min={0}
            step={1}
            required
            value={values.price === 0 ? "" : values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) || 0 }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="service-duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (min) <span className="text-red-500">*</span>
          </label>
          <input
            id="service-duration"
            type="number"
            min={0}
            step={5}
            required
            value={values.durationMinutes === 0 ? "" : values.durationMinutes}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                durationMinutes: Math.max(0, Math.floor(Number(e.target.value) || 0)),
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      <div>
        <label htmlFor="service-image" className="block text-sm font-medium text-gray-700 mb-1">
          Image Upload
        </label>
        <input
          id="service-image"
          type="url"
          value={values.image ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, image: e.target.value || "" }))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
          placeholder="https://..."
        />
        <p className="mt-1 text-xs text-gray-500">Enter image URL. File upload can be added later.</p>
      </div>
      <div>
        <label htmlFor="service-status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="service-status"
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as Service["status"] }))
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
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-[#D96A86] hover:bg-[#C85A76] transition-colors"
        >
          {initialValues ? "Update Service" : "Add Service"}
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
