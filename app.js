/**
 * DubaiKeys – Investor Desk
 * FULL app.js
 *
 * Features:
 * - WhatsApp CTA (top + floating) linked to your number
 * - Off-plan cards + filters (demo data)
 * - NDA + Full Deck modal (sends WhatsApp message)
 * - Market Listings (curated) loaded from ./pf-listings.json
 *   - Filters: area/type/purpose
 *   - Badge: Verified by DubaiKeys
 *   - Buttons: Open listing + Send to WhatsApp
 */

const WHATSAPP_NUMBER = "971527240975";
const WA_PREFIX = "DubaiKeys Investor Desk";

// Reelly/Market search button is in index.html (Option A). No external branding in this JS.

/* ================== OFF-PLAN DEMO PROJECTS ==================
   Replace anytime with your real curated off-plan projects
============================================================== */
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

/* ================== DOM (Off-plan) ================== */
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

// WhatsApp buttons
const waTop = document.getElementById("whatsappTop");
const waFloat = document.getElementById("waFloat");

// NDA modal
const ndaModal = document.getElementById("ndaModal");
const openNdaBtns = document.querySelectorAll("#openNdaBtn, #openNdaBtn2, #openNdaBtn3");
const closeNdaBtn = document.getElementById("closeNda");
const ndaForm = document.getElementById("ndaForm");

/* ================== INIT ================== */
init().catch(console.error);

async function init() {
  setupWhatsAppButtons();
  initOffPlan();
  initNdaModal();
  await initPfCards(); // safe: only runs if section exists
}

/* ================== WHATSAPP ================== */
function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function setupWhatsAppButtons() {
  const msg = `${WA_PREFIX}: Hello, I’m interested in off-plan investment opportunities in Dubai. Please share available options.`;
  const url = whatsappUrl(msg);

  if (waTop) waTop.href = url;
  if (waFloat) waFloat.href = url;
}

/* ================== OFF-PLAN UI ================== */
function initOffPlan() {
  if (!cardsEl) return;

  populateAreaFilter(PROJECTS);
  bindOffPlanEvents();
  applyOffPlanFilters();
}

function populateAreaFilter(list) {
  if (!filterArea) return;
  const areas = [...new Set(list.map(p => p.area).filter(Boolean))].sort();

  // Keep "All areas" option already in HTML
  areas.forEach(area => {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    filterArea.appendChild(opt);
  });
}

function bindOffPlanEvents() {
  filterArea?.addEventListener("change", applyOffPlanFilters);
  filterPlan?.addEventListener("change", applyOffPlanFilters);
  filterRoiMin?.addEventListener("input", applyOffPlanFilters);
  filterRoiMax?.addEventListener("input", applyOffPlanFilters);

  resetBtn?.addEventListener("click", () => {
    filterArea.value = "";
    filterPlan.value = "";
    filterRoiMin.value = "";
    filterRoiMax.value = "";
    applyOffPlanFilters();
  });
}

function applyOffPlanFilters() {
  const area = filterArea?.value || "";
  const plan = filterPlan?.value || "";

  const min = filterRoiMin?.value ? Number(filterRoiMin.value) : null;
  const max = filterRoiMax?.value ? Number(filterRoiMax.value) : null;

  const filtered = PROJECTS.filter(p => {
    if (area && p.area !== area) return false;
    if (plan && p.paymentPlan !== plan) return false;

    if (min !== null && p.roiMax < min) return false;
    if (max !== null && p.roiMin > max) return false;

    return true;
  });

  renderOffPlanCards(filtered);
  updateSnapshot(filtered[0] || PROJECTS[0] || null);
  if (resultsCountEl) resultsCountEl.textContent = `${filtered.length} results`;
}

function renderOffPlanCards(list) {
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
  });
}

function updateSnapshot(p) {
  if (!p) return;
  if (snapArea) snapArea.textContent = p.area || "Dubai";
  if (snapPlan) snapPlan.textContent = p.paymentPlan || "—";
  if (snapHandover) snapHandover.textContent = p.handover ? String(p.handover) : "—";
  if (snapRoi) snapRoi.textContent = `${p.roiMin}–${p.roiMax}%`;
}

/* ================== NDA MODAL ================== */
function initNdaModal() {
  if (!ndaModal || !ndaForm) return;

  openNdaBtns.forEach(btn => btn.addEventListener("click", () => openNdaModal()));

  closeNdaBtn?.addEventListener("click", closeNdaModal);

  ndaModal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close) closeNdaModal();
  });

  ndaForm.addEventListener("submit", submitNdaForm);
}

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

/* ================== MARKET LISTINGS (Property Finder curated JSON) ==================
   Requires:
   - index.html section with:
     pfCards, pfCount, pfAreaFilter, pfTypeFilter, pfPurposeFilter, pfReset
   - file pf-listings.json in repo root
==================================================================================== */

