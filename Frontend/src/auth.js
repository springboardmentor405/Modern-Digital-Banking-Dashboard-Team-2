// ===============================
// CONFIG
// ===============================
const API_BASE = "http://127.0.0.1:8000/auth";
const USE_MOCK = false;   // 🔴 MUST be false for backend integration

const TOKEN_KEY = "id_token";
const USER_KEY = "currentUser";

// ===============================
// TOKEN & USER STORAGE
// ===============================
export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ===============================
// JWT HELPERS
// ===============================
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return payload.exp <= Math.floor(Date.now() / 1000);
}

export function isAuthenticated() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

export function logout() {
  removeToken();
  removeUser();
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ===============================
// AUTH APIs
// ===============================
export async function signup({ name, email, password }) {
  if (USE_MOCK) {
    throw new Error("Mock mode disabled");
  }

  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return await res.json();
}

export async function login({ email, password }) {
  if (USE_MOCK) {
    throw new Error("Mock mode disabled");
  }

  // 🔑 FastAPI login expects query params
  const res = await fetch(
    `${API_BASE}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await res.json();

  // 🔑 Backend returns: { access_token, token_type }
  storeToken(data.access_token);

  // Optional: store basic user info from token
  const payload = parseJwt(data.access_token);
  if (payload?.sub) {
    storeUser({ email: payload.sub });
  }

  return data;
}

// ===============================
// CURRENT USER (OPTIONAL)
// ===============================
export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE}/me`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    logout();
    return null;
  }

  return await res.json();
}
