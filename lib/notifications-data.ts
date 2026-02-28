export type NotificationCategory = "orders" | "returns" | "withdraw" | "system";

export type TargetRole = "all" | "customer" | "seller" | "affiliate";

export interface Notification {
  id: string;
  icon: NotificationCategory;
  title: string;
  description: string;
  relatedUser: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  redirectLink?: string;
  targetRole?: TargetRole;
}

const now = new Date();
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * oneHour;

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    icon: "withdraw",
    title: "New withdrawal request",
    description: "Sarah Johnson requested a withdrawal of ₹3,000.",
    relatedUser: "Sarah Johnson",
    timestamp: new Date(now.getTime() - 2 * oneHour).toISOString(),
    read: false,
    category: "withdraw",
    redirectLink: "/withdraw-requests",
  },
  {
    id: "notif-2",
    icon: "orders",
    title: "Order placed",
    description: "Order #ORD-1042 has been placed by a customer.",
    relatedUser: "Riya Sharma",
    timestamp: new Date(now.getTime() - 5 * oneHour).toISOString(),
    read: false,
    category: "orders",
    redirectLink: "/orders",
  },
  {
    id: "notif-3",
    icon: "returns",
    title: "Return requested",
    description: "Return request for order #ORD-1038 has been submitted.",
    relatedUser: "Priya Mehta",
    timestamp: new Date(now.getTime() - 1 * oneDay).toISOString(),
    read: true,
    category: "returns",
    redirectLink: "/users",
  },
  {
    id: "notif-4",
    icon: "system",
    title: "System maintenance",
    description: "Scheduled maintenance will occur tonight between 2–4 AM IST.",
    relatedUser: "System",
    timestamp: new Date(now.getTime() - 2 * oneDay).toISOString(),
    read: true,
    category: "system",
  },
  {
    id: "notif-5",
    icon: "withdraw",
    title: "Withdrawal approved",
    description: "Withdrawal wd-1 for Emma Williams has been processed.",
    relatedUser: "Emma Williams",
    timestamp: new Date(now.getTime() - 3 * oneDay).toISOString(),
    read: true,
    category: "withdraw",
    redirectLink: "/withdraw-requests",
  },
];

export function generateNotificationId(): string {
  return (
    "notif-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}
