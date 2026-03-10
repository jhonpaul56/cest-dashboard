// ══════════════════════════════════════════════════════════════════════════════
// MonitoringDashboard.jsx
// Main dashboard component for CEST 2.0 Monitoring System
// ══════════════════════════════════════════════════════════════════════════════

// ─── IMPORTS ──────────────────────────────────────────────────────────────────
import { useState } from "react";
import logo from "./assets/logo.png";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

import {
  IS, LS, projTitleStyle, thBase, tdBase, modalOverlay,
  noSpinnerCSS, appWrapper, toastStyle,
  sidebarWrapper, sidebarLogoSection, sidebarLogoInner, sidebarTagline,
  sidebarNav, navItem, navKpiBadge,
  sidebarLogoutSection, sidebarLogoutBtn,
  sidebarFooter, sidebarFooterTitle, sidebarFooterDivider,
  sidebarFooterCopyright, sidebarFooterTagline,
  topBar, topBarTitle, topBarRight, topBarStats, topBarIconBtn, notifDot,
  mainContentArea, pageContent,
  modalBox, modalTitleBar, modalTitleText, modalCloseBtn, modalBody,
  statusColor,
  detailCardWrap, detailCardLabel, detailCardValue,
  projectBanner, projectBannerTitle, projectBannerMeta, projectBannerBadges,
  btnPrimary, btnSecondary, btnBlueOutline, btnDangerOutline, btnDangerSolid,
  btnSmallBlue, btnSmallGreen, btnSmallDanger,
  settingsSectionTitle, settingsDangerBox,
  notifPanel, floatingPanelHeader, notifItem, notifIconWrap,
  settingsPanel, settingsPanelFooter,
  summaryGrid, summaryCard, summaryCardLabel,
  filterBarRow, chartGrid, chartCard, chartCardHeader,
  tablePanel, tablePanelHeader, tableFooterRow, groupTH, subTH,
  dataEntryGrid, dataEntryPanel, dataEntryPanelHeader, dataEntryItem,
  projectsPageHeader,
  kpiPageHeader, kpiOverviewCard, kpiMiniGrid, kpiMiniCard,
  kpiDetailCard, kpiIndicatorRow, kpiEmptyState,
} from "./styles";

import TrainingsPage from "./Trainingspage";

import {
  COMPONENTS, COMP_COLORS, PIE_COLORS, KPI_LIST, DEFAULT_SETTINGS,
  LS_KEYS, STATUS_OPTIONS, COMMUNITY_TYPES, COMMUNITY_COLORS,
  fmt, loadFromStorage, saveToStorage, openProjectAsPDF,
  INITIAL_PROJECTS, INITIAL_EQUIPMENT,
} from "./Utils";


// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
function usePersistedState(lsKey, fallback) {
  const [state, setState] = useState(() => loadFromStorage(lsKey, fallback));
  const setAndPersist = (updater) => {
    setState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(lsKey, next);
      return next;
    });
  };
  return [state, setAndPersist];
}


// ══════════════════════════════════════════════════════════════════════════════
// SMALL REUSABLE UI COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function TH({ ch, style }) {
  return <th style={{ ...thBase, ...style }}>{ch}</th>;
}

function TD({ children, style }) {
  return <td style={{ ...tdBase, ...style }}>{children}</td>;
}

