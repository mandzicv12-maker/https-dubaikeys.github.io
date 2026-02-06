/* ================== CONFIG ================== */

// ✅ YOUR WHATSAPP NUMBER (no +, no spaces)
const WHATSAPP_NUMBER = "971527240975";

// Prefix for WhatsApp messages
const WA_PREFIX = "DubaiKeys Investor Desk";

/* ================== SAMPLE PROJECTS ==================
   These are just placeholders for layout.
   You can edit or replace them anytime.
======================================================= */

const PROJECTS = [
  {
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
    name: "Downtown Signature",
    developer: "Premium Developer",
    area: "Downtown Dubai",
    priceFrom: 850000,
    paymentPlan: "50/50",
    handover: 2028,
    roiMin: 5.5,
    roiMax: 7.5,
    tags: ["Prime Location"]
  }
];

/* ================== DOM ================== */

const cardsEl = document.getElementById("cards");
const resultsCountEl = document.getElementById("resultsCount");

const waTop = document.getElementById("whatsappTop");
const waFloat = document.getElementById("waFloat");

const openNdaBtns = document.querySelectorAll(
  "#openNdaBtn, #openNdaBtn2, #openNdaBtn3"
);

/* ================== INIT ================== */

init();

function init() {
  setupWhatsApp();
  renderProjects();
}

/* ================== WHATSAPP ================== */

function setupWhatsApp() {
  const msg = `${WA_PREFIX}: Hello, I’m interested in off-plan investment opportunities in Dubai.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  if (waTop) waTop.href = url;
  if (waFloat) waFloat.href = url;
}

/* ================== RENDER ================== */

function renderProjects() {
  cardsEl.innerHTML = "";

  PROJECTS.forEach(p => {
    const card = document.createElement("div");
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

      <a class="btn btn-ghost full" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank">
        Request full deck
      </a>
    `;

    cardsEl.appendChild(card);
  });

  resultsCountEl.textContent = `${PROJECTS.length} results`;
}