async function initPfCards() {
  const pfCards = document.getElementById("pfCards");
  const pfCount = document.getElementById("pfCount");
  const pfAreaFilter = document.getElementById("pfAreaFilter");
  const pfTypeFilter = document.getElementById("pfTypeFilter");
  const pfPurposeFilter = document.getElementById("pfPurposeFilter");
  const pfReset = document.getElementById("pfReset");

  // If market section isn't present, skip
  if (!pfCards || !pfCount || !pfAreaFilter || !pfTypeFilter || !pfPurposeFilter || !pfReset) return;

  let all = [];

  try {
    const res = await fetch("./pf-listings.json", { cache: "no-store" });
    const raw = await res.json();
    all = Array.isArray(raw) ? raw : [];
  } catch (e) {
    pfCards.innerHTML = `
      <div class="card" style="grid-column:1/-1;">
        <h3>Listings not loaded</h3>
        <p class="muted">Make sure <b>pf-listings.json</b> exists in your repo root.</p>
      </div>
    `;
    pfCount.textContent = "0 listings";
    return;
  }

  // Fill Area options dynamically
  const areas = [...new Set(all.map(x => x.area).filter(Boolean))].sort();
  areas.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    pfAreaFilter.appendChild(opt);
  });

  function apply() {
    const area = (pfAreaFilter.value || "").trim();
    const type = (pfTypeFilter.value || "").trim();
    const purpose = (pfPurposeFilter.value || "").trim();

    const filtered = all.filter(x => {
      if (area && x.area !== area) return false;
      if (type && x.type !== type) return false;
      if (purpose && x.purpose !== purpose) return false;
      return true;
    });

    pfCount.textContent = `${filtered.length} listing${filtered.length === 1 ? "" : "s"}`;

    if (!filtered.length) {
      pfCards.innerHTML = `
        <div class="card" style="grid-column:1/-1;">
          <h3>No listings match your filters</h3>
          <p class="muted">Try another area or reset filters.</p>
        </div>
      `;
      return;
    }

    pfCards.innerHTML = "";

    filtered.forEach(x => {
      const card = document.createElement("article");
      card.className = "card";

      // WhatsApp message for THIS listing
      const waMsg =
        `DubaiKeys — Listing enquiry\n\n` +
        `Verified by DubaiKeys\n` +
        `Title: ${x.title || "Listing"}\n` +
        `Area: ${x.area || "—"}\n` +
        `Type: ${x.type || "—"}\n` +
        `Beds: ${x.beds || "—"}\n` +
        `Purpose: ${x.purpose || "—"}\n` +
        `Price: ${x.price || "—"}\n\n` +
        `Link: ${x.url || ""}`;

      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

      const tags = [
        `<span class="tag tag-verified">Verified by DubaiKeys</span>`,
        x.area ? `<span class="tag">${escapeHtml(x.area)}</span>` : "",
        x.type ? `<span class="tag">${escapeHtml(x.type)}</span>` : "",
        x.beds ? `<span class="tag tag-gold">${escapeHtml(String(x.beds))} beds</span>` : ""
      ].filter(Boolean).join("");

      const highlights = Array.isArray(x.highlights) ? x.highlights.slice(0, 3) : [];

      card.innerHTML = `
        <div class="card-top">${tags}</div>

        <h3>${escapeHtml(x.title || "Listing")}</h3>
        <p class="muted">${escapeHtml(x.purpose || "")} ${x.price ? "• " + escapeHtml(x.price) : ""}</p>

        <div class="meta">
          <div><span class="k">Area</span><span class="v">${escapeHtml(x.area || "—")}</span></div>
          <div><span class="k">Type</span><span class="v">${escapeHtml(x.type || "—")}</span></div>
          <div><span class="k">Beds</span><span class="v">${escapeHtml(String(x.beds || "—"))}</span></div>
          <div><span class="k">Purpose</span><span class="v">${escapeHtml(x.purpose || "—")}</span></div>
        </div>

        ${
          highlights.length
            ? `<p class="muted" style="margin:0 0 12px;">• ${highlights.map(escapeHtml).join("<br>• ")}</p>`
            : ""
        }

        <div class="pf-actions">
          <a class="btn btn-primary full" href="${escapeAttr(x.url || "#")}" target="_blank" rel="noopener">
            Open listing
          </a>

          <a class="btn btn-ghost full" href="${escapeAttr(waLink)}" target="_blank" rel="noopener">
            Send to WhatsApp
          </a>
        </div>
      `;

      pfCards.appendChild(card);
    });
  }

  pfAreaFilter.addEventListener("change", apply);
  pfTypeFilter.addEventListener("change", apply);
  pfPurposeFilter.addEventListener("change", apply);

  pfReset.addEventListener("click", () => {
    pfAreaFilter.value = "";
    pfTypeFilter.value = "";
    pfPurposeFilter.value = "";
    apply();
  });

  apply();
}

/* ================== HELPERS ================== */
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  // Basic attribute escaping (enough for URLs in href)
  return escapeHtml(s).replaceAll("\n", " ").trim();
}
