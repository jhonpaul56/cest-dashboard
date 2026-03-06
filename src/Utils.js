// ─── CEST 2.0 UTILS & CONSTANTS ───────────────────────────────────────────────

export const COMPONENTS = {
  sel:   "Sustainable Enterprise & Livelihoods",
  hn:    "Health & Nutrition",
  hrd:   "Human Resource Dev.",
  drrm:  "DRRM & CCA",
  bgcet: "Bio-Circular-Green Economy",
  dg:    "Digital Governance",
};

export const COMP_COLORS = {
  sel:   "#eb9c25",
  hn:    "#efd20f",
  hrd:   "#3823f5",
  drrm:  "#dc2626",
  bgcet: "#0ecb1a",
  dg:    "#e319a7",
};

export const PIE_COLORS = ["#eb9c25", "#efd20f", "#3823f5", "#dc2626", "#0ecb1a", "#e319a7"];

// ── Status options ── (changed "Finish" → "Finished")
export const STATUS_OPTIONS = ["Ongoing", "Liquidated", "Finished"];

// ── Community types (toggle chips like components) ──
export const COMMUNITY_TYPES = {
  gida:        "GIDA",
  conflict:    "Conflict",
  indigenous:  "Indigenous",
  womens:      "Women's",
  marginalized:"Marginalized",
  landless:    "Landless",
  artisanal:   "Artisanal",
};

export const COMMUNITY_COLORS = {
  gida:        "#0891b2",
  conflict:    "#dc2626",
  indigenous:  "#7c3aed",
  womens:      "#db2777",
  marginalized:"#d97706",
  landless:    "#65a30d",
  artisanal:   "#0f766e",
};

export const KPI_LIST = [
  { id: 1, key: "sel",   color: "#eb9c25", title: "Sustainable Enterprise and Livelihoods",  target: 5, indicators: ["No. of S&T-based livelihood projects implemented in communities with high poverty incidence"] },
  { id: 2, key: "hn",    color: "#efd20f", title: "Health and Nutrition",                     target: 4, indicators: ["No. of S&T-based nutrition interventions conducted to support food security and safety", "No. of health and nutrition database tools deployed"] },
  { id: 3, key: "hrd",   color: "#3823f5", title: "Human Resource Development",              target: 3, indicators: ["No. of e-learning tools deployed", "No. of trainings on S&T education conducted", "No. of DOST scholarship applicants"] },
  { id: 4, key: "drrm",  color: "#dc2626", title: "DRRM and CCA",                             target: 3, indicators: ["No. of DRRM and CCA Technologies deployed to advance DRRM and CCA processes in communities"] },
  { id: 5, key: "bgcet", color: "#0ecb1a", title: "Bio-Circular-Green Economy Technologies", target: 4, indicators: ["No. of bio-circular green economy technologies deployed", "No. of households adopting renewable energy systems", "Number of local plans and policies developed"] },
  { id: 6, key: "dg",    color: "#e319a7", title: "Digital Governance Tools",                 target: 3, indicators: ["No. of database tools and ICT-related technologies deployed to support digital governance in communities"] },
];

export const DEFAULT_SETTINGS = {
  name:"CEST Admin", email:"admin@cest.dost.gov.ph", role:"Administrator",
  showCharts:true, showEquipTable:true, showMuniSummary:true, defaultYear:"All",
  notifProjects:true, notifEquipment:true, notifBudget:true, notifReports:true,
  autoSave:true, confirmDelete:true,
  targets: KPI_LIST.reduce((a, k) => ({ ...a, [k.key]: k.target }), {}),
};

export const LS_KEYS = {
  projects:      "cest_projects",
  equipment:     "cest_equipment",
  notifications: "cest_notifications",
  settings:      "cest_settings",
};

// ── Currency formatter ──
export const fmt = (v) => v ? `₱${Number(v).toLocaleString("en-PH")}` : "₱0";

// ── localStorage helpers ──
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage save error:", e);
  }
}

