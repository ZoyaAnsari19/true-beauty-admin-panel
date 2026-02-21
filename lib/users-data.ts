export type UserStatus = "active" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  status: UserStatus;
  joinedDate: string;
}

// Mock data for development
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    mobile: "+1 555-0101",
    address: "123 Oak St, New York, NY",
    totalOrders: 24,
    totalSpend: 1240,
    status: "active",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Emma Williams",
    email: "emma.w@example.com",
    mobile: "+1 555-0102",
    address: "456 Pine Ave, Los Angeles, CA",
    totalOrders: 8,
    totalSpend: 420,
    status: "active",
    joinedDate: "2024-03-22",
  },
  {
    id: "3",
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    mobile: "+1 555-0103",
    address: "789 Maple Dr, Chicago, IL",
    totalOrders: 0,
    totalSpend: 0,
    status: "blocked",
    joinedDate: "2024-02-10",
  },
  {
    id: "4",
    name: "Ava Davis",
    email: "ava.d@example.com",
    mobile: "+1 555-0104",
    address: "321 Elm St, Houston, TX",
    totalOrders: 15,
    totalSpend: 890,
    status: "active",
    joinedDate: "2024-04-05",
  },
  {
    id: "5",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    mobile: "+1 555-0105",
    address: "654 Cedar Ln, Phoenix, AZ",
    totalOrders: 3,
    totalSpend: 156,
    status: "blocked",
    joinedDate: "2024-05-18",
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
