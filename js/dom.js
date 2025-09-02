/* dom.js — tiny DOM builders for cards/rows */
export function cardCourse({ title, thumbnail, price, link }) {
  const el = document.createElement("div");
  el.className = "card stack";
  el.innerHTML = `
    <div class="center" style="background:#fff;border-radius:10px;height:160px;">
      ${
        thumbnail
          ? `<img src="${thumbnail}" alt="${title}" style="max-height:100%;object-fit:contain" />`
          : '<span class="hero__subtitle">No image</span>'
      }
    </div>
    <h3 style="margin:0">${title}</h3>
    ${price !== undefined ? `<strong>$${price}</strong>` : ""}
    ${
      link
        ? `<a class="btn" target="_blank" rel="noreferrer" href="${link}">View</a>`
        : ""
    }
  `;
  return el;
}

export function rowAssignment({ title, completed, userId }) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${title}</td>
    <td>${
      completed
        ? '<span class="badge badge-success">Completed</span>'
        : '<span class="badge badge-warn">Pending</span>'
    }</td>
    <td>#${userId ?? "-"}</td>`;
  return tr;
}
