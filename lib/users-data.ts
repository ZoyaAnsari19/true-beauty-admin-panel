export type UserStatus = "active" | "blocked";

export interface OrderItem {
  orderId: string;
  productImage?: string | null;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  orderStatus: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  pincode: string;
  totalOrders: number;
  totalSpend: number;
  productsPurchased: number;
  returns: number;
  cancelled: number;
  refunds: number;
  status: UserStatus;
  joinedDate: string;
  purchases: OrderItem[];
  returnsOrders: OrderItem[];
  cancelledOrders: OrderItem[];
  refundedOrders: OrderItem[];
}

// Mock order items for development
const MOCK_PURCHASES_USER1: OrderItem[] = [
  { orderId: "ord-1a", productName: "True Beauty Night Cream", price: 1399, quantity: 2, totalAmount: 2798, orderDate: "2024-06-10", orderStatus: "Delivered" },
  { orderId: "ord-1a", productName: "True Beauty Serum", price: 899, quantity: 1, totalAmount: 899, orderDate: "2024-06-10", orderStatus: "Delivered" },
  { orderId: "ord-1b", productName: "Vitamin C Face Wash", price: 499, quantity: 3, totalAmount: 1497, orderDate: "2024-05-22", orderStatus: "Delivered" },
];
const MOCK_RETURNS_USER1: OrderItem[] = [
  { orderId: "ord-1c", productName: "True Beauty Moisturizer", price: 649, quantity: 1, totalAmount: 649, orderDate: "2024-04-15", orderStatus: "Returned" },
];
const MOCK_CANCELLED_USER1: OrderItem[] = [
  { orderId: "ord-1d", productName: "Hair Oil", price: 399, quantity: 1, totalAmount: 399, orderDate: "2024-03-01", orderStatus: "Cancelled" },
];
const MOCK_REFUNDED_USER1: OrderItem[] = [
  { orderId: "ord-1e", productName: "Lip Balm Set", price: 299, quantity: 2, totalAmount: 598, orderDate: "2024-02-10", orderStatus: "Refunded" },
];

const MOCK_PURCHASES_USER2: OrderItem[] = [
  { orderId: "ord-2a", productName: "Face Mask Pack", price: 599, quantity: 2, totalAmount: 1198, orderDate: "2024-05-01", orderStatus: "Delivered" },
  { orderId: "ord-2b", productName: "Sunscreen SPF 50", price: 449, quantity: 1, totalAmount: 449, orderDate: "2024-04-18", orderStatus: "Delivered" },
];
const MOCK_PURCHASES_USER4: OrderItem[] = [
  { orderId: "ord-4a", productName: "Body Lotion", price: 549, quantity: 2, totalAmount: 1098, orderDate: "2024-05-20", orderStatus: "Delivered" },
  { orderId: "ord-4b", productName: "Cleansing Balm", price: 799, quantity: 1, totalAmount: 799, orderDate: "2024-04-10", orderStatus: "Delivered" },
];
const MOCK_RETURNS_USER4: OrderItem[] = [
  { orderId: "ord-4c", productName: "Toner", price: 349, quantity: 1, totalAmount: 349, orderDate: "2024-03-25", orderStatus: "Returned" },
];
const MOCK_CANCELLED_USER4: OrderItem[] = [
  { orderId: "ord-4d", productName: "Eye Cream", price: 699, quantity: 1, totalAmount: 699, orderDate: "2024-03-12", orderStatus: "Cancelled" },
  { orderId: "ord-4e", productName: "Scrub", price: 399, quantity: 1, totalAmount: 399, orderDate: "2024-03-12", orderStatus: "Cancelled" },
];
const MOCK_REFUNDED_USER4: OrderItem[] = [
  { orderId: "ord-4f", productName: "Sample Kit", price: 199, quantity: 1, totalAmount: 199, orderDate: "2024-02-28", orderStatus: "Refunded" },
];
const MOCK_PURCHASES_USER5: OrderItem[] = [
  { orderId: "ord-5a", productName: "Hand Cream", price: 299, quantity: 2, totalAmount: 598, orderDate: "2024-05-05", orderStatus: "Delivered" },
  { orderId: "ord-5b", productName: "Face Mist", price: 349, quantity: 1, totalAmount: 349, orderDate: "2024-04-20", orderStatus: "Delivered" },
];
const MOCK_RETURNS_USER5: OrderItem[] = [
  { orderId: "ord-5c", productName: "BB Cream", price: 499, quantity: 1, totalAmount: 499, orderDate: "2024-04-01", orderStatus: "Returned" },
];
const MOCK_CANCELLED_USER5: OrderItem[] = [
  { orderId: "ord-5d", productName: "Primer", price: 449, quantity: 1, totalAmount: 449, orderDate: "2024-03-15", orderStatus: "Cancelled" },
];
const MOCK_REFUNDED_USER5: OrderItem[] = [
  { orderId: "ord-5e", productName: "Trial Set", price: 199, quantity: 1, totalAmount: 199, orderDate: "2024-03-01", orderStatus: "Refunded" },
];

