import { API_BASE_URL } from "./api";
export async function buyAirtime(payload: { network: string; phone: string; amount: number; }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("No access token found");
  const response = await fetch(`${API_BASE_URL}/api/services/airtime`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Airtime purchase failed");
  return data;
}
export async function buyData(payload: { network: string; phone: string; plan: string; amount: number; }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("No access token found");
  const response = await fetch(`${API_BASE_URL}/api/services/data`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Data purchase failed");
  return data;
}