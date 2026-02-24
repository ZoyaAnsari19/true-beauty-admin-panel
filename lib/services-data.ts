export type ServiceStatus = "active" | "inactive";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  durationMinutes: number;
  image?: string | null;
  status: ServiceStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const MOCK_SERVICES: Service[] = [
  {
    id: "svc-1",
    name: "Classic Facial",
    description: "Deep cleansing facial with natural extracts. Suitable for all skin types.",
    category: "Facials",
    price: 1499,
    durationMinutes: 60,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "svc-2",
    name: "Hair Cut & Styling",
    description: "Professional haircut with wash and blow-dry styling.",
    category: "Hair",
    price: 799,
    durationMinutes: 45,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "svc-3",
    name: "Manicure & Pedicure",
    description: "Full nail care with polish. Includes hand and foot massage.",
    category: "Nails",
    price: 999,
    durationMinutes: 90,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
    status: "active",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "svc-4",
    name: "Bridal Makeup Trial",
    description: "One-on-one bridal makeup trial with look customization.",
    category: "Makeup",
    price: 2499,
    durationMinutes: 120,
    image: null,
    status: "inactive",
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
  },
  {
    id: "svc-5",
    name: "Threading & Waxing",
    description: "Eyebrow threading and full face or body waxing options.",
    category: "Threading & Waxing",
    price: 349,
    durationMinutes: 30,
    image: null,
    status: "active",
    createdAt: "2024-04-05T10:00:00Z",
    updatedAt: "2024-04-05T10:00:00Z",
  },
];

export { MOCK_SERVICES };

export function generateServiceId(): string {
  return "svc-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}
