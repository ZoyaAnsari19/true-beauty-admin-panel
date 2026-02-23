"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import type { Product } from "@/lib/products-data";
import type { ProductFormValues } from "@/lib/products-context";
import { Drawer } from "@/components/ui/Drawer";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductForm } from "@/components/products/ProductForm";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, softDeleteProduct } = useProducts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-[#e8a0ad] hover:bg-[#e891a0] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No products yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-[#e8a0ad] hover:bg-[#e891a0] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
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
