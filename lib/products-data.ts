export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type ProductStatus = "active" | "draft" | "inactive";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: ProductStockStatus;
  status: ProductStatus;
  image?: string | null;
  images?: string[];
  description: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "True Beauty Night Cream",
    category: "Skincare",
    price: 1399,
    stock: 45,
    stockStatus: "in_stock",
    status: "active",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    ],
    description:
      "Luxurious night cream enriched with natural extracts. Deeply nourishes and restores skin overnight for a radiant morning glow.",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Vitamin C Face Wash",
    category: "Skincare",
    price: 499,
    stock: 8,
    stockStatus: "low_stock",
    status: "active",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop",
    ],
    description:
      "Gentle cleanser with Vitamin C to brighten and refresh. Suitable for all skin types.",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "Hair Growth Serum",
    category: "Hair Care",
    price: 899,
    stock: 0,
    stockStatus: "out_of_stock",
    status: "inactive",
    image: "https://images.unsplash.com/photo-1522338242762-31d0c0c0c0c0?w=400&h=400&fit=crop",
    images: [],
    description:
      "Promotes hair growth and reduces breakage. Formulated with biotin and natural oils.",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "Sunscreen SPF 50",
    category: "Skincare",
    price: 449,
    stock: 120,
    stockStatus: "in_stock",
    status: "active",
    image: "https://images.unsplash.com/photo-1556229010-aa6e3a2d108e?w=400&h=400&fit=crop",
    images: [],
    description:
      "Broad-spectrum protection with a lightweight, non-greasy formula. Water-resistant.",
    createdAt: "2024-04-05T10:00:00Z",
    updatedAt: "2024-04-05T10:00:00Z",
  },
  {
    id: "prod-5",
    name: "Lip Balm Set",
    category: "Makeup",
    price: 299,
    stock: 25,
    stockStatus: "in_stock",
    status: "draft",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    images: [],
    description: "Set of 3 nourishing lip balms in different flavors.",
    createdAt: "2024-05-12T10:00:00Z",
    updatedAt: "2024-05-12T10:00:00Z",
  },
];

export { MOCK_PRODUCTS };

export function generateProductId(): string {
  return "prod-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}
