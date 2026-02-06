/**
 * DubaiKeys – Investor Desk
 * Independent version (no Reelly references)
 * Features:
 * - Project cards
 * - Filters (Area / Payment Plan / ROI)
 * - WhatsApp CTA (HNWI)
 * - NDA + Full Deck modal flow
 */

/* ================== CONFIG ================== */

// 👉 CHANGE to your real WhatsApp number (no +, no spaces)
const WHATSAPP_NUMBER = "971527240975";

// Prefix for WhatsApp messages
const WA_PREFIX = "DubaiKeys Investor Desk";

/* ================== PROJECT DATA ==================
   You can manually manage projects here
   or later connect your own database/API
=================================================== */

const PROJECTS = [
  {
    id: 1,
    name: "Marina Residences",
    developer: "Tier-1 Developer",
    area: "Dubai Marina",
    priceFrom: 1200000,
    paymentPlan: "60/40",
    handover: 2027,
    roiMin: 6,
    roiMax: 8,
    tags: ["Exclusive", "High Demand"]
  },
  {
    id: 2,
    name: "Downtown Signature",
    developer: "Premium Developer",
    area: "Downtown Dubai",
    priceFrom: 850000,
    paymentPlan: "50/50",
    handover: 2028,
    roiMin: 5.5,
    roiMax: 7.5,
    tags: ["Prime Location"]
  },
  {
    id: 3,
    name: "Dubai South Villas",
    developer: "Growth-Focused Developer",
    area: "Dubai South",
    priceFrom: 620000,
    paymentPlan: "70/30",
    handover: 2029,
    roiMin: 6.5,
    roiMax: 9,
    tags: ["Launch Price", "Value"]
  }
];

/* ================== DOM ELEMENTS ================== */

const cardsEl = document.getElementById("cards");
const resultsCountEl = document.getElementById("resultsCount");

const filterArea = document.getElementById("filterArea");
const filterPlan = document.getElementById("filterPlan");
const filterRoiMin = document.getElementById("filterRoiMin");
const filterRoiMax = document.getElementById("filterRoiMax");
const resetBtn = document.getElementById("resetFilters");

// Snapshot
const snapArea = document.getElementById("snapArea");
const snapPlan = document.getElementById("snapPlan");
const snapHandover = document.getElementById("snapHandover");
const snapRoi = document.getElementById("snapRoi");

// WhatsApp
const waTop = document.getElementById("whatsappTop");
const waFloat = document.getElementById("waFloat");

// NDA modal
const ndaModal = document.getElementById("ndaModal");
const openNdaBtns = document.querySelectorAll(
  "#openNdaBtn, #openNdaBtn2, #openNdaBtn3"
);
const closeNdaBtn = document.getElementById("closeNda");
const ndaForm = document.getElementById("ndaForm");

/* ================== INIT ================== */

init();

function init() {
  setupWhatsApp();
  populateAreaFilter();
  bindEvents();
  applyFilters();
}

/* ================== WHATSAPP ================== */

function setupWhatsApp() {
  const msg = `${WA_PREFIX}: Hello, I am interested in off-plan investment opportunities in Dubai.`;
  const url = whatsappUrl(msg);
  waTop.href = url;
  waFloat.href = url;
}

function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ================== FILTER SETUP ================== */

function populateAreaFilter() {
  const areas = [...new Set(PROJECTS.map(p => p.area))];
  areas.forEach(area => {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    filterArea.appendChild(opt);
  });
}

function bindEvents() {
  filterArea.addEventListener("change", applyFilters);
  filterPlan.addEventListener("change", applyFilters);
  filterRoiMin.addEventListener("input", applyFilters);
  filterRoiMax.addEventListener("input", applyFilters);

  resetBtn.addEventListener("click", () => {
    filterArea.value = "";
    filterPlan.value = "";
    filterRoiMin.value = "";
    filterRoiMax.value = "";
    applyFilters();
  });

  openNdaBtns.forEach(btn =>
    btn.addEventListener("click", () => openNdaModal())
  );

  closeNdaBtn.addEventListener("click", closeNdaModal);
  ndaModal.addEventListener("click", e => {
    if (e.target.dataset.close) closeNdaModal();
  });

  ndaForm.addEventListener("submit", submitNdaForm);
}

/* ================== FILTER LOGIC ================== */

function applyFilters() {
  let filtered = PROJECTS.filter(p => {
    if (filterArea.value && p.area !== filterArea.value) return false;
    if (filterPlan.value && p.paymentPlan !== filterPlan.value) return false;

    const min = filterRoiMin.value ? Number(filterRoiMin.value) : null;
    const max = filterRoiMax.value ? Number(filterRoiMax.value) : null;

    if (min !== null && p.roiMax < min) return false;
    if (max !== null && p.roiMin > max) return false;

    return true;
  });

  renderCards(filtered);
  updateSnapshot(filtered[0]);
  resultsCountEl.textContent = `${filtered.length} results`;
}

/* ================== RENDER ================== */

function renderCards(list) {
  cardsEl.innerHTML = "";

  if (!list.length) {
    cardsEl.innerHTML = `
      <div class="card">
        <h3>No matching opportunities</h3>
        <p class="muted">Adjust filters to widen your search.</p>
      </div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-top">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        <span class="tag tag-gold">${p.roiMin}–${p.roiMax}% ROI</span>
      </div>

      <h3>${p.name}</h3>
      <p class="muted">${p.developer} • ${p.area}</p>

      <div class="meta">
        <div><span class="k">From</span><span class="v">AED ${p.priceFrom.toLocaleString()}</span></div>
        <div><span class="k">Plan</span><span class="v">${p.paymentPlan}</span></div>
        <div><span class="k">Handover</span><span class="v">${p.handover}</span></div>
        <div><span class="k">ROI</span><span class="v">${p.roiMin}–${p.roiMax}%</span></div>
      </div>

      <button class="btn btn-ghost full" onclick="openNdaModal('${p.name}')">
        Request full investment deck
      </button>
    `;

    cardsEl.appendChild(card);
  });
}

/* ================== SNAPSHOT ================== */

function updateSnapshot(p) {
  if (!p) return;
  snapArea.textContent = p.area;
  snapPlan.textContent = p.paymentPlan;
  snapHandover.textContent = p.handover;
  snapRoi.textContent = `${p.roiMin}–${p.roiMax}%`;
}

/* ================== NDA MODAL ================== */

function openNdaModal(projectName = "") {
  ndaModal.classList.add("is-open");
  ndaModal.dataset.project = projectName;
}

function closeNdaModal() {
  ndaModal.classList.remove("is-open");
}

function submitNdaForm(e) {
  e.preventDefault();

  const data = new FormData(ndaForm);
  const project = ndaModal.dataset.project || "Investor shortlist";

  const msg =
`${WA_PREFIX}: NDA + Full Deck Request

Name: ${data.get("name")}
Email: ${data.get("email")}
WhatsApp: ${data.get("whatsapp")}
Investor type: ${data.get("type")}
Target project: ${project}
Strategy: ${data.get("strategy") || "-"}

Please send NDA and full investment deck.`;

  window.open(whatsappUrl(msg), "_blank");
  ndaForm.reset();
  closeNdaModal();
}
Add app.js

