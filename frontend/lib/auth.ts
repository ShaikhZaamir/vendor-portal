export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("vendor_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("vendor_token");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vendor_token");
  }
}
