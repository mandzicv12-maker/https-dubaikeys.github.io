/**
 * DubaiKeys – Investor Desk (no external branding in UI)
 * - WhatsApp buttons link to your number
 * - NDA modal sends a structured WhatsApp message
 * - Cards + filters demo (you can replace projects anytime)
 */

const WHATSAPP_NUMBER = "971527240975"; // +971 52 724 0975
const WA_PREFIX = "DubaiKeys Investor Desk";

/* Demo projects for layout (edit anytime) */
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
    developer: "Growth Developer",
    area: "Dubai South",
    priceFrom: 620000,
    paymentPlan: "70/30",
    handover: 2029,
    roiMin: 6.5,
    roiMax: 9,
    tags: ["Launch Price", "Value"]
  }
];

/* DOM */
const cardsEl = document.getElementById("cards");
const resultsCountEl = document.getElementById("resultsCount");
const filterArea = document.getElementById("filterArea");
const filterPlan = document.getElementById("filterPlan");
const filterRoiMin = document.getElementById("filterRoiMin");
const filterRoiMax = document.getElementById("filterRoiMax");
const resetBtn = document.getElementById("resetFilters");

/* Snapshot */
const snapArea = document.getElementById("snapArea");
const snapPlan = document.getElementById("snapPlan");
const snapHandover = document.getElementById("snapHandover");
const snapRoi = document.getElementById("snapRoi");

/* WhatsApp */
const waTop = document.getElementById("whatsappTop");
const waFloat = document.getElementById("waFloat");

/* Modal */
const ndaModal = document.getElementById("ndaModal");
const openNdaBtns = document.querySelectorAll("#openNdaBtn, #openNdaBtn2, #openNdaBtn3");
const closeNdaBtn = document.getElementById("closeNda");
const ndaForm = document.getElementById("ndaForm");

init();

function init() {
  setupWhatsAppButtons();
  populateAreaFilter();
  bindEvents();
  applyFilters();
}

/* WhatsApp */
function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function setupWhatsAppButtons() {
  const msg = `${WA_PREFIX}: Hello, I’m interested in off-plan investment opportunities in Dubai. Please share available options.`;
  const url = whatsappUrl(msg);

  if (waTop) waTop.href = url;
  if (waFloat) waFloat.href = url;
}

/* Filters */
function populateAreaFilter() {
  const areas = [...new Set(PROJECTS.map(p => p.area))].sort();
  for (const area of areas) {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    filterArea.appendChild(opt);
  }
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

  openNdaBtns.forEach(btn => btn.addEventListener("click", () => openNdaModal()));
  closeNdaBtn.addEventListener("click", closeNdaModal);
  ndaModal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close) closeNdaModal();
  });

  ndaForm.addEventListener("submit", submitNdaForm);
}

function applyFilters() {
  const area = filterArea.value || "";
  const plan = filterPlan.value || "";

  const min = filterRoiMin.value ? Number(filterRoiMin.value) : null;
  const max = filterRoiMax.value ? Number(filterRoiMax.value) : null;

  const filtered = PROJECTS.filter(p => {
    if (area && p.area !== area) return false;
    if (plan && p.paymentPlan !== plan) return false;

    if (min !== null && p.roiMax < min) return false;
    if (max !== null && p.roiMin > max) return false;

    return true;
  });

  renderCards(filtered);
  updateSnapshot(filtered[0] || PROJECTS[0] || null);
  resultsCountEl.textContent = `${filtered.length} results`;
}

/* Render */
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

  for (const p of list) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-top">
        ${p.tags.slice(0,2).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        <span class="tag tag-gold">${escapeHtml(p.roiMin)}–${escapeHtml(p.roiMax)}% ROI</span>
      </div>

      <h3>${escapeHtml(p.name)}</h3>
      <p class="muted">${escapeHtml(p.developer)} • ${escapeHtml(p.area)}</p>

      <div class="meta">
        <div><span class="k">From</span><span class="v">AED ${Number(p.priceFrom).toLocaleString()}</span></div>
        <div><span class="k">Plan</span><span class="v">${escapeHtml(p.paymentPlan)}</span></div>
        <div><span class="k">Handover</span><span class="v">${escapeHtml(String(p.handover))}</span></div>
        <div><span class="k">ROI</span><span class="v">${escapeHtml(p.roiMin)}–${escapeHtml(p.roiMax)}%</span></div>
      </div>

      <button class="btn btn-ghost full">Request full investment deck</button>
    `;

    card.querySelector("button").addEventListener("click", () => openNdaModal(p.name));
    cardsEl.appendChild(card);
  }
}

/* Snapshot */
function updateSnapshot(p) {
  if (!p) return;
  snapArea.textContent = p.area || "Dubai";
  snapPlan.textContent = p.paymentPlan || "—";
  snapHandover.textContent = p.handover ? String(p.handover) : "—";
  snapRoi.textContent = `${p.roiMin}–${p.roiMax}%`;
}

/* Modal */
function openNdaModal(projectName = "") {
  ndaModal.classList.add("is-open");
  ndaModal.dataset.project = projectName || "";
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

  window.open(whatsappUrl(msg), "_blank", "noopener");
  ndaForm.reset();
  closeNdaModal();
}

/* Helpers */
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
