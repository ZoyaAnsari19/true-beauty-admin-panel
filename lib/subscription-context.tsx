"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "admin-subscription";

export type SubscriptionPlanId = "starter" | "professional" | "enterprise";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  priceLabel: string;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface Subscription {
  planId: SubscriptionPlanId;
  planName: string;
  price: number;
  startDate: string; // ISO date
  expiryDate: string; // ISO date
  status: SubscriptionStatus;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: "starter", name: "Starter", price: 999, priceLabel: "₹999/month" },
  { id: "professional", name: "Professional", price: 1499, priceLabel: "₹1,499/month" },
  { id: "enterprise", name: "Enterprise", price: 1999, priceLabel: "₹1,999/month" },
];

const SUBSCRIPTION_DAYS = 30;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function readStored(): Subscription | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Subscription;
  } catch {
    return null;
  }
}

function getRemainingDays(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getStatus(expiryDate: string): SubscriptionStatus {
  const remaining = getRemainingDays(expiryDate);
  return remaining > 0 ? "active" : "expired";
}

interface SubscriptionContextValue {
  subscription: Subscription | null;
  remainingDays: number;
  purchasePlan: (planId: SubscriptionPlanId) => void;
  renewPlan: (planId: SubscriptionPlanId) => void;
  getPlanById: (id: SubscriptionPlanId) => SubscriptionPlan | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      const status = getStatus(stored.expiryDate);
      setSubscription({ ...stored, status });
    }
  }, []);

  // Derive current status from expiry when exposing subscription
  const subscriptionWithStatus: Subscription | null = subscription
    ? { ...subscription, status: getStatus(subscription.expiryDate) }
    : null;

  const persist = useCallback((sub: Subscription) => {
    setSubscription(sub);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    } catch (e) {
      console.warn("Subscription persist failed:", e);
    }
  }, []);

  const purchasePlan = useCallback(
    (planId: SubscriptionPlanId) => {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      if (!plan) return;
      const start = new Date();
      const expiry = addDays(start, SUBSCRIPTION_DAYS);
      const sub: Subscription = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate: toISODate(start),
        expiryDate: toISODate(expiry),
        status: "active",
      };
      persist(sub);
    },
    [persist]
  );

  const renewPlan = useCallback(
    (planId: SubscriptionPlanId) => {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      if (!plan) return;
      const start = new Date();
      const expiry = addDays(start, SUBSCRIPTION_DAYS);
      const sub: Subscription = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate: toISODate(start),
        expiryDate: toISODate(expiry),
        status: "active",
      };
      persist(sub);
    },
    [persist]
  );

  const getPlanById = useCallback((id: SubscriptionPlanId) => {
    return SUBSCRIPTION_PLANS.find((p) => p.id === id);
  }, []);

  const remainingDays = subscriptionWithStatus
    ? getRemainingDays(subscriptionWithStatus.expiryDate)
    : 0;

  const value: SubscriptionContextValue = {
    subscription: subscriptionWithStatus,
    remainingDays,
    purchasePlan,
    renewPlan,
    getPlanById,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

export { getRemainingDays, getStatus };