function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={settingsSectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function SettingsToggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{desc}</div>}
      </div>
      <div
        onClick={onChange}
        style={{
          width: 42, height: 24, borderRadius: 12, cursor: "pointer",
          background: value ? "#1e40af" : "#d1d5db",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: value ? 21 : 3,
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

function NotifIcon({ type }) {
  return (
    <div style={notifIconWrap(type)}>
      {{ info: "ℹ️", warning: "⚠️", success: "✅" }[type] ?? "ℹ️"}
    </div>
  );
}

function Modal({ title, onClose, children, maxWidth = 640 }) {
  return (
    <div style={modalOverlay}>
      <div style={modalBox(maxWidth)}>
        <div style={modalTitleBar}>
          <h2 style={modalTitleText}>{title}</h2>
          <button onClick={onClose} style={modalCloseBtn}>✕</button>
        </div>
        <div style={modalBody}>{children}</div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, icon, valueStyle = {} }) {
  return (
    <div style={detailCardWrap}>
      <div style={detailCardLabel}>{icon} {label}</div>
      <div style={{ ...detailCardValue, ...valueStyle }}>{value}</div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// PROJECT DETAIL MODAL
// ══════════════════════════════════════════════════════════════════════════════
function ProjectDetailModal({ project, onClose, onEdit, onDelete }) {
  if (!project) return null;
  const p = project;
  const sc = statusColor(p.status);

  return (
    <Modal title="📋 Project Details" onClose={onClose} maxWidth={720}>
      <div>
        <div style={projectBanner}>
          <div style={projectBannerTitle}>{p.project}</div>
          <div style={projectBannerMeta}>{p.municipality} · {p.year}</div>
          <div style={projectBannerBadges}>
            <span style={{ background: sc.color, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>
              {p.status}
            </span>
            {p.components.map(c => (
              <span key={c} style={{ background: COMP_COLORS[c], color: "#fff", borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <DetailCard label="Community / Beneficiaries" value={p.community}    icon="👥" />
            <DetailCard label="Municipality / City"        value={p.municipality} icon="📍" />
            <DetailCard label="Year"                       value={p.year}         icon="📅" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <DetailCard label="Amount Funded"    value={fmt(p.amountFunded)}                              icon="💰" valueStyle={{ color: "#16a34a", fontWeight: 800, fontSize: 16 }} />
            <DetailCard label="Amount per Year"  value={p.amountPerYear ? fmt(p.amountPerYear) : "—"}    icon="📆" />
            <DetailCard label="Status"           value={p.status}                                         icon="📌" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4, borderTop: "1px solid #e5e7eb", marginTop: 4 }}>
          <button onClick={onClose}                   style={btnSecondary}>Close</button>
          <button onClick={() => openProjectAsPDF(p)} style={btnBlueOutline}>📄 View PDF</button>
          <button onClick={onEdit}                    style={btnBlueOutline}>✏️ Edit</button>
          <button onClick={onDelete}                  style={btnDangerOutline}>🗑️ Delete</button>
        </div>
      </div>
    </Modal>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// PROJECT FORM
// ══════════════════════════════════════════════════════════════════════════════
function ProjectForm({ initial, onSave, onCancel }) {
  const blank = {
    year: "", municipality: "", community: "", project: "",
    amountFunded: "", amountPerYear: "", components: [], communities: [],
    status: "Ongoing",
    beneficiaries: { male: "", female: "", ips: "", fourps: "", pwd: "", senior: "", total: "" },
    stakeholders:  { lgu: "", plgu: "", blgu: "", pnp: "", suc: "", othersLabel: "", others: "" },
  };

  const [f, setF] = useState(initial ? {
    ...blank, ...initial,
    amountFunded:  initial.amountFunded  || "",
    amountPerYear: initial.amountPerYear || "",
    communities:   initial.communities   || [],
    beneficiaries: { ...blank.beneficiaries, ...initial.beneficiaries },
    stakeholders:  { ...blank.stakeholders,  ...initial.stakeholders  },
  } : blank);

  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const toggleComp = c => set("components", f.components.includes(c) ? f.components.filter(x => x !== c) : [...f.components, c]);
  const toggleComm = c => set("communities", f.communities.includes(c) ? f.communities.filter(x => x !== c) : [...f.communities, c]);

  const submit = () => {
    const e = {};
    if (!f.community.trim())                      e.community    = "Required";
    if (!f.project.trim())                        e.project      = "Required";
    if (!f.amountFunded || isNaN(f.amountFunded)) e.amountFunded = "Enter a valid number";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({ ...f, amountFunded: Number(f.amountFunded), amountPerYear: Number(f.amountPerYear) || 0 });
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>Year *</label>
          <input type="number" value={f.year} onChange={e => set("year", e.target.value === "" ? "" : Number(e.target.value))} style={IS} />
        </div>
        <div>
          <label style={LS}>Municipality *</label>
          <input value={f.municipality} onChange={e => set("municipality", e.target.value)} style={IS} placeholder="Enter municipality" />
        </div>
      </div>

      {[["community", "Community / Beneficiaries *"], ["project", "Project Title *"]].map(([k, l]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={LS}>{l}</label>
          <input value={f[k]} onChange={e => set(k, e.target.value)} style={{ ...IS, borderColor: err[k] ? "#ef4444" : "#d1d5db" }} placeholder={`Enter ${l.replace(" *", "")}`} />
          {err[k] && <span style={{ color: "#ef4444", fontSize: 11 }}>{err[k]}</span>}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>Amount Funded (₱) *</label>
          <input type="number" value={f.amountFunded} onChange={e => set("amountFunded", e.target.value)} style={{ ...IS, borderColor: err.amountFunded ? "#ef4444" : "#d1d5db" }} placeholder="0" />
          {err.amountFunded && <span style={{ color: "#ef4444", fontSize: 11 }}>{err.amountFunded}</span>}
        </div>
        <div>
          <label style={LS}>Amount per Year (₱)</label>
          <input type="number" value={f.amountPerYear} onChange={e => set("amountPerYear", e.target.value)} style={IS} placeholder="0" />
        </div>
        <div>
          <label style={LS}>Status</label>
          <select value={f.status} onChange={e => set("status", e.target.value)} style={IS}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={LS}>CEST 2.0 Components</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {Object.entries(COMPONENTS).map(([k, v]) => (
            <button key={k} onClick={() => toggleComp(k)} title={v} style={{
              background: f.components.includes(k) ? COMP_COLORS[k] : "#f3f4f6",
              border: `1px solid ${f.components.includes(k) ? COMP_COLORS[k] : "#d1d5db"}`,
              color: f.components.includes(k) ? "#fff" : "#374151",
              borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{k.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={LS}>Community Types</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {Object.entries(COMMUNITY_TYPES).map(([k, v]) => (
            <button key={k} onClick={() => toggleComm(k)} style={{
              background: f.communities.includes(k) ? COMMUNITY_COLORS[k] : "#f3f4f6",
              border: `1px solid ${f.communities.includes(k) ? COMMUNITY_COLORS[k] : "#d1d5db"}`,
              color: f.communities.includes(k) ? "#fff" : "#374151",
              borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={LS}>No. of Beneficiaries</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div><label style={{ ...LS, color: "#6b7280" }}>Male</label><input type="number" value={f.beneficiaries.male} min="0" onChange={e => set("beneficiaries", { ...f.beneficiaries, male: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} /></div>
          <div><label style={{ ...LS, color: "#6b7280" }}>Female</label><input type="number" value={f.beneficiaries.female} min="0" onChange={e => set("beneficiaries", { ...f.beneficiaries, female: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} /></div>
          <div />
          <div><label style={{ ...LS, color: "#6b7280" }}>Total</label><input type="number" value={f.beneficiaries.total} min="0" onChange={e => set("beneficiaries", { ...f.beneficiaries, total: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[["ips","IP's"],["fourps","4P's"],["pwd","PWD"],["senior","Senior Citizen"]].map(([k, l]) => (
            <div key={k}><label style={{ ...LS, color: "#6b7280" }}>{l}</label><input type="number" value={f.beneficiaries[k]} min="0" onChange={e => set("beneficiaries", { ...f.beneficiaries, [k]: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} /></div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={LS}>Stakeholders</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[["lgu","LGU"],["plgu","PLGU"],["blgu","BLGU"],["pnp","PNP"],["suc","SUC"]].map(([k, l]) => (
            <div key={k}><label style={{ ...LS, color: "#6b7280" }}>{l}</label><input type="number" value={f.stakeholders[k]} min="0" onChange={e => set("stakeholders", { ...f.stakeholders, [k]: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} /></div>
          ))}
          <div>
            <label style={{ ...LS, color: "#6b7280" }}>Others (specify)</label>
            <input value={f.stakeholders.othersLabel || ""} onChange={e => set("stakeholders", { ...f.stakeholders, othersLabel: e.target.value })} style={{ ...IS, marginBottom: 4 }} placeholder="e.g. NGO" />
            <input type="number" value={f.stakeholders.others} min="0" onChange={e => set("stakeholders", { ...f.stakeholders, others: e.target.value === "" ? "" : Number(e.target.value) })} style={IS} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        <button onClick={submit}   style={btnPrimary}>💾 Save Project</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// EQUIPMENT FORM
// ══════════════════════════════════════════════════════════════════════════════
function EquipmentForm({ initial, onSave, onCancel }) {
  const blank = { year: "", municipality: "", community: "", equipment: "", units: 1, unitsPerYear: "", component: "sel" };
  const [f, setF] = useState(initial ? { ...initial, unitsPerYear: initial.unitsPerYear ?? "" } : blank);
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = () => {
    const e = {};
    if (!f.community.trim())                                e.community = "Required";
    if (!f.equipment.trim())                                e.equipment = "Required";
    if (!f.units || isNaN(f.units) || Number(f.units) < 1) e.units     = "Must be ≥ 1";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({ ...f, units: Number(f.units), unitsPerYear: f.unitsPerYear !== "" ? Number(f.unitsPerYear) : null });
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div><label style={LS}>Year *</label><input type="number" value={f.year} onChange={e => set("year", Number(e.target.value))} style={IS} /></div>
        <div><label style={LS}>Municipality *</label><input value={f.municipality} onChange={e => set("municipality", e.target.value)} style={IS} placeholder="Enter municipality" /></div>
      </div>

      {[["community","Community"],["equipment","Equipment / Technology"]].map(([k, l]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={LS}>{l} *</label>
          <input value={f[k]} onChange={e => set(k, e.target.value)} style={{ ...IS, borderColor: err[k] ? "#ef4444" : "#d1d5db" }} placeholder={`Enter ${l}`} />
          {err[k] && <span style={{ color: "#ef4444", fontSize: 11 }}>{err[k]}</span>}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>No. of Units *</label>
          <input type="number" value={f.units} min="1" onChange={e => set("units", e.target.value)} style={{ ...IS, borderColor: err.units ? "#ef4444" : "#d1d5db" }} />
          {err.units && <span style={{ color: "#ef4444", fontSize: 11 }}>{err.units}</span>}
        </div>
        <div><label style={LS}>Units per Year (optional)</label><input type="number" value={f.unitsPerYear} onChange={e => set("unitsPerYear", e.target.value)} style={IS} placeholder="—" /></div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={LS}>Component *</label>
        <select value={f.component} onChange={e => set("component", e.target.value)} style={IS}>
          {Object.entries(COMPONENTS).map(([k, v]) => <option key={k} value={k}>{k.toUpperCase()} — {v}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        <button onClick={submit}   style={btnPrimary}>💾 Save Equipment</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// CONFIRM DELETE
// ══════════════════════════════════════════════════════════════════════════════
function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
      <p style={{ color: "#111827", fontSize: 15, marginBottom: 8, fontWeight: 700 }}>Delete this record?</p>
      <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 28 }}>{label}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onCancel}  style={btnSecondary}>Cancel</button>
        <button onClick={onConfirm} style={btnDangerSolid}>Delete</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION PANEL
// ══════════════════════════════════════════════════════════════════════════════
function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDelete, onClose }) {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={notifPanel}>
      <div style={floatingPanelHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔔</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>Notifications</span>
          {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 800 }}>{unread}</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {unread > 0 && <button onClick={onMarkAllRead} style={{ background: "none", border: "none", color: "#1e40af", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Mark all read</button>}
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
      </div>

      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔕</div>
            <div style={{ fontSize: 13 }}>No notifications</div>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => onMarkRead(n.id)} style={notifItem(n.read)}>
            <NotifIcon type={n.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: n.read ? 600 : 800, color: "#111827" }}>{n.title}</span>
                <span style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>{n.message}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onDelete(n.id); }} style={{ background: "none", border: "none", color: "#d1d5db", fontSize: 14, cursor: "pointer", flexShrink: 0, alignSelf: "flex-start", padding: 0 }}>×</button>
          </div>
        ))}
      </div>

      {notifications.length > 0 && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <button onClick={onMarkAllRead} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 11, cursor: "pointer" }}>Clear all notifications</button>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL
// ══════════════════════════════════════════════════════════════════════════════
function SettingsPanel({ settings, onSave, onClose }) {
  const [s, setS] = useState({ ...settings });
  const toggle = k     => setS(p => ({ ...p, [k]: !p[k] }));
  const setVal = (k,v) => setS(p => ({ ...p, [k]: v }));

  return (
    <div style={settingsPanel}>
      <div style={floatingPanelHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚙️</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>Settings</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>

      <div style={{ padding: "18px 20px", maxHeight: 480, overflowY: "auto" }}>
        <SettingsSection title="User Profile">
          <div style={{ marginBottom: 12 }}><label style={LS}>Full Name</label><input value={s.name}  onChange={e => setVal("name",  e.target.value)} style={IS} /></div>
          <div style={{ marginBottom: 12 }}><label style={LS}>Email</label><input value={s.email} onChange={e => setVal("email", e.target.value)} style={IS} /></div>
          <div><label style={LS}>Role</label>
            <select value={s.role} onChange={e => setVal("role", e.target.value)} style={IS}>
              <option>Administrator</option><option>Data Encoder</option><option>Viewer</option><option>Project Manager</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Dashboard Display">
          <SettingsToggle label="Show Charts"               desc="Display bar and pie charts" value={s.showCharts}      onChange={() => toggle("showCharts")} />
          <SettingsToggle label="Show Equipment Table"                                         value={s.showEquipTable}  onChange={() => toggle("showEquipTable")} />
          <SettingsToggle label="Show Municipality Summary"                                    value={s.showMuniSummary} onChange={() => toggle("showMuniSummary")} />
          <div style={{ marginBottom: 12 }}>
            <label style={LS}>Default Year Filter</label>
            <select value={s.defaultYear} onChange={e => setVal("defaultYear", e.target.value)} style={IS}>
              <option value="All">All Years</option>
              {["2024","2023","2022","2021"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Notification Preferences">
          <SettingsToggle label="Project Updates"  value={s.notifProjects}  onChange={() => toggle("notifProjects")} />
          <SettingsToggle label="Equipment Updates" value={s.notifEquipment} onChange={() => toggle("notifEquipment")} />
          <SettingsToggle label="Budget Alerts"     value={s.notifBudget}    onChange={() => toggle("notifBudget")} />
          <SettingsToggle label="Report Generation" value={s.notifReports}   onChange={() => toggle("notifReports")} />
        </SettingsSection>

        <SettingsSection title="KPI Targets per Component">
          {KPI_LIST.map(k => (
            <div key={k.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, borderRadius: 6, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>{k.key.slice(0,2).toUpperCase()}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{k.title}</span>
              </div>
              <input type="number" min="0" value={s.targets?.[k.key] ?? k.target} onChange={e => setVal("targets", { ...s.targets, [k.key]: Number(e.target.value) })} style={{ ...IS, width: 60, padding: "5px 8px", textAlign: "center" }} />
            </div>
          ))}
        </SettingsSection>

        <SettingsSection title="Data Management">
          <SettingsToggle label="Auto-save Changes" value={s.autoSave}      onChange={() => toggle("autoSave")} />
          <SettingsToggle label="Confirm on Delete" value={s.confirmDelete} onChange={() => toggle("confirmDelete")} />
        </SettingsSection>

        <SettingsSection title="⚠️ Danger Zone">
          <div style={settingsDangerBox}>
            <div style={{ fontSize: 12, color: "#991b1b", fontWeight: 700, marginBottom: 6 }}>Clear All Saved Data</div>
            <div style={{ fontSize: 11, color: "#b91c1c", marginBottom: 10 }}>This will permanently delete all projects, equipment, notifications, and settings from this browser.</div>
            <button
              onClick={() => { if (window.confirm("Are you sure? This will delete ALL saved data and cannot be undone.")) { Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k)); window.location.reload(); } }}
              style={{ background: "#ef4444", border: "none", color: "#fff", borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >🗑️ Clear All Data</button>
          </div>
        </SettingsSection>
      </div>

      <div style={settingsPanelFooter}>
        <button onClick={onClose}                        style={btnSecondary}>Cancel</button>
        <button onClick={() => { onSave(s); onClose(); }} style={btnPrimary}>💾 Save Settings</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function MonitoringDashboard() {

  const [projects,      setProjects]      = usePersistedState(LS_KEYS.projects,      INITIAL_PROJECTS);
  const [equipment,     setEquipment]     = usePersistedState(LS_KEYS.equipment,      INITIAL_EQUIPMENT);
  const [notifications, setNotifications] = usePersistedState(LS_KEYS.notifications, []);
  const [settings,      setSettings]      = usePersistedState(LS_KEYS.settings,      DEFAULT_SETTINGS);

  const [activePage,      setActivePage]      = useState("dashboard");
  const [yearFilter,      setYearFilter]      = useState("All");
  const [statusFilter,    setStatusFilter]    = useState("All");
  const [search,          setSearch]          = useState("");
  const [categoryFilter,  setCategoryFilter]  = useState("All");
  const [modal,           setModal]           = useState(null);
  const [toast,           setToast]           = useState(null);
  const [showNotifs,      setShowNotifs]      = useState(false);
  const [showSettings,    setShowSettings]    = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const showToast = (msg, color = "#16a34a") => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500); };
  const addNotif  = (type, title, message) => setNotifications(ns => [{ id: Date.now(), type, read: false, time: "Just now", title, message }, ...ns]);

  const saveProject = data => {
    if (data.id) {
      setProjects(ps => ps.map(p => p.id === data.id ? data : p));
      if (selectedProject?.id === data.id) setSelectedProject(data);
      showToast("✓ Project updated");
      if (settings.notifProjects) addNotif("success", "Project Updated", `"${data.project.slice(0,40)}..." updated.`);
    } else {
      setProjects(ps => [...ps, { ...data, id: Math.max(0, ...ps.map(p => p.id)) + 1 }]);
      showToast("✓ Project added");
      if (settings.notifProjects) addNotif("info", "New Project Added", `"${data.project.slice(0,40)}..." added.`);
    }
    setModal(null);
  };

  const deleteProject = id => {
    const proj = projects.find(p => p.id === id);
    setProjects(ps => ps.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
    showToast("Project deleted", "#ef4444");
    if (settings.notifProjects) addNotif("warning", "Project Deleted", `"${proj?.project?.slice(0,40)}..." removed.`);
    setModal(null);
  };

  const saveEquipment = data => {
    if (data.id) { setEquipment(eq => eq.map(e => e.id === data.id ? data : e)); showToast("✓ Equipment updated"); }
    else         { setEquipment(eq => [...eq, { ...data, id: Math.max(0, ...eq.map(e => e.id)) + 1 }]); showToast("✓ Equipment added"); }
    setModal(null);
  };

  const deleteEquipment = id => { setEquipment(eqs => eqs.filter(e => e.id !== id)); showToast("Equipment deleted", "#ef4444"); setModal(null); };

  const markNotifRead = id => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead   = ()  => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const deleteNotif   = id => setNotifications(ns => ns.filter(n => n.id !== id));

  const handleSaveSettings = s => { setSettings(s); showToast("✓ Settings saved"); addNotif("success", "Settings Saved", "Preferences updated."); };

  const totalFunds  = projects.reduce((s, p) => s + Number(p.amountFunded), 0);
  const activeCount = projects.filter(p => p.status === "Ongoing").length;
  const doneCount   = projects.filter(p => p.status === "Finished").length;
  const uniqueComm  = new Set(projects.map(p => p.community)).size;
  const unreadCount = notifications.filter(n => !n.read).length;

  const years = ["All", ...Array.from(new Set(projects.map(p => Number(p.year)).filter(Boolean))).sort()];

  const filteredP = projects.filter(p => {
    const mSearch = !search || p.project.toLowerCase().includes(search.toLowerCase()) || p.community.toLowerCase().includes(search.toLowerCase()) || p.municipality.toLowerCase().includes(search.toLowerCase());
    const mCat    = categoryFilter === "All" || p.components.includes(categoryFilter);
    const mYear   = yearFilter     === "All" || String(p.year) === String(yearFilter);
    const mStatus = statusFilter   === "All" || p.status === statusFilter;
    return mSearch && mCat && mYear && mStatus;
  });

  const allMunicipalities = Array.from(new Set([...projects.map(p => p.municipality), ...equipment.map(e => e.municipality)])).filter(Boolean).sort();

  const barData   = allMunicipalities.map(m => ({ name: m, budget: projects.filter(p => p.municipality === m).reduce((s, p) => s + Number(p.amountFunded), 0) })).filter(d => d.budget > 0);
  const maxBudget = barData.reduce((m, d) => Math.max(m, d.budget), 0);
  const fmtChart  = v => maxBudget >= 1_000_000 ? `₱${(v/1_000_000).toFixed(1)}M` : `₱${(v/1_000).toFixed(0)}k`;

  const compCounts  = Object.entries(COMPONENTS).map(([k]) => ({ name: k.toUpperCase(), value: projects.filter(p => p.components.includes(k)).length })).filter(d => d.value > 0);
  const muniSummary = allMunicipalities.map(m => ({ name: m, count: projects.filter(p => p.municipality === m).length })).filter(m => m.count > 0);
  const kpiCounts   = KPI_LIST.reduce((acc, k) => { acc[k.key] = projects.filter(p => p.components.includes(k.key)).length; return acc; }, {});

  const COMP_KEYS  = ["sel","hn","hrd","drrm","bgcet","dg"];
  const COMM_KEYS  = Object.keys(COMMUNITY_TYPES);
  const BENEF_COLS = ["male","female","ips","fourps","pwd","senior","total"];
  const STAKE_COLS = ["lgu","plgu","blgu","pnp","suc","others"];

  const NAV_ITEMS = [
    { id: "dashboard",  icon: "🏠", label: "Dashboard"   },
    { id: "dataentry",  icon: "✏️", label: "Data Entry"  },
    { id: "projects",   icon: "📋", label: "Projects"    },
    { id: "trainings",  icon: "🎓", label: "Trainings"   },
    { id: "kpireports", icon: "📊", label: "KPI Reports" },
  ];

  const closeAll = () => { setShowNotifs(false); setShowSettings(false); };

  const handleDetailEdit   = () => { setModal({ type: "editProject",   data: selectedProject }); setSelectedProject(null); };
  const handleDetailDelete = () => {
    if (settings.confirmDelete) { setModal({ type: "deleteProject", data: selectedProject }); setSelectedProject(null); }
    else { deleteProject(selectedProject.id); setSelectedProject(null); }
  };

  const gradients = [
    ["#6366f1","#818cf8"],["#ec4899","#f472b6"],["#f59e0b","#fbbf24"],
    ["#10b981","#34d399"],["#3b82f6","#60a5fa"],["#ef4444","#f87171"],
    ["#8b5cf6","#a78bfa"],["#14b8a6","#2dd4bf"],
  ];

  return (
    <div style={appWrapper} onClick={e => { if (e.target.dataset.backdrop) closeAll(); }}>
      <style>{noSpinnerCSS}</style>

      {toast && <div style={toastStyle(toast.color)}>{toast.msg}</div>}

      {(showNotifs || showSettings) && (
        <div data-backdrop="true" style={{ position: "fixed", inset: 0, zIndex: 1999 }} onClick={closeAll} />
      )}

      {showNotifs   && <NotificationPanel notifications={notifications} onMarkRead={markNotifRead} onMarkAllRead={markAllRead} onDelete={deleteNotif} onClose={() => setShowNotifs(false)} />}
      {showSettings && <SettingsPanel settings={settings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />}

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onEdit={handleDetailEdit} onDelete={handleDetailDelete} />
      )}

      {/* ── SIDEBAR ── */}
      <div style={sidebarWrapper}>
        <div style={sidebarLogoSection}>
          <div style={sidebarLogoInner}>
            <img src={logo} alt="CEST Logo" style={{ width: 100, height: 100, borderRadius: 12, objectFit: "contain" }} />
            <div style={sidebarTagline}>Community Empowerment thru Science &amp; Technology</div>
          </div>
        </div>

        <nav style={sidebarNav}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => setActivePage(n.id)} style={navItem(activePage === n.id)}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
              {n.id === "kpireports" && <span style={navKpiBadge}>{Object.keys(COMPONENTS).length}</span>}
            </button>
          ))}
        </nav>

        <div style={sidebarLogoutSection}>
          <button style={sidebarLogoutBtn}><span>🚪</span> Logout</button>
        </div>

        <div style={sidebarFooter}>
          <div style={sidebarFooterTitle}>CEST 2.0</div>
          <div style={sidebarFooterDivider}>
            <div style={sidebarFooterCopyright}>© {new Date().getFullYear()} DOST</div>
            <div style={sidebarFooterTagline}>Community Empowerment<br />thru Science &amp; Technology</div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={mainContentArea}>

        {/* Top Bar */}
        <div style={topBar}>
          <h1 style={topBarTitle}>{NAV_ITEMS.find(n => n.id === activePage)?.label}</h1>
          <div style={topBarRight}>
            <span style={topBarStats}>{projects.length} Projects · {uniqueComm} Communities</span>
            <button onClick={e => { e.stopPropagation(); setShowSettings(false); setShowNotifs(v => !v); }} style={topBarIconBtn(showNotifs)}>
              🔔
              {unreadCount > 0 && <span style={notifDot}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            <button onClick={e => { e.stopPropagation(); setShowNotifs(false); setShowSettings(v => !v); }} style={topBarIconBtn(showSettings)}>
              ⚙️
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={pageContent}>


          {/* ══ DASHBOARD PAGE ══ */}
          {activePage === "dashboard" && (
            <div>
              {/* Summary Cards */}
              <div style={summaryGrid}>
                {[
                  { label: "Total Projects",        value: projects.length,                                  icon: "📊", bg: "linear-gradient(135deg,#1e40af,#3b82f6)" },
                  { label: "Communities",            value: uniqueComm,                                        icon: "👥", bg: "linear-gradient(135deg,#16a34a,#4ade80)" },
                  { label: "Total Amount Assisted",  value: fmt(totalFunds),                                   icon: "💰", bg: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
                  { label: "Status",                 value: `${activeCount} Ongoing / ${doneCount} Finished`, icon: "📈", bg: "linear-gradient(135deg,#d97706,#fbbf24)" },
                ].map(s => (
                  <div key={s.label} style={summaryCard(s.bg)}>
                    <div>
                      <div style={summaryCardLabel}>{s.label}</div>
                      <div style={{ fontSize: typeof s.value === "string" ? 15 : 28, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                    </div>
                    <div style={{ fontSize: 34, opacity: 0.85 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* Filter Bar */}
              <div style={filterBarRow}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project, community, municipality..." style={{ ...IS, flex: 1, minWidth: 240, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }} />
                <select value={yearFilter}     onChange={e => setYearFilter(e.target.value)}     style={{ ...IS, width: "auto", minWidth: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>{years.map(y => <option key={y}>{y}</option>)}</select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 180, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <option value="All">All Components</option>
                  {Object.entries(COMPONENTS).map(([k, v]) => <option key={k} value={k}>{k.toUpperCase()} – {v}</option>)}
                </select>
                <select value={statusFilter}   onChange={e => setStatusFilter(e.target.value)}   style={{ ...IS, width: "auto", minWidth: 130, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <option value="All">All Status</option>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Charts */}
              {settings.showCharts && !search && yearFilter === "All" && categoryFilter === "All" && statusFilter === "All" && (
                <div style={chartGrid}>
                  <div style={chartCard}>
                    <div style={chartCardHeader}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 14, color: "#111827", fontWeight: 800 }}>Budget by Municipality</h3>
                        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>Total funds allocated per area</p>
                      </div>
                      <div style={{ background: "#eff6ff", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#1e40af" }}>{barData.length} areas</div>
                    </div>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                        <defs>
                          {barData.map((_, i) => {
                            const [c1, c2] = gradients[i % gradients.length];
                            return <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} stopOpacity={1} /><stop offset="100%" stopColor={c2} stopOpacity={0.75} /></linearGradient>;
                          })}
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} angle={-40} textAnchor="end" interval={0} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} height={20} dx={-4} dy={8} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={fmtChart} tickLine={false} axisLine={false} width={30} />
                        <Tooltip formatter={v => [fmtChart(v), "Budget"]} contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontSize: 12 }} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                        <Bar dataKey="budget" radius={[6,6,0,0]} maxBarSize={52} label={{ position: "top", formatter: fmtChart, fontSize: 10, fill: "#6b7280", fontWeight: 700 }}>
                          {barData.map((_, i) => <Cell key={i} fill={`url(#barGrad${i})`} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={chartCard}>
                    <div style={chartCardHeader}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 14, color: "#111827", fontWeight: 800 }}>Projects by Component</h3>
                        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>Distribution across CEST 2.0 components</p>
                      </div>
                      <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#16a34a" }}>{projects.length} total</div>
                    </div>
                    {compCounts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <defs>
                            {compCounts.map((_, i) => {
                              const [c1, c2] = gradients[i % gradients.length];
                              return <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient>;
                            })}
                          </defs>
                          <Pie data={compCounts} cx="50%" cy="46%" outerRadius={100} innerRadius={48} dataKey="value" paddingAngle={3}
                            label={({ name, value, percent }) => `${name}: ${value} (${(percent*100).toFixed(0)}%)`}
                            labelLine={{ stroke: "#d1d5db", strokeWidth: 1 }} fontSize={11}
                          >
                            {compCounts.map((_, i) => <Cell key={i} fill={`url(#pieGrad${i})`} stroke="none" />)}
                          </Pie>
                          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                            formatter={(value, entry) => <span style={{ color: "#374151", fontWeight: 600 }}>{value} — {entry.payload.value} project{entry.payload.value !== 1 ? "s" : ""}</span>}
                          />
                          <Tooltip formatter={(value, name) => [`${value} project${value !== 1 ? "s" : ""}`, name]} contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, color: "#9ca3af", gap: 8 }}>
                        <span style={{ fontSize: 36 }}>📭</span>
                        <span style={{ fontSize: 13 }}>No component data yet</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Projects Table */}
              <div style={tablePanel}>
                <div style={tablePanelHeader}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: "#1e3a8a" }}>List of Projects</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{filteredP.length} entries · Total: {fmt(filteredP.reduce((s, p) => s + Number(p.amountFunded), 0))}</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="dashboard-projects-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>No.</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Year</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>Municipality / City</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>Community / Beneficiaries</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>List of Projects Funded 📄</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Amount Funded</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Amount / Year</th>
                        <th colSpan={COMP_KEYS.length}  style={groupTH("#1e3a8f")}>CEST 2.0 Components</th>
                        <th colSpan={COMM_KEYS.length}  style={groupTH("#0369a1")}>Community Types</th>
                        <th colSpan={7}                 style={groupTH("#166534")}>No. of Beneficiaries</th>
                        <th colSpan={STAKE_COLS.length} style={groupTH("#5b21b6")}>Stakeholders</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Status</th>
                      </tr>
                      <tr>
                        {[["SEL","#1e3a8f"],["H&N","#166534"],["HRD","#5b21b6"],["DRRM","#991b1b"],["BGCET","#064e3b"],["DG","#92400e"]].map(([lbl, bg]) => (
                          <th key={lbl} rowSpan={2} style={{ ...subTH(bg), verticalAlign: "middle" }}>{lbl}</th>
                        ))}
                        {Object.entries(COMMUNITY_TYPES).map(([k, v]) => (
                          <th key={k} rowSpan={2} style={{ ...subTH("#0369a1"), verticalAlign: "middle" }}>{v}</th>
                        ))}
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle" }}>Male</th>
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle" }}>Female</th>
                        <th colSpan={4} style={{ ...subTH("#166534"), background: "#1e4d2a", borderBottom: "2px solid #15803d" }} />
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle", fontWeight: 900 }}>Total</th>
                        {["LGU","PLGU","BLGU","PNP","SUC","Others"].map(lbl => (
                          <th key={lbl} rowSpan={2} style={{ ...subTH("#5b21b6"), verticalAlign: "middle" }}>{lbl}</th>
                        ))}
                      </tr>
                      <tr>
                        <th style={subTH("#15803d")}>IP's</th>
                        <th style={subTH("#15803d")}>4P's</th>
                        <th style={subTH("#15803d")}>PWD</th>
                        <th style={subTH("#15803d")}>Senior Citizen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredP.map((p, i) => {
                        const sc = statusColor(p.status);
                        return (
                          <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                            <TD style={{ color: "#9ca3af", textAlign: "center" }}>{p.id}</TD>
                            <TD style={{ fontWeight: 700, color: "#1e40af", textAlign: "center" }}>{p.year}</TD>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{p.municipality}</TD>
                            <TD>{p.community}</TD>
                            <TD style={{ maxWidth: 200 }}>
                              <div style={{ ...projTitleStyle, maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }} onClick={() => openProjectAsPDF(p)}
                                onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}>
                                📄 {p.project}
                              </div>
                            </TD>
                            <TD style={{ color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap", textAlign: "right" }}>{fmt(p.amountFunded)}</TD>
                            <TD style={{ whiteSpace: "nowrap", textAlign: "right" }}>{fmt(p.amountPerYear)}</TD>
                            {COMP_KEYS.map(c => <TD key={c} style={{ textAlign: "center" }}>{p.components.includes(c) ? <span style={{ color: COMP_COLORS[c], fontWeight: 900, fontSize: 14 }}>✓</span> : ""}</TD>)}
                            {COMM_KEYS.map(c => <TD key={c} style={{ textAlign: "center" }}>{(p.communities||[]).includes(c) ? <span style={{ color: COMMUNITY_COLORS[c], fontWeight: 900, fontSize: 14 }}>✓</span> : ""}</TD>)}
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.male   || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.female || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.ips    || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.fourps || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.pwd    || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.senior || ""}</TD>
                            <TD style={{ textAlign: "center", fontWeight: 700 }}>{p.beneficiaries?.total || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.lgu  || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.plgu || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.blgu || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.pnp  || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.suc  || ""}</TD>
                            <TD style={{ textAlign: "center", maxWidth: 80 }}>
                              {p.stakeholders?.others ? <span title={p.stakeholders?.othersLabel || ""}>{p.stakeholders.others}{p.stakeholders?.othersLabel ? ` (${p.stakeholders.othersLabel})` : ""}</span> : ""}
                            </TD>
                            <TD><span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{p.status}</span></TD>
                          </tr>
                        );
                      })}
                      {!filteredP.length && (
                        <tr><td colSpan={7 + COMP_KEYS.length + COMM_KEYS.length + BENEF_COLS.length + STAKE_COLS.length + 1} style={{ padding: 28, textAlign: "center", color: "#9ca3af" }}>No results found.</td></tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr style={tableFooterRow}>
                        <td colSpan={5} style={{ padding: "8px 10px", fontSize: 12 }}>Total No. of Funded Projects: {filteredP.length}</td>
                        <td style={{ padding: "8px 10px", fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>{fmt(filteredP.reduce((s, p) => s + Number(p.amountFunded), 0))}</td>
                        <td style={{ padding: "8px 10px", fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>{fmt(filteredP.reduce((s, p) => s + Number(p.amountPerYear), 0))}</td>
                        {COMP_KEYS.map(c  => <td key={c}  style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>{filteredP.filter(p => p.components.includes(c)).length || ""}</td>)}
                        {COMM_KEYS.map(c  => <td key={c}  style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>{filteredP.filter(p => (p.communities||[]).includes(c)).length || ""}</td>)}
                        <td colSpan={BENEF_COLS.length + STAKE_COLS.length + 1} style={{ padding: "8px 10px" }} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Equipment Table */}
              {settings.showEquipTable && (
                <div style={tablePanel}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff", fontWeight: 800, fontSize: 13, color: "#166534" }}>
                    List of Equipment / Technologies Deployed
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <TH ch="Year" /><TH ch="Municipality/City" /><TH ch="Community/Beneficiaries" />
                          <TH ch="List of Equipment/Technologies Deployed" /><TH ch="No. of Units" /><TH ch="No. of Units per year" /><TH ch="Component" />
                        </tr>
                      </thead>
                      <tbody>
                        {equipment.map((e, i) => (
                          <tr key={e.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                            <TD style={{ fontWeight: 700, color: "#1e40af" }}>{e.year}</TD>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{e.municipality}</TD>
                            <TD>{e.community}</TD>
                            <TD>{e.equipment}</TD>
                            <TD style={{ textAlign: "center" }}>{e.units}</TD>
                            <TD style={{ textAlign: "center" }}>{e.unitsPerYear ?? "—"}</TD>
                            <TD><span style={{ background: COMP_COLORS[e.component]+"22", color: COMP_COLORS[e.component], borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{e.component}</span></TD>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={tableFooterRow}>
                          <td colSpan={4} style={{ padding: "8px 10px", fontSize: 12 }}>Total No. of Units</td>
                          <td style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>{equipment.reduce((s, e) => s + Number(e.units), 0)}</td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Municipality Summary */}
              {settings.showMuniSummary && (
                <div style={tablePanel}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff", fontWeight: 800, fontSize: 13, color: "#1e3a8a" }}>
                    Number of Projects Funded in the Province
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr><TH ch="Place" /><TH ch="No. of Projects" /></tr></thead>
                      <tbody>
                        {muniSummary.map((m, i) => (
                          <tr key={m.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{m.name}</TD>
                            <TD style={{ textAlign: "center", fontWeight: 700 }}>{m.count}</TD>
                          </tr>
                        ))}
                        <tr style={tableFooterRow}>
                          <td style={{ padding: "8px 10px", fontSize: 12 }}>Total</td>
                          <td style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>{projects.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ══ DATA ENTRY PAGE ══ */}
          {activePage === "dataentry" && (
            <div>
              <div style={dataEntryGrid}>
                {/* Projects panel */}
                <div style={dataEntryPanel}>
                  <div style={dataEntryPanelHeader}>
                    <h3 style={{ margin: 0, fontSize: 14, color: "#1e40af", fontWeight: 800 }}>📋 Projects ({projects.length})</h3>
                    <button onClick={() => setModal({ type: "addProject" })} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>＋ Add</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: "60vh", overflowY: "auto" }}>
                    {projects.map(p => {
                      const sc = statusColor(p.status);
                      return (
                        <div key={p.id} style={dataEntryItem}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ ...projTitleStyle, marginBottom: 3, whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }} onClick={() => openProjectAsPDF(p)}
                              onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}>
                              📄 {p.project}
                            </div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{p.municipality} · {p.year} · {fmt(p.amountFunded)}</div>
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                              {p.components.map(c => <span key={c} style={{ background: COMP_COLORS[c], color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{c}</span>)}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button onClick={() => setModal({ type: "editProject",   data: p })} style={btnSmallBlue}>Edit</button>
                            <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteProject", data: p }) : deleteProject(p.id)} style={btnSmallDanger}>Del</button>
                          </div>
                        </div>
                      );
                    })}
                    {!projects.length && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No projects yet.</p>}
                  </div>
                </div>

                {/* Equipment panel */}
                <div style={dataEntryPanel}>
                  <div style={dataEntryPanelHeader}>
                    <h3 style={{ margin: 0, fontSize: 14, color: "#16a34a", fontWeight: 800 }}>⚙️ Equipment ({equipment.length})</h3>
                    <button onClick={() => setModal({ type: "addEquipment" })} style={{ background: "#16a34a", border: "none", color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>＋ Add</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: "60vh", overflowY: "auto" }}>
                    {equipment.map(e => (
                      <div key={e.id} style={dataEntryItem}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", whiteSpace: "normal", wordBreak: "break-word" }}>{e.equipment}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{e.municipality} · {e.year} · {e.units} unit{e.units !== 1 ? "s" : ""}</div>
                          <span style={{ background: COMP_COLORS[e.component]+"22", color: COMP_COLORS[e.component], borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", marginTop: 4, display: "inline-block" }}>{e.component}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => setModal({ type: "editEquipment",   data: e })} style={btnSmallGreen}>Edit</button>
                          <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteEquipment", data: e }) : deleteEquipment(e.id)} style={btnSmallDanger}>Del</button>
                        </div>
                      </div>
                    ))}
                    {!equipment.length && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No equipment yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ══ PROJECTS PAGE ══ */}
          {activePage === "projects" && (
            <div>
              <div style={projectsPageHeader}>
                <h2 style={{ margin: 0, fontSize: 15, color: "#111827", fontWeight: 800 }}>All Funded Projects</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <select value={yearFilter}   onChange={e => setYearFilter(e.target.value)}   style={{ ...IS, width: "auto" }}>{years.map(y => <option key={y}>{y}</option>)}</select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...IS, width: "auto" }}>
                    <option value="All">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setModal({ type: "addProject" })} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>＋ Add Project</button>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr>
                        <TH ch="#" /><TH ch="Year" /><TH ch="Municipality" /><TH ch="Community" />
                        <TH ch="Project 📄" /><TH ch="Amount Funded" /><TH ch="Amt/Year" />
                        <TH ch="Components" /><TH ch="Status" /><TH ch="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredP.map((p, i) => {
                        const sc = statusColor(p.status);
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <TD style={{ color: "#9ca3af" }}>{p.id}</TD>
                            <TD style={{ fontWeight: 700 }}>{p.year}</TD>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{p.municipality}</TD>
                            <TD style={{ maxWidth: 130 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{p.community}</div></TD>
                            <TD style={{ maxWidth: 180 }}>
                              <div style={{ ...projTitleStyle, maxWidth: 180, whiteSpace: "normal", wordBreak: "break-word" }} onClick={() => openProjectAsPDF(p)}
                                onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}>
                                📄 {p.project}
                              </div>
                            </TD>
                            <TD style={{ color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(p.amountFunded)}</TD>
                            <TD style={{ whiteSpace: "nowrap" }}>{fmt(p.amountPerYear)}</TD>
                            <TD>
                              <div style={{ display: "flex", gap: 3 }}>
                                {p.components.map(c => <span key={c} style={{ background: COMP_COLORS[c], color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{c}</span>)}
                                {!p.components.length && <span style={{ color: "#9ca3af" }}>—</span>}
                              </div>
                            </TD>
                            <TD><span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{p.status}</span></TD>
                            <TD>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => setModal({ type: "editProject",   data: p })} style={btnSmallBlue}>Edit</button>
                                <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteProject", data: p }) : deleteProject(p.id)} style={btnSmallDanger}>Del</button>
                              </div>
                            </TD>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ══ TRAININGS PAGE ══ */}
          {activePage === "trainings" && <TrainingsPage />}


          {/* ══ KPI REPORTS PAGE ══ */}
          {activePage === "kpireports" && (
            <div>
              <div style={kpiPageHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 900 }}>Key Performance Indicators</h2>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>Performance tracking per CEST 2.0 Component · {projects.length} total projects</p>
                </div>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 110 }}>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* KPI Overview */}
              <div style={kpiOverviewCard}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#1e3a8a", marginBottom: 16 }}>📈 Overall KPI Achievement Overview</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {KPI_LIST.map(k => {
                    const actual = kpiCounts[k.key];
                    const target = settings.targets?.[k.key] ?? k.target;
                    const pct    = target > 0 ? Math.min(Math.round((actual/target)*100), 100) : 0;
                    const color  = pct >= 100 ? "#16a34a" : pct >= 60 ? "#d97706" : "#ef4444";
                    return (
                      <div key={k.key} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 200, flexShrink: 0 }}>
                          <span style={{ width: 26, height: 26, borderRadius: 6, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, flexShrink: 0 }}>{k.key.slice(0,2).toUpperCase()}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.title}</span>
                        </div>
                        <div style={{ flex: 1, height: 14, background: "#f3f4f6", borderRadius: 7, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${k.color},${k.color}cc)`, borderRadius: 7, transition: "width 0.3s" }} />
                        </div>
                        <div style={{ width: 90, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color }}>{actual}/{target}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color, background: color+"18", borderRadius: 20, padding: "1px 8px" }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPI Mini Cards */}
              <div style={kpiMiniGrid}>
                {KPI_LIST.map(k => {
                  const actual = kpiCounts[k.key];
                  const target = settings.targets?.[k.key] ?? k.target;
                  const pct    = target > 0 ? Math.min(Math.round((actual/target)*100), 100) : 0;
                  return (
                    <div key={k.key} style={kpiMiniCard(k.color)}>
                      <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{actual}</div>
                      <div style={{ fontSize: 8, opacity: 0.8, margin: "2px 0", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>of {target} target</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginTop: 8 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#fff", borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 9, opacity: 0.9, marginTop: 5, fontWeight: 700 }}>{k.key.toUpperCase()} · {pct}%</div>
                    </div>
                  );
                })}
              </div>

              {/* KPI Detail Cards */}
              <div style={{ display: "grid", gap: 14 }}>
                {KPI_LIST.map(k => {
                  const relProjects  = (yearFilter === "All" ? projects : projects.filter(p => p.year === Number(yearFilter))).filter(p => p.components.includes(k.key));
                  const relEquipment = equipment.filter(e => e.component === k.key);
                  const totalFundsK  = relProjects.reduce((s, p) => s + Number(p.amountFunded), 0);
                  const actual       = relProjects.length;
                  const target       = settings.targets?.[k.key] ?? k.target;
                  const pct          = target > 0 ? Math.min(Math.round((actual/target)*100), 100) : 0;
                  const statusColor2 = pct >= 100 ? "#16a34a" : pct >= 60 ? "#d97706" : "#ef4444";
                  const statusLabel  = pct >= 100 ? "✅ Target Met" : pct >= 60 ? "⚡ On Track" : "⚠️ Below Target";

                  return (
                    <div key={k.id} style={kpiDetailCard(k.color)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{ background: k.color, color: "#fff", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{k.id}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{k.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}><strong style={{ color: k.color }}>{k.key.toUpperCase()}</strong> · {COMPONENTS[k.key]}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Progress</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 80, height: 8, background: "#f3f4f6", borderRadius: 4 }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: k.color, borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 900, color: statusColor2 }}>{pct}%</span>
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: statusColor2, marginTop: 2, display: "block" }}>{statusLabel}</span>
                          </div>
                          {[
                            { val: `${actual}/${target}`, label: "Projects",  bg: k.color+"15", col: k.color   },
                            { val: relEquipment.length,   label: "Equipment", bg: "#f3f4f6",    col: "#374151" },
                            { val: fmt(totalFundsK),      label: "Funded",    bg: "#f0fdf4",    col: "#16a34a" },
                          ].map(st => (
                            <div key={st.label} style={{ background: st.bg, borderRadius: 8, padding: "6px 14px", textAlign: "center", minWidth: 75 }}>
                              <div style={{ fontSize: 14, fontWeight: 900, color: st.col }}>{st.val}</div>
                              <div style={{ fontSize: 9, color: "#6b7280" }}>{st.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: "12px 20px" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Performance Indicators</div>
                        {k.indicators.map((ind, i) => (
                          <div key={i} style={kpiIndicatorRow}>
                            <span style={{ color: k.color, flexShrink: 0, fontWeight: 900, fontSize: 13 }}>▶</span>
                            <span style={{ fontSize: 12, color: "#374151", flex: 1, lineHeight: 1.5 }}>{ind}</span>
                            <div style={{ flexShrink: 0, textAlign: "center" }}>
                              <span style={{ background: k.color+"18", color: k.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 900, display: "block" }}>{actual} / {target}</span>
                              <span style={{ fontSize: 10, color: "#6b7280", marginTop: 2, display: "block" }}>Actual / Target</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {relProjects.length > 0 && (
                        <div style={{ padding: "0 20px 16px" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Projects Under This Component</div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, background: "#f9fafb", borderRadius: 7, overflow: "hidden" }}>
                            <thead>
                              <tr style={{ background: k.color+"20", color: k.color }}>
                                {["Year","Municipality","Project","Amount","Beneficiaries","Status"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, fontSize: 11 }}>{h}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {relProjects.map(p => {
                                const sc = statusColor(p.status);
                                return (
                                  <tr key={p.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                                    <td style={{ padding: "7px 10px", fontWeight: 700 }}>{p.year}</td>
                                    <td style={{ padding: "7px 10px", color: "#1e40af", fontWeight: 600 }}>{p.municipality}</td>
                                    <td style={{ padding: "7px 10px", maxWidth: 200 }}>
                                      <div style={{ ...projTitleStyle, maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }} onClick={() => openProjectAsPDF(p)}
                                        onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}>
                                        📄 {p.project}
                                      </div>
                                    </td>
                                    <td style={{ padding: "7px 10px", color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(p.amountFunded)}</td>
                                    <td style={{ padding: "7px 10px", textAlign: "center" }}>{p.beneficiaries?.total || "—"}</td>
                                    <td style={{ padding: "7px 10px" }}><span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{p.status}</span></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr style={{ background: k.color+"15", borderTop: `2px solid ${k.color}30` }}>
                                <td colSpan={3} style={{ padding: "7px 10px", fontSize: 11, fontWeight: 800, color: k.color }}>Component Total</td>
                                <td style={{ padding: "7px 10px", fontSize: 11, fontWeight: 800, color: "#16a34a" }}>{fmt(totalFundsK)}</td>
                                <td style={{ padding: "7px 10px", textAlign: "center", fontSize: 11, fontWeight: 800, color: k.color }}>{relProjects.reduce((s, p) => s + Number(p.beneficiaries?.total||0), 0) || "—"}</td>
                                <td style={{ padding: "7px 10px", fontSize: 11, color: "#6b7280" }}>{relProjects.filter(p => p.status === "Ongoing").length} Ongoing</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}

                      {relProjects.length === 0 && (
                        <div style={kpiEmptyState}>
                          <span style={{ fontSize: 20 }}>📭</span>
                          <span style={{ fontSize: 12, fontStyle: "italic" }}>No projects assigned to this component{yearFilter !== "All" ? ` for ${yearFilter}` : ""} yet.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODALS ── */}
      {modal?.type === "addProject"      && <Modal title="➕ Add New Project" onClose={() => setModal(null)}><ProjectForm onSave={saveProject} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "editProject"     && <Modal title="✏️ Edit Project"    onClose={() => setModal(null)}><ProjectForm initial={modal.data} onSave={saveProject} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "deleteProject"   && <Modal title="Delete Project"     onClose={() => setModal(null)}><ConfirmDelete label={modal.data.project} onConfirm={() => deleteProject(modal.data.id)} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "addEquipment"    && <Modal title="➕ Add Equipment"   onClose={() => setModal(null)}><EquipmentForm onSave={saveEquipment} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "editEquipment"   && <Modal title="✏️ Edit Equipment"  onClose={() => setModal(null)}><EquipmentForm initial={modal.data} onSave={saveEquipment} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "deleteEquipment" && <Modal title="Delete Equipment"   onClose={() => setModal(null)}><ConfirmDelete label={modal.data.equipment} onConfirm={() => deleteEquipment(modal.data.id)} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}