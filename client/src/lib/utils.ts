import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(numPrice);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

export function getStockPercentage(current: number, max: number): number {
  return Math.round((current / max) * 100);
}

export function isLowStock(current: number, max: number): boolean {
  return current <= Math.max(1, Math.floor(max * 0.2));
}
