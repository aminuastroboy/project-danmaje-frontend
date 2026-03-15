import { API_BASE_URL } from "./api";
export type TransactionItem = { reference: string; category: string; amount: number; status: string; recipient: string; created_at: string };
export async function getTransactions(): Promise<TransactionItem[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("No access token found");
  const response = await fetch(`${API_BASE_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch transactions");
  return data;
}