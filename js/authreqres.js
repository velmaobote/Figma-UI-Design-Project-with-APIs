/* authreqs.js
   - Login via ReqRes POST /api/login
   - Sign up via ReqRes POST /api/register
   - Forgot password mock success
*/
import { fetchJSON, auth, qs } from "./utilsfetchhelper.js";

// LOGIN -----------------------------------------------------------
const loginForm = qs("#loginForm");
if (loginForm) {
  const rem = localStorage.getItem("rememberEmail") || "";
  if (rem) qs("#email").value = rem;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    const remember = qs("#remember").checked;
    const errBox = qs("#loginError");
    errBox.classList.add("hidden");
    try {
      const data = await fetchJSON("https://reqres.in/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      auth.saveToken(data.token);
      remember
        ? localStorage.setItem("rememberEmail", email)
        : localStorage.removeItem("rememberEmail");
      location.href = "./dashboard.html";
    } catch (e) {
      errBox.textContent =
        "Invalid email or password. Try: eve.holt@reqres.in / cityslicka";
      errBox.classList.remove("hidden");
    }
  });
}

// SIGN UP ---------------------------------------------------------
const signupForm = qs("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = qs("#suEmail").value.trim();
    const password = qs("#suPassword").value;
    const confirm = qs("#suConfirm").value;
    const errBox = qs("#signupError");
    errBox.classList.add("hidden");

    if (password !== confirm) {
      errBox.textContent = "Passwords do not match.";
      errBox.classList.remove("hidden");
      return;
    }
    try {
      const data = await fetchJSON("https://reqres.in/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      auth.saveToken(data.token);
      location.href = "./dashboard.html";
    } catch (e) {
      errBox.textContent =
        "Registration failed. Try: eve.holt@reqres.in / pistol";
      errBox.classList.remove("hidden");
    }
  });
}

// FORGOT ----------------------------------------------------------
const forgotForm = qs("#forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.getElementById("forgotSuccess");
    success.classList.remove("hidden");
  });
}
