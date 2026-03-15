import { API_BASE_URL } from "./api";
export type WalletBalanceResponse = { available_balance: number; locked_balance: number; currency: string };
export async function getWalletBalance(): Promise<WalletBalanceResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("No access token found");
  const response = await fetch(`${API_BASE_URL}/api/wallet/balance`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch wallet balance");
  return data;
}