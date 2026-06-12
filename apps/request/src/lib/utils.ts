import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:3000";
