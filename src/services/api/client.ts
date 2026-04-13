import axios, { type AxiosError } from "axios";

const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: baseURL || undefined,
  timeout: 25_000,
  headers: { "Content-Type": "application/json" },
});

export function isApiConfigured(): boolean {
  return Boolean(baseURL);
}

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const e = err as AxiosError<{ message?: string; error?: string }>;
  const data = e.response?.data;
  const msg = data?.message ?? data?.error ?? e.message;
  return typeof msg === "string" && msg.trim() ? msg : fallback;
}
