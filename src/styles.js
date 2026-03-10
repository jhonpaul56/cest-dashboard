// ─── CEST 2.0 STYLES ──────────────────────────────────────────────────────────

export const IS = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 7,
  color: "#111827",
  padding: "9px 12px",
  fontSize: 13,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

export const LS = {
  fontSize: 11,
  color: "#374151",
  fontWeight: 700,
  marginBottom: 5,
  display: "block",
};

export const projTitleStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#1e40af",
  fontWeight: 700,
  fontSize: 12,
  textDecoration: "underline",
  textDecorationStyle: "dotted",
  textUnderlineOffset: 3,
  cursor: "pointer",
};

export const thBase = {
  padding: "8px 10px",
  textAlign: "left",
  color: "#fff",
  fontWeight: 700,
  fontSize: 11,
  background: "#1e3a5f",
  borderRight: "1px solid #2d5282",
  whiteSpace: "nowrap",
};

export const tdBase = {
  padding: "8px 10px",
  fontSize: 12,
  color: "#111827",
  borderBottom: "1px solid #e5e7eb",
  borderRight: "1px solid #f3f4f6",
  verticalAlign: "middle",
};

export const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

// ─── GLOBAL CSS STRING ────────────────────────────────────────────────────────
// Inject via: <style>{noSpinnerCSS}</style>
export const noSpinnerCSS = `
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

// ─── APP WRAPPER ──────────────────────────────────────────────────────────────
export const appWrapper = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Segoe UI',system-ui,sans-serif",
  background: "#eff6ff",
  overflow: "hidden",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
export const toastStyle = (color) => ({
  position: "fixed",
  top: 18,
  right: 18,
  zIndex: 3000,
  background: color,
  color: "#fff",
  borderRadius: 10,
  padding: "11px 22px",
  fontWeight: 800,
  fontSize: 13,
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
});

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export const sidebarWrapper = {
  width: 220,
  background: "#fff",
  borderRight: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
  zIndex: 10,
};

export const sidebarLogoSection = {
  padding: "20px 16px",
  borderBottom: "1px solid #e5e7eb",
};

export const sidebarLogoInner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  textAlign: "center",
};

export const sidebarTagline = {
  fontSize: 8,
  color: "#6b7280",
  lineHeight: 1.5,
};

export const sidebarNav = {
  flex: 1,
  padding: "12px 10px",
};

export const navItem = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "10px 14px",
  marginBottom: 4,
  borderRadius: 10,
  border: "none",
  background:  isActive ? "#eff6ff"      : "transparent",
  color:       isActive ? "#1e40af"      : "#374151",
  fontWeight:  isActive ? 700            : 500,
  fontSize: 14,
  cursor: "pointer",
  textAlign: "left",
  borderLeft:  isActive ? "3px solid #1e40af" : "3px solid transparent",
});

export const navKpiBadge = {
  marginLeft: "auto",
  background: "#1e40af",
  color: "#fff",
  borderRadius: 20,
  padding: "1px 7px",
  fontSize: 9,
  fontWeight: 800,
};

export const sidebarLogoutSection = {
  padding: "14px 10px",
  borderTop: "1px solid #e5e7eb",
};

export const sidebarLogoutBtn = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "transparent",
  color: "#ef4444",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

export const sidebarFooter = {
  padding: "12px 16px",
  borderTop: "1px solid #f3f4f6",
  background: "#f9fafb",
};

export const sidebarFooterTitle = {
  fontSize: 10,
  fontWeight: 800,
  color: "#1e3a8a",
  marginBottom: 2,
};

export const sidebarFooterDivider = {
  marginTop: 8,
  paddingTop: 8,
  borderTop: "1px solid #e5e7eb",
};

export const sidebarFooterCopyright = {
  fontSize: 9,
  color: "#d1d5db",
};

export const sidebarFooterTagline = {
  fontSize: 9,
  color: "#9ca3af",
  lineHeight: 1.5,
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
export const topBar = {
  background: "#1e40af",
  padding: "0 28px",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  zIndex: 10,
};

export const topBarTitle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 900,
  color: "#fff",
};

export const topBarRight = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

export const topBarStats = {
  color: "rgba(255,255,255,0.65)",
  fontSize: 12,
  marginRight: 4,
};

export const topBarIconBtn = (isActive) => ({
  position: "relative",
  width: 38,
  height: 38,
  borderRadius: 10,
  background: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const notifDot = {
  position: "absolute",
  top: 4,
  right: 4,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "#ef4444",
  color: "#fff",
  fontSize: 9,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #1e40af",
};

// ─── PAGE CONTENT ─────────────────────────────────────────────────────────────
export const mainContentArea = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const pageContent = {
  flex: 1,
  overflow: "auto",
  padding: "20px 24px",
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const modalBox = (maxWidth = 640) => ({
  background: "#fff",
  borderRadius: 14,
  width: "100%",
  maxWidth,
  maxHeight: "92vh",
  overflow: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
});

export const modalTitleBar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  background: "#fff",
  zIndex: 1,
};

export const modalTitleText = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#1e3a8a",
};

export const modalCloseBtn = {
  background: "none",
  border: "none",
  color: "#6b7280",
  fontSize: 20,
  cursor: "pointer",
};

export const modalBody = {
  padding: "18px 20px",
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
export const statusColor = (status) => {
  if (status === "Ongoing")    return { bg: "#dcfce7", color: "#16a34a" };
  if (status === "Liquidated") return { bg: "#fef9c3", color: "#b45309" };
  return { bg: "#e0e7ff", color: "#4338ca" };
};

// ─── DETAIL CARD ──────────────────────────────────────────────────────────────
export const detailCardWrap = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "10px 14px",
};

export const detailCardLabel = {
  fontSize: 10,
  color: "#9ca3af",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 4,
};

export const detailCardValue = {
  fontSize: 13,
  fontWeight: 700,
  color: "#111827",
};

// ─── PROJECT DETAIL MODAL BANNER ──────────────────────────────────────────────
export const projectBanner = {
  background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
  borderRadius: 10,
  padding: "16px 20px",
  marginBottom: 18,
};

export const projectBannerTitle = {
  fontSize: 16,
  fontWeight: 900,
  color: "#fff",
  lineHeight: 1.4,
};

export const projectBannerMeta = {
  fontSize: 12,
  color: "rgba(255,255,255,0.75)",
  marginTop: 6,
};

export const projectBannerBadges = {
  marginTop: 8,
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

// ─── BUTTONS ──────────────────────────────────────────────────────────────────
export const btnPrimary = {
  background: "#1e40af",
  border: "none",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 26px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 800,
};

export const btnSecondary = {
  background: "#f3f4f6",
  border: "1px solid #d1d5db",
  color: "#374151",
  borderRadius: 8,
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

export const btnBlueOutline = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1e40af",
  borderRadius: 8,
  padding: "9px 20px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

export const btnDangerOutline = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#ef4444",
  borderRadius: 8,
  padding: "9px 20px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

export const btnDangerSolid = {
  background: "#ef4444",
  border: "none",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 22px",
  cursor: "pointer",
  fontWeight: 800,
};

export const btnSmallBlue = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1e40af",
  borderRadius: 5,
  padding: "3px 8px",
  fontSize: 11,
  cursor: "pointer",
};

export const btnSmallGreen = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#16a34a",
  borderRadius: 5,
  padding: "3px 8px",
  fontSize: 11,
  cursor: "pointer",
};

export const btnSmallDanger = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#ef4444",
  borderRadius: 5,
  padding: "3px 8px",
  fontSize: 11,
  cursor: "pointer",
};

// ─── SETTINGS SECTION TITLE ───────────────────────────────────────────────────
export const settingsSectionTitle = {
  fontSize: 11,
  fontWeight: 800,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 12,
  paddingBottom: 6,
  borderBottom: "1px solid #f3f4f6",
};

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
export const notifPanel = {
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
};

export const floatingPanelHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f8faff",
};

export const notifItem = (isRead) => ({
  display: "flex",
  gap: 12,
  padding: "12px 16px",
  borderBottom: "1px solid #f3f4f6",
  background: isRead ? "#fff" : "#f0f7ff",
  cursor: "pointer",
});

export const notifIconWrap = (type) => {
  const map = {
    info:    { bg: "#eff6ff", border: "#bfdbfe" },
    warning: { bg: "#fffbeb", border: "#fde68a" },
    success: { bg: "#f0fdf4", border: "#bbf7d0" },
  };
  const s = map[type] || map.info;
  return {
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
  };
};

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
export const settingsPanel = {
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
};

export const settingsPanelFooter = {
  padding: "12px 20px",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
  background: "#f9fafb",
};

export const settingsDangerBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 8,
  padding: "12px 14px",
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

// 4 summary cards grid
export const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 14,
  marginBottom: 20,
};

export const summaryCard = (bg) => ({
  background: bg,
  borderRadius: 12,
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
});

export const summaryCardLabel = {
  fontSize: 10,
  color: "rgba(255,255,255,0.85)",
  fontWeight: 600,
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

// Filter bar row
export const filterBarRow = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
  flexWrap: "wrap",
};

// Charts 2-col grid
export const chartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 18,
};

export const chartCard = {
  background: "#fff",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

export const chartCardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
};

// Table panels
export const tablePanel = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  overflow: "hidden",
  marginBottom: 18,
};

export const tablePanelHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f8faff",
};

export const tableFooterRow = {
  background: "#1e3a5f",
  color: "#fff",
  fontWeight: 800,
};

// Group/sub table headers
export const groupTH = (bg) => ({
  padding: "6px 10px",
  textAlign: "center",
  color: "#fff",
  fontWeight: 800,
  fontSize: 11,
  background: bg,
  borderRight: "1px solid rgba(255,255,255,0.2)",
  whiteSpace: "nowrap",
});

export const subTH = (bg) => ({
  ...thBase,
  background: bg,
  textAlign: "center",
});

// ─── DATA ENTRY PAGE ──────────────────────────────────────────────────────────
export const dataEntryGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
};

export const dataEntryPanel = {
  background: "#fff",
  borderRadius: 12,
  padding: 18,
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
};

export const dataEntryPanelHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 14,
};

export const dataEntryItem = {
  border: "1px solid #e5e7eb",
  borderRadius: 9,
  padding: "10px 12px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 8,
};

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
export const projectsPageHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  flexWrap: "wrap",
  gap: 10,
};

// ─── KPI REPORTS PAGE ─────────────────────────────────────────────────────────
export const kpiPageHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 18,
};

export const kpiOverviewCard = {
  background: "#fff",
  borderRadius: 12,
  padding: "18px 20px",
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  marginBottom: 18,
};

export const kpiMiniGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(6,1fr)",
  gap: 10,
  marginBottom: 20,
};

export const kpiMiniCard = (color) => ({
  background: color,
  borderRadius: 10,
  padding: 14,
  color: "#fff",
  textAlign: "center",
});

export const kpiDetailCard = (color) => ({
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  borderLeft: `5px solid ${color}`,
});

export const kpiIndicatorRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "9px 14px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  marginBottom: 7,
};

export const kpiEmptyState = {
  padding: "12px 20px 18px",
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#9ca3af",
};