// ── Open project profile as PDF in new tab ──
export function openProjectAsPDF(p) {
  const compBadges = p.components.map(c => `
    <div style="display:inline-flex;align-items:center;gap:8px;background:${COMP_COLORS[c]}18;border:1px solid ${COMP_COLORS[c]}40;border-radius:8px;padding:7px 14px;margin:4px 6px 4px 0;">
      <span style="width:9px;height:9px;border-radius:50%;background:${COMP_COLORS[c]};display:inline-block;"></span>
      <span style="font-size:12px;font-weight:800;color:${COMP_COLORS[c]};text-transform:uppercase;">${c}</span>
      <span style="font-size:11px;color:#6b7280;">— ${COMPONENTS[c]}</span>
    </div>
  `).join("");

  const commBadges = (p.communities||[]).map(c => `
    <div style="display:inline-flex;align-items:center;gap:6px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:5px 10px;margin:3px;">
      <span style="font-size:11px;font-weight:700;color:#0369a1;">${COMMUNITY_TYPES[c]||c}</span>
    </div>
  `).join("");

  const statusColor = p.status==="Ongoing"?"#16a34a":p.status==="Liquidated"?"#d97706":"#4338ca";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${p.project} — CEST 2.0</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f3f4f6;color:#111827;}
    @media print{body{background:#fff;}.no-print{display:none!important;}.page{box-shadow:none;margin:0;border-radius:0;max-width:100%;}}
    .page{max-width:820px;margin:32px auto;background:#fff;border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.13);overflow:hidden;}
    .header{background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);padding:28px 32px 22px;}
    .header-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px;}
    .agency-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;}
    .project-title{font-size:20px;font-weight:900;color:#fff;line-height:1.35;}
    .header-meta{font-size:12px;color:rgba(255,255,255,0.75);margin-top:8px;line-height:1.6;}
    .status-badge{display:inline-block;background:${statusColor};color:#fff;border-radius:20px;padding:4px 16px;font-size:12px;font-weight:800;margin-right:6px;}
    .print-btn{background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;border-radius:8px;padding:8px 18px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;}
    .body{padding:28px 32px;}
    .section-label{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;margin-top:20px;}
    .section-label:first-child{margin-top:0;}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px;}
    .info-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;}
    .info-card .label{font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;}
    .info-card .value{font-size:14px;font-weight:800;color:#111827;}
    .info-card .value.money{font-size:18px;color:#16a34a;}
    .stats-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:4px;}
    .stats-box{border-radius:10px;padding:14px 18px;}
    .stats-box.green{background:#f0fdf4;}
    .stats-box.purple{background:#f5f3ff;}
    .box-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;}
    .stats-box.green .box-title{color:#16a34a;}
    .stats-box.purple .box-title{color:#7c3aed;}
    .stats-inner{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;}
    .num{font-size:22px;font-weight:900;}
    .num.green{color:#16a34a;}
    .num.purple{color:#7c3aed;}
    .sublabel{font-size:9px;color:#6b7280;font-weight:600;margin-top:2px;}
    .footer{background:#1e3a5f;color:rgba(255,255,255,0.6);font-size:10px;padding:14px 32px;display:flex;justify-content:space-between;align-items:center;}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-top">
      <div style="flex:1;">
        <div class="agency-label">DOST — CEST 2.0 Project Profile</div>
        <div class="project-title">${p.project}</div>
        <div class="header-meta">
          <span class="status-badge">${p.status}</span>
          ${p.municipality} &nbsp;·&nbsp; Year ${p.year}
        </div>
      </div>
      <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save PDF</button>
    </div>
    <div>${compBadges}</div>
  </div>
  <div class="body">
    <div class="section-label">📋 Project Information</div>
    <div class="info-grid">
      <div class="info-card"><div class="label">📍 Municipality / City</div><div class="value">${p.municipality}</div></div>
      <div class="info-card"><div class="label">📅 Year</div><div class="value">${p.year}</div></div>
      <div class="info-card" style="grid-column:span 2;"><div class="label">👥 Community / Beneficiaries</div><div class="value">${p.community || "—"}</div></div>
      <div class="info-card"><div class="label">💰 Amount Funded</div><div class="value money">${fmt(p.amountFunded)}</div></div>
      <div class="info-card"><div class="label">📆 Amount per Year</div><div class="value">${p.amountPerYear ? fmt(p.amountPerYear) : "—"}</div></div>
    </div>

    ${p.components.length > 0 ? `
    <div class="section-label">🧩 CEST 2.0 Components</div>
    <div style="background:#f8faff;border-radius:10px;padding:14px 18px;margin-bottom:4px;">${compBadges}</div>
    ` : ""}

    ${(p.communities||[]).length > 0 ? `
    <div class="section-label">🏘️ Community Types</div>
    <div style="background:#f0f9ff;border-radius:10px;padding:14px 18px;margin-bottom:4px;">${commBadges}</div>
    ` : ""}

    <div class="section-label">👥 Beneficiaries & Stakeholders</div>
    <div class="stats-row">
      <div class="stats-box green">
        <div class="box-title">👥 No. of Beneficiaries</div>
        <div class="stats-inner">
          <div><div class="num green">${p.beneficiaries?.male||0}</div><div class="sublabel">Male</div></div>
          <div><div class="num green">${p.beneficiaries?.female||0}</div><div class="sublabel">Female</div></div>
          <div><div class="num green">${p.beneficiaries?.ips||0}</div><div class="sublabel">IP's</div></div>
          <div><div class="num green">${p.beneficiaries?.fourps||0}</div><div class="sublabel">4P's</div></div>
          <div><div class="num green">${p.beneficiaries?.pwd||0}</div><div class="sublabel">PWD</div></div>
          <div><div class="num green">${p.beneficiaries?.senior||0}</div><div class="sublabel">Senior</div></div>
          <div><div class="num green">${p.beneficiaries?.total||0}</div><div class="sublabel">Total</div></div>
        </div>
      </div>
      <div class="stats-box purple">
        <div class="box-title">🏛️ Stakeholders</div>
        <div class="stats-inner">
          <div><div class="num purple">${p.stakeholders?.lgu||0}</div><div class="sublabel">LGU</div></div>
          <div><div class="num purple">${p.stakeholders?.plgu||0}</div><div class="sublabel">PLGU</div></div>
          <div><div class="num purple">${p.stakeholders?.blgu||0}</div><div class="sublabel">BLGU</div></div>
          <div><div class="num purple">${p.stakeholders?.pnp||0}</div><div class="sublabel">PNP</div></div>
          <div><div class="num purple">${p.stakeholders?.suc||0}</div><div class="sublabel">SUC</div></div>
          <div><div class="num purple">${p.stakeholders?.others||0}</div><div class="sublabel">${p.stakeholders?.othersLabel||"Others"}</div></div>
        </div>
      </div>
    </div>

    <div class="section-label">✍️ Prepared By</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:8px;padding-bottom:8px;">
      ${["Prepared by","Reviewed by","Approved by"].map(label=>`
        <div style="text-align:center;">
          <div style="border-top:2px solid #374151;margin-top:48px;padding-top:8px;">
            <div style="font-size:11px;font-weight:700;color:#374151;">${label}</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:2px;">Signature over Printed Name</div>
          </div>
        </div>
      `).join("")}
    </div>
  </div>
  <div class="footer">
    <span>DOST — Community Empowerment thru Science &amp; Technology (CEST 2.0)</span>
    <span>Generated: ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</span>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  window.open(URL.createObjectURL(blob), "_blank");
}