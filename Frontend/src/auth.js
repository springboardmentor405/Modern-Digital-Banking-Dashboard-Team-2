
const API_BASE = "/api"; 
const USE_MOCK = true;   

const TOKEN_KEY = "id_token";
const USER_KEY = "currentUser";

export function storeToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function removeToken() { localStorage.removeItem(TOKEN_KEY); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function storeUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function removeUser() { localStorage.removeItem(USER_KEY); }
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}


export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const p = parseJwt(token);
  if (!p || !p.exp) return true;
  return p.exp <= Math.floor(Date.now() / 1000);
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


function makeFakeJwt(payload = {}, expiresInSeconds = 3600) {
  const header = { alg: "none", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const full = { ...payload, iat: now, exp: now + expiresInSeconds };
  
  const b64 = (u) => btoa(JSON.stringify(u))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    
  return `${b64(header)}.${b64(full)}.`; 
}


export async function signup({ name, email, password }) {
  if (USE_MOCK) {
    const existing = JSON.parse(localStorage.getItem("mockUser") || "null");
    if (existing && existing.email === email) throw new Error("Email already registered");
    
    localStorage.setItem("mockUser", JSON.stringify({ name, email, password }));
    return { user: { name, email } };
  } else {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error(await res.text() || "Signup failed");
    return await res.json();
  }
}

export async function login({ email, password }) {
  if (USE_MOCK) {
    const mock = JSON.parse(localStorage.getItem("mockUser") || "null");
    if (!mock || mock.email !== email || mock.password !== password) {
      throw new Error("Invalid credentials or user not found.");
    }
    const token = makeFakeJwt({ email, name: mock.name }, 86400);
    storeToken(token);
    storeUser({ email: mock.email, name: mock.name });
    return { token, user: { email: mock.email, name: mock.name } };
  } else {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text() || "Login failed");
    const data = await res.json();
    if (data.token) {
      storeToken(data.token);
      storeUser(data.user || { email });
    }
    return data;
  }
}