// Mock data for development
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    mobile: "+1 555-0101",
    address: "123 Oak St",
    dob: "1990-05-12",
    gender: "Female",
    city: "New York",
    state: "NY",
    pincode: "10001",
    totalOrders: 24,
    totalSpend: 1240,
    productsPurchased: 32,
    returns: 2,
    cancelled: 1,
    refunds: 1,
    status: "active",
    joinedDate: "2024-01-15",
    purchases: MOCK_PURCHASES_USER1,
    returnsOrders: MOCK_RETURNS_USER1,
    cancelledOrders: MOCK_CANCELLED_USER1,
    refundedOrders: MOCK_REFUNDED_USER1,
  },
  {
    id: "2",
    name: "Emma Williams",
    email: "emma.w@example.com",
    mobile: "+1 555-0102",
    address: "456 Pine Ave",
    dob: "1988-11-03",
    gender: "Female",
    city: "Los Angeles",
    state: "CA",
    pincode: "90001",
    totalOrders: 8,
    totalSpend: 420,
    productsPurchased: 11,
    returns: 0,
    cancelled: 0,
    refunds: 0,
    status: "active",
    joinedDate: "2024-03-22",
    purchases: MOCK_PURCHASES_USER2,
    returnsOrders: [],
    cancelledOrders: [],
    refundedOrders: [],
  },
  {
    id: "3",
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    mobile: "+1 555-0103",
    address: "789 Maple Dr",
    dob: "1995-07-22",
    gender: "Female",
    city: "Chicago",
    state: "IL",
    pincode: "60601",
    totalOrders: 0,
    totalSpend: 0,
    productsPurchased: 0,
    returns: 0,
    cancelled: 0,
    refunds: 0,
    status: "blocked",
    joinedDate: "2024-02-10",
    purchases: [],
    returnsOrders: [],
    cancelledOrders: [],
    refundedOrders: [],
  },
  {
    id: "4",
    name: "Ava Davis",
    email: "ava.d@example.com",
    mobile: "+1 555-0104",
    address: "321 Elm St",
    dob: "1992-01-18",
    gender: "Female",
    city: "Houston",
    state: "TX",
    pincode: "77001",
    totalOrders: 15,
    totalSpend: 890,
    productsPurchased: 19,
    returns: 1,
    cancelled: 2,
    refunds: 1,
    status: "active",
    joinedDate: "2024-04-05",
    purchases: MOCK_PURCHASES_USER4,
    returnsOrders: MOCK_RETURNS_USER4,
    cancelledOrders: MOCK_CANCELLED_USER4,
    refundedOrders: MOCK_REFUNDED_USER4,
  },
  {
    id: "5",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    mobile: "+1 555-0105",
    address: "654 Cedar Ln",
    dob: "1987-09-30",
    gender: "Female",
    city: "Phoenix",
    state: "AZ",
    pincode: "85001",
    totalOrders: 3,
    totalSpend: 156,
    productsPurchased: 4,
    returns: 1,
    cancelled: 1,
    refunds: 1,
    status: "blocked",
    joinedDate: "2024-05-18",
    purchases: MOCK_PURCHASES_USER5,
    returnsOrders: MOCK_RETURNS_USER5,
    cancelledOrders: MOCK_CANCELLED_USER5,
    refundedOrders: MOCK_REFUNDED_USER5,
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
