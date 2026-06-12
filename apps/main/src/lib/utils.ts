import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Request form page on the main site */
export const REQUEST_URL = "/request";

/** Same-origin — proxied to the backend via next.config rewrites */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
