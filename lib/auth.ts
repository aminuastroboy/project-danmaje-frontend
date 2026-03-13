import { API_BASE_URL } from "./api";

export type LoginPayload = {
  phone: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
                               }
