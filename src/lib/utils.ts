import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseReviewsCount(countStr: string): number {
  if (!countStr) return 0;
  const cleanedStr = countStr.toLowerCase().replace(/[^0-9k\.]/g, '');
  if (cleanedStr.includes('k')) {
    return parseFloat(cleanedStr.replace('k', '')) * 1000;
  }
  return parseInt(cleanedStr, 10);
}

export function formatReviewsCount(count: number): string {
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    // Remove .0 if it's cleanly divisible
    return formatted.endsWith('.0') ? `${formatted.replace('.0', '')}k+` : `${formatted}k+`;
  }
  return count.toString();
}
