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

// Styles — edit ./styles.js to change colors, fonts, input/table look
import { IS, LS, projTitleStyle, thBase, tdBase, modalOverlay } from "./styles";

// Trainings page — edit ./Trainingspage.jsx to change the Trainings section
import TrainingsPage from "./Trainingspage";

// Utilities & constants — edit ./Utils.js to change components, KPIs, statuses, etc.
import {
  COMPONENTS,       // CEST 2.0 component keys + full names
  COMP_COLORS,      // Color per component
  PIE_COLORS,       // Colors for the pie chart slices
  KPI_LIST,         // KPI definitions per component
  DEFAULT_SETTINGS, // Default values for settings
  LS_KEYS,          // localStorage key names
  STATUS_OPTIONS,   // Project status options (Ongoing, Finished, Liquidated)
  COMMUNITY_TYPES,  // Community type keys and labels
  COMMUNITY_COLORS, // Color per community type
  fmt,              // Currency formatter — returns ₱ string
  loadFromStorage,  // Loads data from localStorage
  saveToStorage,    // Saves data to localStorage
  openProjectAsPDF, // Opens a project profile as a PDF
} from "./Utils";


// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
// Removes number input up/down spin arrows
// Also adds extra cell padding to the dashboard projects table
// ✏️ Edit the padding values below to change table row height
const noSpinnerStyle = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  .dashboard-projects-table th { padding: 10px 14px !important; }
  .dashboard-projects-table td { padding: 10px 14px !important; }
`;


// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
// Keeps state in sync with localStorage so data survives page refresh
// Used by: projects, equipment, notifications, settings
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

// ─── Table Header Cell ────────────────────────────────────────────────────────
function TH({ ch, style }) {
  return (
    <th style={{ ...thBase, ...style }}>
      {ch}
    </th>
  );
}

// ─── Table Data Cell ──────────────────────────────────────────────────────────
function TD({ children, style }) {
  return (
    <td style={{ ...tdBase, ...style }}>
      {children}
    </td>
  );
}

// ─── Settings Section Wrapper ─────────────────────────────────────────────────
// Groups settings fields under a labeled divider
function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 800,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: "1px solid #f3f4f6",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Settings Toggle Switch ───────────────────────────────────────────────────
// Blue pill toggle for boolean settings
function SettingsToggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{label}</div>
        {desc && (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{desc}</div>
        )}
      </div>
      {/* Toggle pill — click to flip true/false */}
      <div
        onClick={onChange}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          cursor: "pointer",
          background: value ? "#1e40af" : "#d1d5db",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: value ? 21 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

// ─── Notification Type Icon ───────────────────────────────────────────────────
// Shows a colored icon based on notification type: info | warning | success
function NotifIcon({ type }) {
  const map = {
    info:    { icon: "ℹ️", bg: "#eff6ff", border: "#bfdbfe" },
    warning: { icon: "⚠️", bg: "#fffbeb", border: "#fde68a" },
    success: { icon: "✅", bg: "#f0fdf4", border: "#bbf7d0" },
  };
  const s = map[type] || map.info;

  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: 8,
      background: s.bg,
      border: `1px solid ${s.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      flexShrink: 0,
    }}>
      {s.icon}
    </div>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
