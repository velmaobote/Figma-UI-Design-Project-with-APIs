/* utilsfetchhelper.js
   Shared helpers: fetchJSON wrapper, auth storage, small DOM helpers
*/
export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}
export const auth = {
  saveToken(t) {
    localStorage.setItem("token", t);
  },
  getToken() {
    return localStorage.getItem("token");
  },
  clear() {
    localStorage.removeItem("token");
  },
  // LOCKED VERSION: redirect if no token
  requireAuth() {
    if (!auth.getToken()) location.href = "./login.html";
  },

  // // UNLOCKED VERSION: no redirect
  // requireAuth(){ return true; }
  // };//
};
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) =>
  Array.from(root.querySelectorAll(sel));
