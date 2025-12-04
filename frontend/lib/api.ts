export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Helper for GET requests
export async function apiGet(path: string, token?: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.json();
}

// Helper for POST requests
export async function apiPost(
  path: string,
  body: Record<string, unknown>,
  token?: string
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// Helper for PUT requests
export async function apiPut(
  path: string,
  body: Record<string, unknown>,
  token?: string
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// Helper for DELETE requests
export async function apiDelete(path: string, token?: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.json();
}
