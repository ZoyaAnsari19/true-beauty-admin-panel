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
  areaBranchName: "",
  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
  phoneNumber: "",
  workingHours: "",
  workingDays: "",
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
        areaBranchName: initialValues.areaBranchName ?? "",
        fullAddress: initialValues.fullAddress ?? "",
        city: initialValues.city ?? "",
        state: initialValues.state ?? "",
        pincode: initialValues.pincode ?? "",
        phoneNumber: initialValues.phoneNumber ?? "",
        workingHours: initialValues.workingHours ?? "",
        workingDays: initialValues.workingDays ?? "",
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
      areaBranchName: values.areaBranchName?.trim() ?? "",
      fullAddress: values.fullAddress?.trim() ?? "",
      city: values.city?.trim() ?? "",
      state: values.state?.trim() ?? "",
      pincode: values.pincode?.trim() ?? "",
      phoneNumber: values.phoneNumber?.trim() ?? "",
      workingHours: values.workingHours?.trim() ?? "",
      workingDays: values.workingDays?.trim() ?? "",
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

      {/* Location & Contact Section */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Location & Contact</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="service-area-branch" className="block text-sm font-medium text-gray-700 mb-1">
              Area / Branch Name
            </label>
            <input
              id="service-area-branch"
              type="text"
              value={values.areaBranchName ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, areaBranchName: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
              placeholder="e.g. MG Road Branch"
            />
          </div>
          <div>
            <label htmlFor="service-full-address" className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <textarea
              id="service-full-address"
              rows={2}
              value={values.fullAddress ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, fullAddress: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all resize-none"
              placeholder="Street, landmark, building"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="service-city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="service-city"
                type="text"
                value={values.city ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
                placeholder="e.g. Bangalore"
              />
            </div>
            <div>
              <label htmlFor="service-state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="service-state"
                type="text"
                value={values.state ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, state: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
                placeholder="e.g. Karnataka"
              />
            </div>
          </div>
          <div>
            <label htmlFor="service-pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              id="service-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={values.pincode ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
              placeholder="e.g. 560001"
            />
          </div>
          <div>
            <label htmlFor="service-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="service-phone"
              type="tel"
              value={values.phoneNumber ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, phoneNumber: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
              placeholder="e.g. +91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor="service-working-hours" className="block text-sm font-medium text-gray-700 mb-1">
              Working Hours
            </label>
            <input
              id="service-working-hours"
              type="text"
              value={values.workingHours ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, workingHours: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
              placeholder="e.g. 10:00 AM - 8:00 PM"
            />
          </div>
          <div>
            <label htmlFor="service-working-days" className="block text-sm font-medium text-gray-700 mb-1">
              Working Days
            </label>
            <input
              id="service-working-days"
              type="text"
              value={values.workingDays ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, workingDays: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent outline-none transition-all"
              placeholder="e.g. Mon - Sat"
            />
          </div>
        </div>
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
