"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  categoryOptions?: FilterOption[];
  categoryValue?: string;
  onCategoryChange?: (value: string) => void;
}

export function Filters({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  filterValue,
  onFilterChange,
  categoryOptions,
  categoryValue,
  onCategoryChange,
}: FiltersProps) {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const activeLabel =
    filterOptions?.find((opt) => opt.value === filterValue)?.label ??
    filterOptions?.[0]?.label ??
    "All";

  const showFilter = filterOptions && onFilterChange;
  const showCategoryFilter = categoryOptions && onCategoryChange;

  const activeCategoryLabel =
    categoryOptions?.find((opt) => opt.value === categoryValue)?.label ??
    "All categories";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c6d0] focus:border-transparent transition-all"
        />
      </div>

      {(showCategoryFilter || showFilter) && (
        <div className="flex gap-2">
          {showCategoryFilter && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCategoryOpen((prev) => !prev);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors min-w-[160px] justify-between"
              >
                <span>{activeCategoryLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {categoryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCategoryOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                    {categoryOptions!.map((opt) => (
                      <button
                        key={opt.value || "all"}
                        type="button"
                        onClick={() => {
                          onCategoryChange(opt.value);
                          setCategoryOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#fef5f7] transition-colors ${
                          categoryValue === opt.value ? "bg-[#fef5f7] font-medium" : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {showFilter && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpen((prev) => !prev);
                  setCategoryOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-[#fef5f7] transition-colors min-w-[160px] justify-between"
              >
                <span>{activeLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                    {filterOptions!.map((opt) => (
                      <button
                        key={opt.value || "all"}
                        type="button"
                        onClick={() => {
                          onFilterChange(opt.value);
                          setOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#fef5f7] transition-colors ${
                          filterValue === opt.value ? "bg-[#fef5f7] font-medium" : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}