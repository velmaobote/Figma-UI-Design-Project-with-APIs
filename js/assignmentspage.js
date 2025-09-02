/* assignmentspage.js — JSONPlaceholder /todos with filter buttons */
import { fetchJSON, auth, qs, qsa } from "./utilsfetchhelper.js";
import { rowAssignment } from "./dom.js";

// LOCKED VERSION - require auth
auth.requireAuth();

const tbody = qs("#tbody");
const buttons = qsa("[data-filter]");
let data = [];

buttons.forEach((btn) =>
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.getAttribute("data-filter"));
  })
);

async function load() {
  tbody.innerHTML =
    '<tr><td colspan="3"><div class="skeleton" style="height:22px;"></div></td></tr>';
  data = await fetchJSON(
    "https://jsonplaceholder.typicode.com/todos?_limit=30"
  );
  render("all");
}

function render(filter) {
  let items = data;
  if (filter === "completed") items = data.filter((d) => d.completed);
  if (filter === "pending") items = data.filter((d) => !d.completed);

  tbody.innerHTML = "";
  if (!items.length) {
    tbody.innerHTML =
      '<tr><td colspan="3">No assignments for this filter.</td></tr>';
    return;
  }
  items.forEach((d) => tbody.appendChild(rowAssignment(d)));
}

load();
