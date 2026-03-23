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
  padding: "10px 12px",
  textAlign: "center",
  verticalAlign: "middle",
  color: "#fff",
  fontWeight: 700,
  fontSize: 11,
  background: "#1e3a5f",
  borderRight: "1px solid #2d5282",
  whiteSpace: "nowrap",
};

export const tdBase = {
  padding: "9px 12px",
  fontSize: 12,
  color: "#111827",
  borderBottom: "1px solid #e5e7eb",
  borderRight: "1px solid #f3f4f6",
  verticalAlign: "middle",
  textAlign: "left",
};

export const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

// ─── GLOBAL CSS STRING ────────────────────────────────────────────────────────
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

  /* ── Table base alignment ── */
  .cest-table th {
    text-align: center !important;
    vertical-align: middle !important;
    padding: 10px 12px !important;
    white-space: nowrap;
  }
  .cest-table td {
    vertical-align: middle !important;
    padding: 9px 12px !important;
  }
  /* Left-align text columns */
  .cest-table td.col-text {
    text-align: left !important;
  }
  /* Center-align checkbox/number columns */
  .cest-table td.col-center {
    text-align: center !important;
  }
  /* Right-align currency columns */
  .cest-table td.col-right {
    text-align: right !important;
  }

  /* ── Responsive sidebar ── */
  @media (max-width: 1024px) {
    .cest-sidebar {
      position: fixed !important;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.25s ease !important;
      z-index: 1500 !important;
      box-shadow: 4px 0 24px rgba(0,0,0,0.18) !important;
    }
    .cest-sidebar.open {
      transform: translateX(0) !important;
    }
    .cest-hamburger {
      display: flex !important;
    }
    .cest-top-stats {
      display: none !important;
    }
  }
  @media (min-width: 1025px) {
    .cest-hamburger {
      display: none !important;
    }
    .cest-overlay {
      display: none !important;
    }
  }

  /* ── Responsive grids ── */
  @media (max-width: 1024px) {
    .cest-summary-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .cest-chart-grid {
      grid-template-columns: 1fr !important;
    }
    .cest-data-entry-grid {
      grid-template-columns: 1fr !important;
    }
    .cest-kpi-mini-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .cest-filter-bar {
      flex-direction: column !important;
    }
    .cest-filter-bar input,
    .cest-filter-bar select {
      width: 100% !important;
      min-width: unset !important;
    }
  }
  @media (max-width: 640px) {
    .cest-summary-grid {
      grid-template-columns: 1fr !important;
    }
    .cest-kpi-mini-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── APP WRAPPER ──────────────────────────────────────────────────────────────
export const appWrapper = {
  display: "flex",
  height: "100vh",
  fontFamily: "'Segoe UI',system-ui,sans-serif",
  background: "#eff6ff",
  overflow: "hidden",
  position: "relative",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
export const toastStyle = (color) => ({
  position: "fixed",
  top: 18,
  right: 18,
  zIndex: 4000,
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
  minWidth: 220,
  background: "#fff",
  borderRight: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
  zIndex: 100,
  transition: "transform 0.25s ease",
  overflowY: "auto",
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
  transition: "background 0.2s ease, color 0.2s ease, border-left 0.2s ease, padding-left 0.2s ease",
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
  padding: "0 20px",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  zIndex: 10,
  gap: 12,
};

export const topBarTitle = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
  color: "#fff",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const topBarRight = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexShrink: 0,
};

export const topBarStats = {
  color: "rgba(255,255,255,0.65)",
  fontSize: 12,
  marginRight: 4,
  whiteSpace: "nowrap",
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
  flexShrink: 0,
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
  minWidth: 0,
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

// ─── SETTINGS ────────────────────────────────────────────────────────────────
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

export const settingsDangerBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 8,
  padding: "12px 14px",
};

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
export const notifPanel = {
  position: "fixed",
  top: 64,
  right: 16,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  zIndex: 3000,
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
    width: 34, height: 34, borderRadius: 8,
    background: s.bg, border: `1px solid ${s.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0,
  };
};

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
export const settingsPanel = {
  position: "fixed",
  top: 64,
  right: 16,
  width: 380,
  maxWidth: "calc(100vw - 32px)",
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  zIndex: 3000,
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

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
export const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
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

export const filterBarRow = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
  flexWrap: "wrap",
  alignItems: "center",
};

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
  minWidth: 0,
};

export const chartCardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
};

// ─── TABLE ────────────────────────────────────────────────────────────────────
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
  flexWrap: "wrap",
  gap: 8,
};

export const tableFooterRow = {
  background: "#1e3a5f",
  color: "#fff",
  fontWeight: 800,
};

export const groupTH = (bg) => ({
  padding: "8px 12px",
  textAlign: "center",
  verticalAlign: "middle",
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
  verticalAlign: "middle",
  fontSize: 10,
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
  minWidth: 0,
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
  flexWrap: "wrap",
  gap: 10,
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
  gridTemplateColumns: "repeat(6, 1fr)",
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