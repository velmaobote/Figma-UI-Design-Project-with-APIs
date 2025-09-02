/* app.js
   - Footer year
   - Mobile nav open/close
   - Login/Logout toggle in navbar
   - Dashboard stat widgets
*/
import { fetchJSON, auth, qs } from "./utilsfetchhelper.js";

// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Fill [data-today] with a friendly date on any page that has it
document.querySelectorAll("[data-today]").forEach((el) => {
  try {
    el.textContent = new Date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    el.textContent = new Date().toDateString();
  }
});

// Mobile nav
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks)
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));

// Login/Logout toggle
(function initNavAuth() {
  const token = auth.getToken();
  const login = document.getElementById("navLogin");
  const logout = document.getElementById("navLogout");
  if (!login || !logout) return;
  login.style.display = token ? "none" : "inline-flex";
  logout.style.display = token ? "inline-flex" : "none";
  logout.addEventListener("click", () => {
    auth.clear();
    location.href = "./login.html";
  });
})();

// Extra sidebar logout (if present)
["logoutBtn2"].forEach((id) => {
  const b = document.getElementById(id);
  if (b)
    b.addEventListener("click", () => {
      auth.clear();
      location.href = "./login.html";
    });
});

// Dashboard stats (only on dashboard.html)
// LOCKED VERSION - require auth
if (location.pathname.endsWith("/dashboard.html")) {
  auth.requireAuth();
  (async () => {
    try {
      const [products, todos] = await Promise.all([
        fetchJSON("https://fakestoreapi.com/products"),
        fetchJSON("https://jsonplaceholder.typicode.com/todos?_limit=40"),
      ]);
      const total = todos.length;
      const done = todos.filter((t) => t.completed).length;
      qs("#statCourses").textContent = products.length;
      qs("#statDeadlines").textContent = total - done;
      qs("#statProgress").textContent = total
        ? Math.round((done / total) * 100) + "%"
        : "0%";
    } catch (e) {
      console.error(e);
      ["#statCourses", "#statDeadlines", "#statProgress"].forEach(
        (s) => qs(s) && (qs(s).textContent = "ERR")
      );
    }
  })();
}
