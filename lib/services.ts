import { API_BASE_URL } from "./api";

export type AirtimePayload = {
  network: string;
  phone: string;
  amount: number;
};

export type DataPayload = {
  network: string;
  phone: string;
  plan: string;
  amount: number;
};

export async function buyAirtime(payload: AirtimePayload) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/services/airtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Airtime purchase failed");
  }

  return data;
}

export async function buyData(payload: DataPayload) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/services/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Data purchase failed");
  }

  return data;
    }