// Centered popup used for Add/Edit/Delete forms and project details
// ✏️ Change maxWidth default to make all modals wider/narrower
function Modal({ title, onClose, children, maxWidth = 640 }) {
  return (
    <div style={modalOverlay}>
      <div style={{
        background: "#fff",
        borderRadius: 14,
        width: "100%",
        maxWidth,
        maxHeight: "92vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Modal title bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a8a" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
        {/* Modal content */}
        <div style={{ padding: "18px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Card ──────────────────────────────────────────────────────────────
// Small info card used inside the Project Details modal
function DetailCard({ label, value, icon, valueStyle = {} }) {
  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", ...valueStyle }}>
        {value}
      </div>
    </div>
  );
}

// ─── Status Badge Colors ──────────────────────────────────────────────────────
// Returns bg and text color for a project status badge
// ✏️ Edit the colors here to change status badge appearance
function statusColor(status) {
  if (status === "Ongoing")    return { bg: "#dcfce7", color: "#16a34a" }; // green
  if (status === "Liquidated") return { bg: "#fef9c3", color: "#b45309" }; // yellow
  return { bg: "#e0e7ff", color: "#4338ca" };                              // blue = Finished
}


// ══════════════════════════════════════════════════════════════════════════════
// PROJECT DETAIL MODAL
// Full view of a single project — shown when clicking a project title
// ✏️ Add more DetailCard rows here to show extra project fields
// ══════════════════════════════════════════════════════════════════════════════
function ProjectDetailModal({ project, onClose, onEdit, onDelete }) {
  if (!project) return null;
  const p = project;
  const sc = statusColor(p.status);

  return (
    <Modal title="📋 Project Details" onClose={onClose} maxWidth={720}>
      <div>

        {/* Gradient banner with project title */}
        <div style={{
          background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 18,
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.4 }}>
            {p.project}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>
            {p.municipality} · {p.year}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
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

        {/* Info cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <DetailCard label="Community / Beneficiaries" value={p.community}    icon="👥" />
            <DetailCard label="Municipality / City"        value={p.municipality} icon="📍" />
            <DetailCard label="Year"                       value={p.year}         icon="📅" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <DetailCard
              label="Amount Funded"
              value={fmt(p.amountFunded)}
              icon="💰"
              valueStyle={{ color: "#16a34a", fontWeight: 800, fontSize: 16 }}
            />
            <DetailCard label="Amount per Year" value={p.amountPerYear ? fmt(p.amountPerYear) : "—"} icon="📆" />
            <DetailCard label="Status"          value={p.status}                                      icon="📌" />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4, borderTop: "1px solid #e5e7eb", marginTop: 4 }}>
          <button onClick={onClose}                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Close</button>
          <button onClick={() => openProjectAsPDF(p)}  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>📄 View PDF</button>
          <button onClick={onEdit}                     style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✏️ Edit</button>
          <button onClick={onDelete}                   style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>🗑️ Delete</button>
        </div>

      </div>
    </Modal>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// PROJECT FORM
// Used for both Add New Project and Edit Project modals
// ✏️ Add new fields to `blank` and render them below to capture more data
// ══════════════════════════════════════════════════════════════════════════════
function ProjectForm({ initial, onSave, onCancel }) {

  // Default empty values — add new fields here if needed
  const blank = {
    year:          "",
    municipality:  "",
    community:     "",
    project:       "",
    amountFunded:  "",
    amountPerYear: "",
    components:    [],  // CEST 2.0 component chips (multi-select)
    communities:   [],  // Community type chips (multi-select)
    status:        "Ongoing",
    beneficiaries: { male: "", female: "", ips: "", fourps: "", pwd: "", senior: "", total: "" },
    stakeholders:  { lgu: "", plgu: "", blgu: "", pnp: "", suc: "", othersLabel: "", others: "" },
  };

  // When editing, fill form with existing data; otherwise use blank
  const [f, setF] = useState(initial ? {
    ...blank,
    ...initial,
    amountFunded:  initial.amountFunded  || "",
    amountPerYear: initial.amountPerYear || "",
    communities:   initial.communities   || [],
    beneficiaries: { ...blank.beneficiaries, ...initial.beneficiaries },
    stakeholders:  { ...blank.stakeholders,  ...initial.stakeholders  },
  } : blank);

  const [err, setErr] = useState({});

  // Shorthand state setter
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  // Toggle a CEST 2.0 component chip on/off
  const toggleComp = c => set(
    "components",
    f.components.includes(c)
      ? f.components.filter(x => x !== c)
      : [...f.components, c]
  );

  // Toggle a community type chip on/off
  const toggleComm = c => set(
    "communities",
    f.communities.includes(c)
      ? f.communities.filter(x => x !== c)
      : [...f.communities, c]
  );

  // Validate required fields, then call onSave
  const submit = () => {
    const e = {};
    if (!f.community.trim())                      e.community    = "Required";
    if (!f.project.trim())                        e.project      = "Required";
    if (!f.amountFunded || isNaN(f.amountFunded)) e.amountFunded = "Enter a valid number";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({
      ...f,
      amountFunded:  Number(f.amountFunded),
      amountPerYear: Number(f.amountPerYear) || 0,
    });
  };

  return (
    <div>

      {/* ── Year & Municipality ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>Year *</label>
          <input
            type="number"
            value={f.year}
            onChange={e => set("year", e.target.value === "" ? "" : Number(e.target.value))}
            style={IS}
          />
        </div>
        <div>
          <label style={LS}>Municipality *</label>
          <input
            value={f.municipality}
            onChange={e => set("municipality", e.target.value)}
            style={IS}
            placeholder="Enter municipality"
          />
        </div>
      </div>

      {/* ── Community & Project Title ── */}
      {[
        ["community", "Community / Beneficiaries *"],
        ["project",   "Project Title *"],
      ].map(([k, l]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={LS}>{l}</label>
          <input
            value={f[k]}
            onChange={e => set(k, e.target.value)}
            style={{ ...IS, borderColor: err[k] ? "#ef4444" : "#d1d5db" }}
            placeholder={`Enter ${l.replace(" *", "")}`}
          />
          {err[k] && <span style={{ color: "#ef4444", fontSize: 11 }}>{err[k]}</span>}
        </div>
      ))}

      {/* ── Amount Funded / Amount per Year / Status ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>Amount Funded (₱) *</label>
          <input
            type="number"
            value={f.amountFunded}
            onChange={e => set("amountFunded", e.target.value)}
            style={{ ...IS, borderColor: err.amountFunded ? "#ef4444" : "#d1d5db" }}
            placeholder="0"
          />
          {err.amountFunded && <span style={{ color: "#ef4444", fontSize: 11 }}>{err.amountFunded}</span>}
        </div>
        <div>
          <label style={LS}>Amount per Year (₱)</label>
          <input
            type="number"
            value={f.amountPerYear}
            onChange={e => set("amountPerYear", e.target.value)}
            style={IS}
            placeholder="0"
          />
        </div>
        <div>
          <label style={LS}>Status</label>
          {/* ✏️ Edit STATUS_OPTIONS in Utils.js to add/remove status choices */}
          <select value={f.status} onChange={e => set("status", e.target.value)} style={IS}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── CEST 2.0 Components (multi-select chips) ── */}
      {/* ✏️ Edit COMPONENTS in Utils.js to add/remove component options */}
      <div style={{ marginBottom: 14 }}>
        <label style={LS}>CEST 2.0 Components</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {Object.entries(COMPONENTS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => toggleComp(k)}
              title={v}
              style={{
                background:   f.components.includes(k) ? COMP_COLORS[k] : "#f3f4f6",
                border:       `1px solid ${f.components.includes(k) ? COMP_COLORS[k] : "#d1d5db"}`,
                color:        f.components.includes(k) ? "#fff" : "#374151",
                borderRadius: 6,
                padding:      "5px 12px",
                fontSize:     11,
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Community Types (multi-select chips) ── */}
      {/* ✏️ Edit COMMUNITY_TYPES in Utils.js to add/remove community types */}
      <div style={{ marginBottom: 14 }}>
        <label style={LS}>Community Types</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {Object.entries(COMMUNITY_TYPES).map(([k, v]) => (
            <button
              key={k}
              onClick={() => toggleComm(k)}
              style={{
                background:   f.communities.includes(k) ? COMMUNITY_COLORS[k] : "#f3f4f6",
                border:       `1px solid ${f.communities.includes(k) ? COMMUNITY_COLORS[k] : "#d1d5db"}`,
                color:        f.communities.includes(k) ? "#fff" : "#374151",
                borderRadius: 6,
                padding:      "5px 12px",
                fontSize:     11,
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── No. of Beneficiaries ── */}
      {/* Row 1: Male | Female | (spacer) | Total */}
      {/* Row 2: IP's | 4P's | PWD | Senior Citizen */}
      <div style={{ marginBottom: 14 }}>
        <label style={LS}>No. of Beneficiaries</label>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div>
            <label style={{ ...LS, color: "#6b7280" }}>Male</label>
            <input type="number" value={f.beneficiaries.male} min="0"
              onChange={e => set("beneficiaries", { ...f.beneficiaries, male: e.target.value === "" ? "" : Number(e.target.value) })}
              style={IS}
            />
          </div>
          <div>
            <label style={{ ...LS, color: "#6b7280" }}>Female</label>
            <input type="number" value={f.beneficiaries.female} min="0"
              onChange={e => set("beneficiaries", { ...f.beneficiaries, female: e.target.value === "" ? "" : Number(e.target.value) })}
              style={IS}
            />
          </div>
          {/* Blank spacer so Total lines up to the right */}
          <div />
          <div>
            <label style={{ ...LS, color: "#6b7280" }}>Total</label>
            <input type="number" value={f.beneficiaries.total} min="0"
              onChange={e => set("beneficiaries", { ...f.beneficiaries, total: e.target.value === "" ? "" : Number(e.target.value) })}
              style={IS}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            ["ips",    "IP's"],
            ["fourps", "4P's"],
            ["pwd",    "PWD"],
            ["senior", "Senior Citizen"],
          ].map(([k, l]) => (
            <div key={k}>
              <label style={{ ...LS, color: "#6b7280" }}>{l}</label>
              <input type="number" value={f.beneficiaries[k]} min="0"
                onChange={e => set("beneficiaries", { ...f.beneficiaries, [k]: e.target.value === "" ? "" : Number(e.target.value) })}
                style={IS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Stakeholders ── */}
      {/* ✏️ Add more stakeholder fields here if needed */}
      <div style={{ marginBottom: 22 }}>
        <label style={LS}>Stakeholders</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            ["lgu",  "LGU"],
            ["plgu", "PLGU"],
            ["blgu", "BLGU"],
            ["pnp",  "PNP"],
            ["suc",  "SUC"],
          ].map(([k, l]) => (
            <div key={k}>
              <label style={{ ...LS, color: "#6b7280" }}>{l}</label>
              <input type="number" value={f.stakeholders[k]} min="0"
                onChange={e => set("stakeholders", { ...f.stakeholders, [k]: e.target.value === "" ? "" : Number(e.target.value) })}
                style={IS}
              />
            </div>
          ))}
          {/* Others — text label + count number */}
          <div>
            <label style={{ ...LS, color: "#6b7280" }}>Others (specify)</label>
            <input
              value={f.stakeholders.othersLabel || ""}
              onChange={e => set("stakeholders", { ...f.stakeholders, othersLabel: e.target.value })}
              style={{ ...IS, marginBottom: 4 }}
              placeholder="e.g. NGO"
            />
            <input type="number" value={f.stakeholders.others} min="0"
              onChange={e => set("stakeholders", { ...f.stakeholders, others: e.target.value === "" ? "" : Number(e.target.value) })}
              style={IS}
            />
          </div>
        </div>
      </div>

      {/* ── Form Buttons ── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Cancel
        </button>
        <button onClick={submit} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 8, padding: "10px 26px", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>
          💾 Save Project
        </button>
      </div>

    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// EQUIPMENT FORM
// Used for both Add New Equipment and Edit Equipment modals
// ✏️ Add new fields to `blank` and render them below to capture more data
// ══════════════════════════════════════════════════════════════════════════════
function EquipmentForm({ initial, onSave, onCancel }) {

  // Default empty values
  const blank = {
    year:         "",
    municipality: "",
    community:    "",
    equipment:    "",
    units:        1,
    unitsPerYear: "",
    component:    "sel", // ✏️ Change default component here
  };

  const [f, setF] = useState(
    initial ? { ...initial, unitsPerYear: initial.unitsPerYear ?? "" } : blank
  );
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  // Validate and save
  const submit = () => {
    const e = {};
    if (!f.community.trim())                           e.community = "Required";
    if (!f.equipment.trim())                           e.equipment = "Required";
    if (!f.units || isNaN(f.units) || Number(f.units) < 1) e.units = "Must be ≥ 1";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({
      ...f,
      units:        Number(f.units),
      unitsPerYear: f.unitsPerYear !== "" ? Number(f.unitsPerYear) : null,
    });
  };

  return (
    <div>

      {/* ── Year & Municipality ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>Year *</label>
          <input type="number" value={f.year} onChange={e => set("year", Number(e.target.value))} style={IS} />
        </div>
        <div>
          <label style={LS}>Municipality *</label>
          <input value={f.municipality} onChange={e => set("municipality", e.target.value)} style={IS} placeholder="Enter municipality" />
        </div>
      </div>

      {/* ── Community & Equipment Name ── */}
      {[
        ["community", "Community"],
        ["equipment", "Equipment / Technology"],
      ].map(([k, l]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={LS}>{l} *</label>
          <input
            value={f[k]}
            onChange={e => set(k, e.target.value)}
            style={{ ...IS, borderColor: err[k] ? "#ef4444" : "#d1d5db" }}
            placeholder={`Enter ${l}`}
          />
          {err[k] && <span style={{ color: "#ef4444", fontSize: 11 }}>{err[k]}</span>}
        </div>
      ))}

      {/* ── Units ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={LS}>No. of Units *</label>
          <input
            type="number"
            value={f.units}
            min="1"
            onChange={e => set("units", e.target.value)}
            style={{ ...IS, borderColor: err.units ? "#ef4444" : "#d1d5db" }}
          />
          {err.units && <span style={{ color: "#ef4444", fontSize: 11 }}>{err.units}</span>}
        </div>
        <div>
          <label style={LS}>Units per Year (optional)</label>
          <input type="number" value={f.unitsPerYear} onChange={e => set("unitsPerYear", e.target.value)} style={IS} placeholder="—" />
        </div>
      </div>

      {/* ── Component Selector ── */}
      {/* ✏️ Edit COMPONENTS in Utils.js to add/remove options here */}
      <div style={{ marginBottom: 22 }}>
        <label style={LS}>Component *</label>
        <select value={f.component} onChange={e => set("component", e.target.value)} style={IS}>
          {Object.entries(COMPONENTS).map(([k, v]) => (
            <option key={k} value={k}>{k.toUpperCase()} — {v}</option>
          ))}
        </select>
      </div>

      {/* ── Form Buttons ── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Cancel
        </button>
        <button onClick={submit} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 8, padding: "10px 26px", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>
          💾 Save Equipment
        </button>
      </div>

    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// CONFIRM DELETE DIALOG
// Shown before permanently deleting a project or equipment record
// ══════════════════════════════════════════════════════════════════════════════
function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
      <p style={{ color: "#111827", fontSize: 15, marginBottom: 8, fontWeight: 700 }}>Delete this record?</p>
      <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 28 }}>{label}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onCancel}  style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
        <button onClick={onConfirm} style={{ background: "#ef4444",  border: "none",              color: "#fff",     borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 800 }}>Delete</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION PANEL
// Dropdown shown when the 🔔 bell icon is clicked
// ══════════════════════════════════════════════════════════════════════════════
function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDelete, onClose }) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      position: "fixed",
      top: 64,
      right: 16,
      width: 360,
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      zIndex: 2000,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    }}>
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔔</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>Notifications</span>
          {unread > 0 && (
            <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 800 }}>
              {unread}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {unread > 0 && (
            <button onClick={onMarkAllRead} style={{ background: "none", border: "none", color: "#1e40af", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
      </div>

      {/* Notification list */}
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔕</div>
            <div style={{ fontSize: 13 }}>No notifications</div>
          </div>
        ) : notifications.map(n => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f3f4f6", background: n.read ? "#fff" : "#f0f7ff", cursor: "pointer" }}
          >
            <NotifIcon type={n.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: n.read ? 600 : 800, color: "#111827" }}>{n.title}</span>
                <span style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0 }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>{n.message}</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onDelete(n.id); }}
              style={{ background: "none", border: "none", color: "#d1d5db", fontSize: 14, cursor: "pointer", flexShrink: 0, alignSelf: "flex-start", padding: 0 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Clear all button */}
      {notifications.length > 0 && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <button onClick={onMarkAllRead} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 11, cursor: "pointer" }}>
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL
// Dropdown shown when the ⚙️ gear icon is clicked
// ✏️ Add new settings fields inside any SettingsSection below
// ══════════════════════════════════════════════════════════════════════════════
function SettingsPanel({ settings, onSave, onClose }) {
  const [s, setS] = useState({ ...settings });
  const toggle = k  => setS(p => ({ ...p, [k]: !p[k] }));
  const setVal = (k, v) => setS(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: "fixed",
      top: 64,
      right: 16,
      width: 380,
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      zIndex: 2000,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    }}>
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚙️</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>Settings</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>

      <div style={{ padding: "18px 20px", maxHeight: 480, overflowY: "auto" }}>

        {/* ── User Profile ── */}
        <SettingsSection title="User Profile">
          <div style={{ marginBottom: 12 }}>
            <label style={LS}>Full Name</label>
            <input value={s.name}  onChange={e => setVal("name",  e.target.value)} style={IS} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={LS}>Email</label>
            <input value={s.email} onChange={e => setVal("email", e.target.value)} style={IS} />
          </div>
          <div>
            <label style={LS}>Role</label>
            {/* ✏️ Add/remove role options here */}
            <select value={s.role} onChange={e => setVal("role", e.target.value)} style={IS}>
              <option>Administrator</option>
              <option>Data Encoder</option>
              <option>Viewer</option>
              <option>Project Manager</option>
            </select>
          </div>
        </SettingsSection>

        {/* ── Dashboard Display ── */}
        <SettingsSection title="Dashboard Display">
          <SettingsToggle label="Show Charts"               desc="Display bar and pie charts" value={s.showCharts}      onChange={() => toggle("showCharts")} />
          <SettingsToggle label="Show Equipment Table"                                         value={s.showEquipTable}  onChange={() => toggle("showEquipTable")} />
          <SettingsToggle label="Show Municipality Summary"                                    value={s.showMuniSummary} onChange={() => toggle("showMuniSummary")} />
          <div style={{ marginBottom: 12 }}>
            <label style={LS}>Default Year Filter</label>
            <select value={s.defaultYear} onChange={e => setVal("defaultYear", e.target.value)} style={IS}>
              <option value="All">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
        </SettingsSection>

        {/* ── Notification Preferences ── */}
        <SettingsSection title="Notification Preferences">
          <SettingsToggle label="Project Updates"   value={s.notifProjects}  onChange={() => toggle("notifProjects")} />
          <SettingsToggle label="Equipment Updates"  value={s.notifEquipment} onChange={() => toggle("notifEquipment")} />
          <SettingsToggle label="Budget Alerts"      value={s.notifBudget}    onChange={() => toggle("notifBudget")} />
          <SettingsToggle label="Report Generation"  value={s.notifReports}   onChange={() => toggle("notifReports")} />
        </SettingsSection>

        {/* ── KPI Targets ── */}
        {/* ✏️ Edit KPI_LIST in Utils.js to change components and default targets */}
        <SettingsSection title="KPI Targets per Component">
          {KPI_LIST.map(k => (
            <div key={k.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, borderRadius: 6, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>
                  {k.key.slice(0, 2).toUpperCase()}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{k.title}</span>
              </div>
              <input
                type="number"
                min="0"
                value={s.targets?.[k.key] ?? k.target}
                onChange={e => setVal("targets", { ...s.targets, [k.key]: Number(e.target.value) })}
                style={{ ...IS, width: 60, padding: "5px 8px", textAlign: "center" }}
              />
            </div>
          ))}
        </SettingsSection>

        {/* ── Data Management ── */}
        <SettingsSection title="Data Management">
          <SettingsToggle label="Auto-save Changes" value={s.autoSave}      onChange={() => toggle("autoSave")} />
          <SettingsToggle label="Confirm on Delete" value={s.confirmDelete} onChange={() => toggle("confirmDelete")} />
        </SettingsSection>

        {/* ── Danger Zone ── */}
        <SettingsSection title="⚠️ Danger Zone">
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, color: "#991b1b", fontWeight: 700, marginBottom: 6 }}>Clear All Saved Data</div>
            <div style={{ fontSize: 11, color: "#b91c1c", marginBottom: 10 }}>
              This will permanently delete all projects, equipment, notifications, and settings from this browser.
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will delete ALL saved data and cannot be undone.")) {
                  Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
                  window.location.reload();
                }
              }}
              style={{ background: "#ef4444", border: "none", color: "#fff", borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </SettingsSection>

      </div>

      {/* Save / Cancel buttons */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, justifyContent: "flex-end", background: "#f9fafb" }}>
        <button onClick={onClose}                  style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
        <button onClick={() => { onSave(s); onClose(); }} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 8, padding: "8px 22px", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>💾 Save Settings</button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// Root component — this is what your app renders
// ══════════════════════════════════════════════════════════════════════════════
export default function MonitoringDashboard() {

  // ── Persisted State (automatically saved to localStorage) ─────────────────
  const [projects,      setProjects]      = usePersistedState(LS_KEYS.projects,      []);
  const [equipment,     setEquipment]     = usePersistedState(LS_KEYS.equipment,     []);
  const [notifications, setNotifications] = usePersistedState(LS_KEYS.notifications, []);
  const [settings,      setSettings]      = usePersistedState(LS_KEYS.settings,      DEFAULT_SETTINGS);

  // ── UI State (not saved, resets on refresh) ───────────────────────────────
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


  // ── Toast (brief success/error message) ──────────────────────────────────
  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Add a notification to the bell dropdown ───────────────────────────────
  const addNotif = (type, title, message) => {
    setNotifications(ns => [{
      id: Date.now(), type, read: false, time: "Just now", title, message,
    }, ...ns]);
  };


  // ── Project CRUD ──────────────────────────────────────────────────────────

  const saveProject = data => {
    if (data.id) {
      // Update existing project
      setProjects(ps => ps.map(p => p.id === data.id ? data : p));
      if (selectedProject?.id === data.id) setSelectedProject(data);
      showToast("✓ Project updated");
      if (settings.notifProjects) addNotif("success", "Project Updated", `"${data.project.slice(0, 40)}..." updated.`);
    } else {
      // Add new project — auto-assign next ID
      setProjects(ps => [...ps, { ...data, id: Math.max(0, ...ps.map(p => p.id)) + 1 }]);
      showToast("✓ Project added");
      if (settings.notifProjects) addNotif("info", "New Project Added", `"${data.project.slice(0, 40)}..." added.`);
    }
    setModal(null);
  };

  const deleteProject = id => {
    const proj = projects.find(p => p.id === id);
    setProjects(ps => ps.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
    showToast("Project deleted", "#ef4444");
    if (settings.notifProjects) addNotif("warning", "Project Deleted", `"${proj?.project?.slice(0, 40)}..." removed.`);
    setModal(null);
  };


  // ── Equipment CRUD ────────────────────────────────────────────────────────

  const saveEquipment = data => {
    if (data.id) {
      setEquipment(eq => eq.map(e => e.id === data.id ? data : e));
      showToast("✓ Equipment updated");
    } else {
      setEquipment(eq => [...eq, { ...data, id: Math.max(0, ...eq.map(e => e.id)) + 1 }]);
      showToast("✓ Equipment added");
    }
    setModal(null);
  };

  const deleteEquipment = id => {
    setEquipment(eqs => eqs.filter(e => e.id !== id));
    showToast("Equipment deleted", "#ef4444");
    setModal(null);
  };


  // ── Notification Handlers ─────────────────────────────────────────────────
  const markNotifRead = id => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead   = ()  => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const deleteNotif   = id => setNotifications(ns => ns.filter(n => n.id !== id));

  // ── Settings Save ─────────────────────────────────────────────────────────
  const handleSaveSettings = s => {
    setSettings(s);
    showToast("✓ Settings saved");
    addNotif("success", "Settings Saved", "Preferences updated.");
  };


  // ── Computed Summary Values ───────────────────────────────────────────────
  const totalFunds  = projects.reduce((s, p) => s + Number(p.amountFunded), 0);
  const activeCount = projects.filter(p => p.status === "Ongoing").length;
  const doneCount   = projects.filter(p => p.status === "Finished").length;
  const uniqueComm  = new Set(projects.map(p => p.community)).size;
  const unreadCount = notifications.filter(n => !n.read).length;

  // Deduplicated, sorted year list for dropdowns
  // Coercing to Number prevents "2020" and 2020 appearing as duplicates
  const years = [
    "All",
    ...Array.from(new Set(projects.map(p => Number(p.year)).filter(Boolean))).sort(),
  ];


  // ── Filter Logic ─────────────────────────────────────────────────────────
  // All four filters (search, year, component, status) are applied together
  const filteredP = projects.filter(p => {
    const mSearch = !search
      || p.project.toLowerCase().includes(search.toLowerCase())
      || p.community.toLowerCase().includes(search.toLowerCase())
      || p.municipality.toLowerCase().includes(search.toLowerCase());
    const mCat    = categoryFilter === "All" || p.components.includes(categoryFilter);
    const mYear   = yearFilter     === "All" || String(p.year) === String(yearFilter);
    const mStatus = statusFilter   === "All" || p.status === statusFilter;
    return mSearch && mCat && mYear && mStatus;
  });


  // ── Chart Data ────────────────────────────────────────────────────────────

  // All unique municipalities across projects + equipment
  const allMunicipalities = Array.from(
    new Set([...projects.map(p => p.municipality), ...equipment.map(e => e.municipality)])
  ).filter(Boolean).sort();

  // Bar chart data — raw budget per municipality
  const barData = allMunicipalities
    .map(m => ({
      name:   m,
      budget: projects.filter(p => p.municipality === m).reduce((s, p) => s + Number(p.amountFunded), 0),
    }))
    .filter(d => d.budget > 0);

  // Auto-scale chart labels: ₱XM if any budget ≥ 1 million, else ₱Xk
  const maxBudget = barData.reduce((m, d) => Math.max(m, d.budget), 0);
  const fmtChart  = v => maxBudget >= 1_000_000
    ? `₱${(v / 1_000_000).toFixed(1)}M`
    : `₱${(v / 1_000).toFixed(0)}k`;

  // Pie chart data — count of projects per component
  const compCounts = Object.entries(COMPONENTS)
    .map(([k]) => ({ name: k.toUpperCase(), value: projects.filter(p => p.components.includes(k)).length }))
    .filter(d => d.value > 0);

  // Municipality project count summary
  const muniSummary = allMunicipalities
    .map(m => ({ name: m, count: projects.filter(p => p.municipality === m).length }))
    .filter(m => m.count > 0);

  // KPI project counts per component (for KPI Reports page)
  const kpiCounts = KPI_LIST.reduce((acc, k) => {
    acc[k.key] = projects.filter(p => p.components.includes(k.key)).length;
    return acc;
  }, {});


  // ── Column Key Arrays ─────────────────────────────────────────────────────
  // ✏️ Edit these if you add/remove table columns
  const COMP_KEYS  = ["sel", "hn", "hrd", "drrm", "bgcet", "dg"]; // 6 CEST components
  const COMM_KEYS  = Object.keys(COMMUNITY_TYPES);                  // Community type columns
  const BENEF_COLS = ["male", "female", "ips", "fourps", "pwd", "senior", "total"]; // 7 cols
  const STAKE_COLS = ["lgu", "plgu", "blgu", "pnp", "suc", "others"];               // 6 cols


  // ── Sidebar Navigation Items ──────────────────────────────────────────────
  // ✏️ Add { id, icon, label } here to create a new sidebar page
  const NAV_ITEMS = [
    { id: "dashboard",  icon: "🏠", label: "Dashboard"   },
    { id: "dataentry",  icon: "✏️", label: "Data Entry"  },
    { id: "projects",   icon: "📋", label: "Projects"    },
    { id: "trainings",  icon: "🎓", label: "Trainings"   },
    { id: "kpireports", icon: "📊", label: "KPI Reports" },
  ];


  // ── Panel & Modal Helpers ─────────────────────────────────────────────────
  const closeAll = () => { setShowNotifs(false); setShowSettings(false); };

  const handleDetailEdit = () => {
    setModal({ type: "editProject", data: selectedProject });
    setSelectedProject(null);
  };

  const handleDetailDelete = () => {
    if (settings.confirmDelete) {
      setModal({ type: "deleteProject", data: selectedProject });
      setSelectedProject(null);
    } else {
      deleteProject(selectedProject.id);
      setSelectedProject(null);
    }
  };

  // ── Table Header Style Helpers ────────────────────────────────────────────
  // groupTH — wide colored header that spans multiple columns
  // ✏️ Change the hex colors in the calls below to change group header colors
  const groupTH = bg => ({
    padding:     "6px 10px",
    textAlign:   "center",
    color:       "#fff",
    fontWeight:  800,
    fontSize:    11,
    background:  bg,
    borderRight: "1px solid rgba(255,255,255,0.2)",
    whiteSpace:  "nowrap",
  });

  // subTH — colored sub-header within a group
  const subTH = bg => ({ ...thBase, background: bg, textAlign: "center" });


  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", background: "#eff6ff", overflow: "hidden" }}
      onClick={e => { if (e.target.dataset.backdrop) closeAll(); }}
    >

      {/* Inject global no-spinner CSS + table padding */}
      <style>{noSpinnerStyle}</style>

      {/* ── Toast message (top-right corner) ── */}
      {toast && (
        <div style={{ position: "fixed", top: 18, right: 18, zIndex: 3000, background: toast.color, color: "#fff", borderRadius: 10, padding: "11px 22px", fontWeight: 800, fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Backdrop (closes panels when clicking outside) ── */}
      {(showNotifs || showSettings) && (
        <div data-backdrop="true" style={{ position: "fixed", inset: 0, zIndex: 1999 }} onClick={closeAll} />
      )}

      {/* ── Floating Panels ── */}
      {showNotifs   && <NotificationPanel notifications={notifications} onMarkRead={markNotifRead} onMarkAllRead={markAllRead} onDelete={deleteNotif} onClose={() => setShowNotifs(false)} />}
      {showSettings && <SettingsPanel settings={settings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />}

      {/* ── Project Detail Modal (click project title to open) ── */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={handleDetailEdit}
          onDelete={handleDetailDelete}
        />
      )}


      {/* ════════════════════════════════════════════════════════════════════
          SIDEBAR
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 8px rgba(0,0,0,0.04)", zIndex: 10 }}>

        {/* Logo & tagline */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
            <img src={logo} alt="CEST Logo" style={{ width: 100, height: 100, borderRadius: 12, objectFit: "contain" }} />
            <div style={{ fontSize: 8, color: "#6b7280", lineHeight: 1.5 }}>
              Community Empowerment thru Science &amp; Technology
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => setActivePage(n.id)}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          12,
                width:        "100%",
                padding:      "10px 14px",
                marginBottom: 4,
                borderRadius: 10,
                border:       "none",
                background:   activePage === n.id ? "#eff6ff"      : "transparent",
                color:        activePage === n.id ? "#1e40af"      : "#374151",
                fontWeight:   activePage === n.id ? 700            : 500,
                fontSize:     14,
                cursor:       "pointer",
                textAlign:    "left",
                borderLeft:   activePage === n.id ? "3px solid #1e40af" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
              {/* Badge showing component count on KPI Reports link */}
              {n.id === "kpireports" && (
                <span style={{ marginLeft: "auto", background: "#1e40af", color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 800 }}>
                  {Object.keys(COMPONENTS).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <div style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 10, border: "none", background: "transparent", color: "#ef4444", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── Top Bar ── */}
        <div style={{ background: "#1e40af", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 10 }}>

          {/* Current page title */}
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#fff" }}>
            {NAV_ITEMS.find(n => n.id === activePage)?.label}
          </h1>

          {/* Right: stats + bell + gear */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginRight: 4 }}>
              {projects.length} Projects · {uniqueComm} Communities
            </span>

            {/* Bell icon — opens notification panel */}
            <button
              onClick={e => { e.stopPropagation(); setShowSettings(false); setShowNotifs(v => !v); }}
              style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: showNotifs ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #1e40af" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Gear icon — opens settings panel */}
            <button
              onClick={e => { e.stopPropagation(); setShowNotifs(false); setShowSettings(v => !v); }}
              style={{ width: 38, height: 38, borderRadius: 10, background: showSettings ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ⚙️
            </button>
          </div>
        </div>


        {/* ── Scrollable Page Content ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>


          {/* ════════════════════════════════════════════════════════════════
              PAGE: DASHBOARD
              ════════════════════════════════════════════════════════════════ */}
          {activePage === "dashboard" && (
            <div>

              {/* ── Summary Cards ── */}
              {/* ✏️ Add/edit cards in the array below */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Total Projects", value: projects.length,                                  icon: "📊", bg: "linear-gradient(135deg,#1e40af,#3b82f6)" },
                  { label: "Communities",    value: uniqueComm,                                        icon: "👥", bg: "linear-gradient(135deg,#16a34a,#4ade80)" },
                  { label: "Total Amount Assisted",    value: fmt(totalFunds),                                   icon: "💰", bg: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
                  { label: "Status",         value: `${activeCount} Ongoing / ${doneCount} Finished`, icon: "📈", bg: "linear-gradient(135deg,#d97706,#fbbf24)" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                      <div style={{ fontSize: typeof s.value === "string" ? 15 : 28, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                    </div>
                    <div style={{ fontSize: 34, opacity: 0.85 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* ── Filter Bar ── */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search project, community, municipality..."
                  style={{ ...IS, flex: 1, minWidth: 240, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                />
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 180, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <option value="All">All Components</option>
                  {Object.entries(COMPONENTS).map(([k, v]) => (
                    <option key={k} value={k}>{k.toUpperCase()} – {v}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 130, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <option value="All">All Status</option>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* ── Charts (toggle in Settings → Show Charts) ── */}
              {settings.showCharts && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14, marginBottom: 18 }}>

                  {/* Bar chart — Budget by Municipality */}
                  <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "#374151", fontWeight: 700 }}>Budget by Municipality</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={fmtChart} />
                        <Tooltip formatter={v => [fmtChart(v), "Budget"]} />
                        <Bar dataKey="budget" fill="#1e40af" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie chart — Projects by Component */}
                  <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "#374151", fontWeight: 700 }}>Projects by Component</h3>
                    {compCounts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={compCounts} cx="45%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}:${value}`} labelLine={false} fontSize={10}>
                            {compCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#9ca3af", fontSize: 13 }}>No data</div>
                    )}
                  </div>

                </div>
              )}

              {/* ── Projects Table with Grouped Headers ── */}
              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 18 }}>

                {/* Table title bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff" }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: "#1e3a8a" }}>List of Projects</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {filteredP.length} entries · Total: {fmt(filteredP.reduce((s, p) => s + Number(p.amountFunded), 0))}
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="dashboard-projects-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>

                      {/* ── Header Row 1: Static cols (rowSpan=3) + Group headers ── */}
                      <tr>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>No.</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Year</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>Municipality / City</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>Community / Beneficiaries</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle" }}>List of Projects Funded 📄</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Amount Funded</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Amount / Year</th>
                        {/* ✏️ Change group header colors by editing the hex codes below */}
                        <th colSpan={COMP_KEYS.length} style={groupTH("#1e3a8f")}>CEST 2.0 Components</th>
                        <th colSpan={COMM_KEYS.length} style={groupTH("#0369a1")}>Community Types</th>
                        <th colSpan={7}                style={groupTH("#166534")}>No. of Beneficiaries</th>
                        <th colSpan={STAKE_COLS.length} style={groupTH("#5b21b6")}>Stakeholders</th>
                        <th rowSpan={3} style={{ ...thBase, verticalAlign: "middle", textAlign: "center" }}>Status</th>
                      </tr>

                      {/* ── Header Row 2: Component & Community sub-headers ── */}
                      <tr>
                        {/* Each CEST component spans rows 2-3 */}
                        {[
                          ["SEL",   "#1e3a8f"],
                          ["H&N",   "#166534"],
                          ["HRD",   "#5b21b6"],
                          ["DRRM",  "#991b1b"],
                          ["BGCET", "#064e3b"],
                          ["DG",    "#92400e"],
                        ].map(([lbl, bg]) => (
                          <th key={lbl} rowSpan={2} style={{ ...subTH(bg), verticalAlign: "middle" }}>{lbl}</th>
                        ))}
                        {/* Each community type spans rows 2-3 */}
                        {Object.entries(COMMUNITY_TYPES).map(([k, v]) => (
                          <th key={k} rowSpan={2} style={{ ...subTH("#0369a1"), verticalAlign: "middle" }}>{v}</th>
                        ))}
                        {/* Male & Female span rows 2-3 */}
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle" }}>Male</th>
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle" }}>Female</th>
                        {/* Blank group header for IP's/4P's/PWD/Senior (defined in Row 3) */}
                        <th colSpan={4} style={{ ...subTH("#166534"), background: "#1e4d2a", borderBottom: "2px solid #15803d" }} />
                        {/* Total spans rows 2-3 */}
                        <th rowSpan={2} style={{ ...subTH("#166534"), verticalAlign: "middle", fontWeight: 900 }}>Total</th>
                        {/* Stakeholders span rows 2-3 */}
                        {["LGU", "PLGU", "BLGU", "PNP", "SUC", "Others"].map(lbl => (
                          <th key={lbl} rowSpan={2} style={{ ...subTH("#5b21b6"), verticalAlign: "middle" }}>{lbl}</th>
                        ))}
                      </tr>

                      {/* ── Header Row 3: IP's / 4P's / PWD / Senior Citizen ── */}
                      <tr>
                        <th style={subTH("#15803d")}>IP's</th>
                        <th style={subTH("#15803d")}>4P's</th>
                        <th style={subTH("#15803d")}>PWD</th>
                        <th style={subTH("#15803d")}>Senior Citizen</th>
                      </tr>

                    </thead>

                    {/* ── Table Body ── */}
                    <tbody>
                      {filteredP.map((p, i) => {
                        const sc = statusColor(p.status);
                        return (
                          <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                            <TD style={{ color: "#9ca3af", textAlign: "center" }}>{p.id}</TD>
                            <TD style={{ fontWeight: 700, color: "#1e40af", textAlign: "center" }}>{p.year}</TD>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{p.municipality}</TD>
                            <TD>{p.community}</TD>
                            {/* Project title — click to open PDF */}
                            <TD style={{ maxWidth: 200 }}>
                              <div
                                style={{ ...projTitleStyle, maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}
                                onClick={() => openProjectAsPDF(p)}
                                title="Click to open project profile as PDF"
                                onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}
                              >
                                📄 {p.project}
                              </div>
                            </TD>
                            <TD style={{ color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap", textAlign: "right" }}>{fmt(p.amountFunded)}</TD>
                            <TD style={{ whiteSpace: "nowrap", textAlign: "right" }}>{fmt(p.amountPerYear)}</TD>
                            {/* CEST Component checkmarks */}
                            {COMP_KEYS.map(c => (
                              <TD key={c} style={{ textAlign: "center" }}>
                                {p.components.includes(c) ? <span style={{ color: COMP_COLORS[c], fontWeight: 900, fontSize: 14 }}>✓</span> : ""}
                              </TD>
                            ))}
                            {/* Community Type checkmarks */}
                            {COMM_KEYS.map(c => (
                              <TD key={c} style={{ textAlign: "center" }}>
                                {(p.communities || []).includes(c) ? <span style={{ color: COMMUNITY_COLORS[c], fontWeight: 900, fontSize: 14 }}>✓</span> : ""}
                              </TD>
                            ))}
                            {/* Beneficiaries — order matches header: Male|Female|IP's|4P's|PWD|Senior|Total */}
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.male   || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.female || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.ips    || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.fourps || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.pwd    || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.beneficiaries?.senior || ""}</TD>
                            <TD style={{ textAlign: "center", fontWeight: 700 }}>{p.beneficiaries?.total || ""}</TD>
                            {/* Stakeholders */}
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.lgu  || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.plgu || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.blgu || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.pnp  || ""}</TD>
                            <TD style={{ textAlign: "center" }}>{p.stakeholders?.suc  || ""}</TD>
                            <TD style={{ textAlign: "center", maxWidth: 80 }}>
                              {p.stakeholders?.others
                                ? <span title={p.stakeholders?.othersLabel || ""}>
                                    {p.stakeholders.others}
                                    {p.stakeholders?.othersLabel ? ` (${p.stakeholders.othersLabel})` : ""}
                                  </span>
                                : ""}
                            </TD>
                            {/* Status badge */}
                            <TD>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>
                                {p.status}
                              </span>
                            </TD>
                          </tr>
                        );
                      })}
                      {/* Empty state */}
                      {!filteredP.length && (
                        <tr>
                          <td colSpan={7 + COMP_KEYS.length + COMM_KEYS.length + BENEF_COLS.length + STAKE_COLS.length + 1} style={{ padding: 28, textAlign: "center", color: "#9ca3af" }}>
                            No results found.
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* ── Footer Totals Row ── */}
                    <tfoot>
                      <tr style={{ background: "#1e3a5f", color: "#fff", fontWeight: 800 }}>
                        <td colSpan={5} style={{ padding: "8px 10px", fontSize: 12 }}>
                          Total No. of Funded Projects: {filteredP.length}
                        </td>
                        <td style={{ padding: "8px 10px", fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>
                          {fmt(filteredP.reduce((s, p) => s + Number(p.amountFunded), 0))}
                        </td>
                        <td style={{ padding: "8px 10px", fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>
                          {fmt(filteredP.reduce((s, p) => s + Number(p.amountPerYear), 0))}
                        </td>
                        {COMP_KEYS.map(c => (
                          <td key={c} style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>
                            {filteredP.filter(p => p.components.includes(c)).length || ""}
                          </td>
                        ))}
                        {COMM_KEYS.map(c => (
                          <td key={c} style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>
                            {filteredP.filter(p => (p.communities || []).includes(c)).length || ""}
                          </td>
                        ))}
                        <td colSpan={BENEF_COLS.length + STAKE_COLS.length + 1} style={{ padding: "8px 10px" }} />
                      </tr>
                    </tfoot>

                  </table>
                </div>
              </div>

              {/* ── Equipment Table (toggle in Settings → Show Equipment Table) ── */}
              {settings.showEquipTable && (
                <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 18 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff", fontWeight: 800, fontSize: 13, color: "#166534" }}>
                    List of Equipment / Technologies Deployed
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <TH ch="Year" />
                          <TH ch="Municipality/City" />
                          <TH ch="Community/Beneficiaries" />
                          <TH ch="List of Equipment/Technologies Deployed" />
                          <TH ch="No. of Units" />
                          <TH ch="No. of Units per year" />
                          <TH ch="Component" />
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
                            <TD>
                              <span style={{ background: COMP_COLORS[e.component] + "22", color: COMP_COLORS[e.component], borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                                {e.component}
                              </span>
                            </TD>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#1e3a5f", color: "#fff" }}>
                          <td colSpan={4} style={{ padding: "8px 10px", fontSize: 12, fontWeight: 800 }}>Total No. of Units</td>
                          <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 800, textAlign: "center" }}>
                            {equipment.reduce((s, e) => s + Number(e.units), 0)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Municipality Summary (toggle in Settings → Show Municipality Summary) ── */}
              {settings.showMuniSummary && (
                <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8faff", fontWeight: 800, fontSize: 13, color: "#1e3a8a" }}>
                    Number of Projects Funded in the Province
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr><TH ch="Place" /><TH ch="No. of Projects" /></tr>
                      </thead>
                      <tbody>
                        {muniSummary.map((m, i) => (
                          <tr key={m.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                            <TD style={{ color: "#1e40af", fontWeight: 600 }}>{m.name}</TD>
                            <TD style={{ textAlign: "center", fontWeight: 700 }}>{m.count}</TD>
                          </tr>
                        ))}
                        <tr style={{ background: "#1e3a5f", color: "#fff" }}>
                          <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 800 }}>Total</td>
                          <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 800, textAlign: "center" }}>{projects.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* ════════════════════════════════════════════════════════════════
              PAGE: DATA ENTRY
              Add / Edit / Delete projects and equipment
              ════════════════════════════════════════════════════════════════ */}
          {activePage === "dataentry" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                {/* Projects panel */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 14, color: "#1e40af", fontWeight: 800 }}>📋 Projects ({projects.length})</h3>
                    <button onClick={() => setModal({ type: "addProject" })} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                      ＋ Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: "60vh", overflowY: "auto" }}>
                    {projects.map(p => {
                      const sc = statusColor(p.status);
                      return (
                        <div key={p.id} style={{ border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Project title — click to open PDF */}
                            <div
                              style={{ ...projTitleStyle, marginBottom: 3, whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}
                              onClick={() => openProjectAsPDF(p)}
                              title="Click to open as PDF"
                              onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}
                            >
                              📄 {p.project}
                            </div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                              {p.municipality} · {p.year} · {fmt(p.amountFunded)}
                            </div>
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                              {p.components.map(c => (
                                <span key={c} style={{ background: COMP_COLORS[c], color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{c}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button onClick={() => setModal({ type: "editProject", data: p })} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Edit</button>
                            <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteProject", data: p }) : deleteProject(p.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Del</button>
                          </div>
                        </div>
                      );
                    })}
                    {!projects.length && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No projects yet.</p>}
                  </div>
                </div>

                {/* Equipment panel */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 14, color: "#16a34a", fontWeight: 800 }}>⚙️ Equipment ({equipment.length})</h3>
                    <button onClick={() => setModal({ type: "addEquipment" })} style={{ background: "#16a34a", border: "none", color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                      ＋ Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: "60vh", overflowY: "auto" }}>
                    {equipment.map(e => (
                      <div key={e.id} style={{ border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", whiteSpace: "normal", wordBreak: "break-word" }}>{e.equipment}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                            {e.municipality} · {e.year} · {e.units} unit{e.units !== 1 ? "s" : ""}
                          </div>
                          <span style={{ background: COMP_COLORS[e.component] + "22", color: COMP_COLORS[e.component], borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", marginTop: 4, display: "inline-block" }}>
                            {e.component}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => setModal({ type: "editEquipment", data: e })} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteEquipment", data: e }) : deleteEquipment(e.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Del</button>
                        </div>
                      </div>
                    ))}
                    {!equipment.length && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No equipment yet.</p>}
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* ════════════════════════════════════════════════════════════════
              PAGE: PROJECTS
              Filterable table with edit/delete actions
              ════════════════════════════════════════════════════════════════ */}
          {activePage === "projects" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 15, color: "#111827", fontWeight: 800 }}>All Funded Projects</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ ...IS, width: "auto" }}>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...IS, width: "auto" }}>
                    <option value="All">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setModal({ type: "addProject" })} style={{ background: "#1e40af", border: "none", color: "#fff", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                    ＋ Add Project
                  </button>
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
                            <TD style={{ maxWidth: 130 }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{p.community}</div>
                            </TD>
                            <TD style={{ maxWidth: 180 }}>
                              <div
                                style={{ ...projTitleStyle, maxWidth: 180, whiteSpace: "normal", wordBreak: "break-word" }}
                                onClick={() => openProjectAsPDF(p)}
                                onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}
                              >
                                📄 {p.project}
                              </div>
                            </TD>
                            <TD style={{ color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(p.amountFunded)}</TD>
                            <TD style={{ whiteSpace: "nowrap" }}>{fmt(p.amountPerYear)}</TD>
                            <TD>
                              <div style={{ display: "flex", gap: 3 }}>
                                {p.components.map(c => (
                                  <span key={c} style={{ background: COMP_COLORS[c], color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{c}</span>
                                ))}
                                {!p.components.length && <span style={{ color: "#9ca3af" }}>—</span>}
                              </div>
                            </TD>
                            <TD>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                            </TD>
                            <TD>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => setModal({ type: "editProject", data: p })} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Edit</button>
                                <button onClick={() => settings.confirmDelete ? setModal({ type: "deleteProject", data: p }) : deleteProject(p.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Del</button>
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


          {/* ════════════════════════════════════════════════════════════════
              PAGE: TRAININGS
              Rendered from ./Trainingspage.jsx
              ✏️ Edit that file to change the trainings layout/form/table
              ════════════════════════════════════════════════════════════════ */}
          {activePage === "trainings" && <TrainingsPage />}


          {/* ════════════════════════════════════════════════════════════════
              PAGE: KPI REPORTS
              Performance tracking per CEST 2.0 Component
              ════════════════════════════════════════════════════════════════ */}
          {activePage === "kpireports" && (
            <div>

              {/* Page header + year filter */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 900 }}>Key Performance Indicators</h2>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
                    Performance tracking per CEST 2.0 Component · {projects.length} total projects
                  </p>
                </div>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 110 }}>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* Overall progress bars — one per component */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#1e3a8a", marginBottom: 16 }}>📈 Overall KPI Achievement Overview</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {KPI_LIST.map(k => {
                    const actual = kpiCounts[k.key];
                    const target = settings.targets?.[k.key] ?? k.target;
                    const pct    = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
                    const color  = pct >= 100 ? "#16a34a" : pct >= 60 ? "#d97706" : "#ef4444";
                    return (
                      <div key={k.key} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 200, flexShrink: 0 }}>
                          <span style={{ width: 26, height: 26, borderRadius: 6, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, flexShrink: 0 }}>
                            {k.key.slice(0, 2).toUpperCase()}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.title}</span>
                        </div>
                        <div style={{ flex: 1, height: 14, background: "#f3f4f6", borderRadius: 7, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${k.color},${k.color}cc)`, borderRadius: 7, transition: "width 0.3s" }} />
                        </div>
                        <div style={{ width: 90, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color }}>{actual}/{target}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color, background: color + "18", borderRadius: 20, padding: "1px 8px" }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mini summary cards — one per component */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
                {KPI_LIST.map(k => {
                  const actual = kpiCounts[k.key];
                  const target = settings.targets?.[k.key] ?? k.target;
                  const pct    = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
                  return (
                    <div key={k.key} style={{ background: k.color, borderRadius: 10, padding: 14, color: "#fff", textAlign: "center" }}>
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

              {/* Detailed KPI cards — one per component */}
              <div style={{ display: "grid", gap: 14 }}>
                {KPI_LIST.map(k => {
                  // Projects under this component (respects year filter)
                  const relProjects = (yearFilter === "All"
                    ? projects
                    : projects.filter(p => p.year === Number(yearFilter))
                  ).filter(p => p.components.includes(k.key));

                  const relEquipment = equipment.filter(e => e.component === k.key);
                  const totalFundsK  = relProjects.reduce((s, p) => s + Number(p.amountFunded), 0);
                  const actual       = relProjects.length;
                  const target       = settings.targets?.[k.key] ?? k.target;
                  const pct          = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
                  const statusColor2 = pct >= 100 ? "#16a34a" : pct >= 60 ? "#d97706" : "#ef4444";
                  const statusLabel  = pct >= 100 ? "✅ Target Met" : pct >= 60 ? "⚡ On Track" : "⚠️ Below Target";

                  return (
                    <div key={k.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: `5px solid ${k.color}` }}>

                      {/* Card header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{ background: k.color, color: "#fff", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>
                          {k.id}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{k.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                            <strong style={{ color: k.color }}>{k.key.toUpperCase()}</strong> · {COMPONENTS[k.key]}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {/* Progress bar */}
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
                          {/* Stat badges */}
                          {[
                            { val: `${actual}/${target}`, label: "Projects",  bg: k.color + "15", col: k.color },
                            { val: relEquipment.length,   label: "Equipment", bg: "#f3f4f6",       col: "#374151" },
                            { val: fmt(totalFundsK),      label: "Funded",    bg: "#f0fdf4",       col: "#16a34a" },
                          ].map(st => (
                            <div key={st.label} style={{ background: st.bg, borderRadius: 8, padding: "6px 14px", textAlign: "center", minWidth: 75 }}>
                              <div style={{ fontSize: 14, fontWeight: 900, color: st.col }}>{st.val}</div>
                              <div style={{ fontSize: 9, color: "#6b7280" }}>{st.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance indicators list */}
                      <div style={{ padding: "12px 20px" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                          Performance Indicators
                        </div>
                        {k.indicators.map((ind, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 7 }}>
                            <span style={{ color: k.color, flexShrink: 0, fontWeight: 900, fontSize: 13 }}>▶</span>
                            <span style={{ fontSize: 12, color: "#374151", flex: 1, lineHeight: 1.5 }}>{ind}</span>
                            <div style={{ flexShrink: 0, textAlign: "center" }}>
                              <span style={{ background: k.color + "18", color: k.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 900, display: "block" }}>
                                {actual} / {target}
                              </span>
                              <span style={{ fontSize: 10, color: "#6b7280", marginTop: 2, display: "block" }}>Actual / Target</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Projects under this component */}
                      {relProjects.length > 0 && (
                        <div style={{ padding: "0 20px 16px" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                            Projects Under This Component
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, background: "#f9fafb", borderRadius: 7, overflow: "hidden" }}>
                            <thead>
                              <tr style={{ background: k.color + "20", color: k.color }}>
                                {["Year", "Municipality", "Project", "Amount", "Beneficiaries", "Status"].map(h => (
                                  <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, fontSize: 11 }}>{h}</th>
                                ))}
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
                                      <div
                                        style={{ ...projTitleStyle, maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}
                                        onClick={() => openProjectAsPDF(p)}
                                        onMouseEnter={e => { e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.textDecorationStyle = "solid"; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = "#1e40af"; e.currentTarget.style.textDecorationStyle = "dotted"; }}
                                      >
                                        📄 {p.project}
                                      </div>
                                    </td>
                                    <td style={{ padding: "7px 10px", color: "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(p.amountFunded)}</td>
                                    <td style={{ padding: "7px 10px", textAlign: "center" }}>{p.beneficiaries?.total || "—"}</td>
                                    <td style={{ padding: "7px 10px" }}>
                                      <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr style={{ background: k.color + "15", borderTop: `2px solid ${k.color}30` }}>
                                <td colSpan={3} style={{ padding: "7px 10px", fontSize: 11, fontWeight: 800, color: k.color }}>Component Total</td>
                                <td style={{ padding: "7px 10px", fontSize: 11, fontWeight: 800, color: "#16a34a" }}>{fmt(totalFundsK)}</td>
                                <td style={{ padding: "7px 10px", textAlign: "center", fontSize: 11, fontWeight: 800, color: k.color }}>
                                  {relProjects.reduce((s, p) => s + Number(p.beneficiaries?.total || 0), 0) || "—"}
                                </td>
                                <td style={{ padding: "7px 10px", fontSize: 11, color: "#6b7280" }}>
                                  {relProjects.filter(p => p.status === "Ongoing").length} Ongoing
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}

                      {/* No projects state */}
                      {relProjects.length === 0 && (
                        <div style={{ padding: "12px 20px 18px", display: "flex", alignItems: "center", gap: 10, color: "#9ca3af" }}>
                          <span style={{ fontSize: 20 }}>📭</span>
                          <span style={{ fontSize: 12, fontStyle: "italic" }}>
                            No projects assigned to this component{yearFilter !== "All" ? ` for ${yearFilter}` : ""} yet.
                          </span>
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


      {/* ════════════════════════════════════════════════════════════════════
          MODALS
          ════════════════════════════════════════════════════════════════════ */}

      {/* Project modals */}
      {modal?.type === "addProject"     && <Modal title="➕ Add New Project" onClose={() => setModal(null)}><ProjectForm onSave={saveProject} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "editProject"    && <Modal title="✏️ Edit Project"    onClose={() => setModal(null)}><ProjectForm initial={modal.data} onSave={saveProject} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "deleteProject"  && <Modal title="Delete Project"     onClose={() => setModal(null)}><ConfirmDelete label={modal.data.project} onConfirm={() => deleteProject(modal.data.id)} onCancel={() => setModal(null)} /></Modal>}

      {/* Equipment modals */}
      {modal?.type === "addEquipment"    && <Modal title="➕ Add Equipment"  onClose={() => setModal(null)}><EquipmentForm onSave={saveEquipment} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "editEquipment"   && <Modal title="✏️ Edit Equipment" onClose={() => setModal(null)}><EquipmentForm initial={modal.data} onSave={saveEquipment} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === "deleteEquipment" && <Modal title="Delete Equipment"  onClose={() => setModal(null)}><ConfirmDelete label={modal.data.equipment} onConfirm={() => deleteEquipment(modal.data.id)} onCancel={() => setModal(null)} /></Modal>}

    </div>
  );
}