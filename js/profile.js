/* profile.js — Profile page (no personal info displayed) */
import { auth, qs, qsa } from "./utilsfetchhelper.js";

// LOCKED VERSION - require auth
auth.requireAuth();

const store = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("profilePublic") || "{}");
    } catch {
      return {};
    }
  },
  set(d) {
    localStorage.setItem("profilePublic", JSON.stringify(d));
  },
};
const data = Object.assign(
  {
    about: "",
    languages: [],
    socials: {
      LinkedIn: false,
      Twitter: false,
      GitHub: false,
      Dribbble: false,
      Behance: false,
    },
    interests: [],
    region: "",
  },
  store.get()
);

const aboutText = qs("#aboutText"),
  addAboutBtn = qs("#addAboutBtn"),
  editAbout = qs("#editAbout"),
  langList = qs("#langList"),
  addLang = qs("#addLang"),
  socialList = qs("#socialList"),
  addSocial = qs("#addSocial"),
  interestList = qs("#interestList"),
  addInterest = qs("#addInterest"),
  regionText = qs("#regionText"),
  editRegion = qs("#editRegion"),
  donut = qs("#donut"),
  donutVal = qs("#donutVal"),
  chkAbout = qs("#chkAbout"),
  chkLang = qs("#chkLang"),
  chkSocial = qs("#chkSocial"),
  chkInterest = qs("#chkInterest"),
  copyLink = qs("#copyLink");

function pill(text, onRemove) {
  const el = document.createElement("span");
  el.className = "pill";
  el.innerHTML = `<span>${text}</span><button aria-label="remove">×</button>`;
  el.querySelector("button").addEventListener("click", onRemove);
  return el;
}

function renderAbout() {
  if (data.about?.trim()) {
    aboutText.textContent = data.about;
    addAboutBtn.textContent = "Update About Me";
  } else {
    aboutText.textContent =
      "You seem like someone interesting… Tell us a little about yourself, your passion, what you live for…";
    addAboutBtn.textContent = "Add About Me Info";
  }
  chkAbout.checked = !!data.about;
}
function renderLanguages() {
  langList.innerHTML = "";
  if (!data.languages.length) {
    langList.innerHTML =
      '<p class="hero__subtitle">Add the languages you’re comfortable with.</p>';
  } else {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "8px";
    data.languages.forEach((lang, i) =>
      row.appendChild(
        pill(lang, () => {
          data.languages.splice(i, 1);
          saveAndRender();
        })
      )
    );
    langList.appendChild(row);
  }
  chkLang.checked = data.languages.length > 0;
}
function renderSocials() {
  socialList.innerHTML = "";
  const providers = Object.keys(data.socials);
  providers.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card stack";
    card.innerHTML = `<strong>${p}</strong>
      <span class="hero__subtitle">${
        data.socials[p] ? "Connected" : "Not connected"
      }</span>
      <button class="btn ${
        data.socials[p] ? "" : "btn-secondary"
      }" data-p="${p}">${data.socials[p] ? "Disconnect" : "Connect"}</button>`;
    socialList.appendChild(card);
  });
  qsa("[data-p]", socialList).forEach((btn) =>
    btn.addEventListener("click", () => {
      const p = btn.getAttribute("data-p");
      data.socials[p] = !data.socials[p];
      saveAndRender();
    })
  );
  chkSocial.checked = providers.some((p) => data.socials[p]);
}
function renderInterests() {
  interestList.innerHTML = "";
  if (!data.interests.length) {
    interestList.innerHTML =
      '<p class="hero__subtitle">Share non-personal interests to boost visibility.</p>';
  } else {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "8px";
    data.interests.forEach((it, i) =>
      row.appendChild(
        pill(it, () => {
          data.interests.splice(i, 1);
          saveAndRender();
        })
      )
    );
    interestList.appendChild(row);
  }
  chkInterest.checked = data.interests.length > 0;
}
function renderRegion() {
  regionText.textContent =
    data.region ||
    "Not set — share your general region (e.g., “East Africa”) if you wish. Avoid specific addresses.";
}
function renderProgress() {
  const items = [
    !!data.about,
    data.languages.length > 0,
    Object.values(data.socials).some(Boolean),
    data.interests.length > 0,
  ];
  const pct = Math.round((items.filter(Boolean).length / items.length) * 100);
  donut.style.setProperty("--val", pct.toString());
  donutVal.textContent = pct + "%";
}

// Actions
addAboutBtn.addEventListener("click", () => {
  const next = prompt(
    "Write a short, non-personal summary (avoid name & contacts):",
    data.about || ""
  );
  if (next !== null) {
    data.about = next.trim();
    saveAndRender();
  }
});
editAbout.addEventListener("click", () => addAboutBtn.click());

addLang.addEventListener("click", () => {
  const next = prompt("Add a language (e.g., English, Swahili):");
  if (next) {
    data.languages.push(next.trim());
    saveAndRender();
  }
});
addSocial.addEventListener("click", () => {
  Object.keys(data.socials).forEach((p) => (data.socials[p] = true));
  saveAndRender();
  alert("Connected demo social profiles (no usernames shown).");
});
addInterest.addEventListener("click", () => {
  const next = prompt("Add an interest (e.g., UI Design, Machine Learning):");
  if (next) {
    data.interests.push(next.trim());
    saveAndRender();
  }
});
editRegion.addEventListener("click", () => {
  const next = prompt(
    "Set a generic region (avoid exact addresses):",
    data.region || ""
  );
  if (next !== null) {
    data.region = next.trim();
    saveAndRender();
  }
});
if (copyLink) {
  copyLink.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copyLink.textContent = "Copied!";
      setTimeout(() => (copyLink.textContent = "Copy link"), 1200);
    } catch {
      alert("Copy failed.");
    }
  });
}

// Cosmetic tabs
qsa(".tab").forEach((btn) =>
  btn.addEventListener("click", () => {
    qsa(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  })
);

function saveAndRender() {
  store.set(data);
  renderAbout();
  renderLanguages();
  renderSocials();
  renderInterests();
  renderRegion();
  renderProgress();
}
saveAndRender();
