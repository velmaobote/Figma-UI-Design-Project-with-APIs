/* coursespage.js — Courses from Fake Store or Open Library */
import { fetchJSON, auth, qs } from "./utilsfetchhelper.js";
import { cardCourse } from "./dom.js";

// LOCKED VERSION - require auth
auth.requireAuth();

const grid = qs("#grid");
const source = qs("#source");
const query = qs("#query");

async function load() {
  grid.innerHTML = "";
  // skeletons while loading
  for (let i = 0; i < 6; i++) {
    const sk = document.createElement("div");
    sk.className = "card";
    sk.innerHTML =
      '<div class="skeleton h-40"></div><div class="skeleton w-3/4" style="height:16px;margin-top:12px"></div><div class="skeleton w-1/2" style="height:16px;margin-top:8px"></div>';
    grid.appendChild(sk);
  }

  try {
    const src = source.value;
    const q = (query.value || "").trim();
    let items = [];

    if (src === "fakestore") {
      const data = await fetchJSON("https://fakestoreapi.com/products");
      items = data.map((p) => ({
        id: p.id,
        title: p.title,
        thumbnail: p.image,
        price: p.price,
      }));
      if (q)
        items = items.filter((p) =>
          p.title.toLowerCase().includes(q.toLowerCase())
        );
    } else {
      const data = await fetchJSON(
        "https://openlibrary.org/search.json?q=" +
          encodeURIComponent(q || "javascript") +
          "&limit=20"
      );
      items = (data.docs || []).map((d) => ({
        id: d.key,
        title: d.title,
        thumbnail: d.cover_i
          ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
          : null,
        link: d.key ? `https://openlibrary.org${d.key}` : null,
      }));
    }

    grid.innerHTML = "";
    items.forEach((item) => grid.appendChild(cardCourse(item)));
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<div class="card">Failed to load courses.</div>';
  }
}

source.addEventListener("change", load);
let t;
query.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(load, 250);
});
load();
