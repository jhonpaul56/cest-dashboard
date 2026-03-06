// ─── TrainingsPage.jsx ────────────────────────────────────────────────────────
import { useState } from "react";
import { IS, LS, thBase, tdBase, modalOverlay } from "./styles";
import { COMPONENTS, COMP_COLORS, loadFromStorage, saveToStorage } from "./Utils";

// ── localStorage helpers ──
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

// ── Shared UI helpers ──
function TH({ ch, style }) {
  return <th style={{ ...thBase, ...style }}>{ch}</th>;
}
function TD({ children, style }) {
  return <td style={{ ...tdBase, ...style }}>{children}</td>;
}
function Modal({ title, onClose, children, maxWidth = 680 }) {
  return (
    <div style={modalOverlay}>
      <div style={{ background:"#fff", borderRadius:14, width:"100%", maxWidth, maxHeight:"92vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, background:"#fff", zIndex:1 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:"#1e3a8a" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#6b7280", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"18px 20px" }}>{children}</div>
      </div>
    </div>
  );
}
function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ textAlign:"center", padding:"10px 0" }}>
      <div style={{ fontSize:44, marginBottom:12 }}>🗑️</div>
      <p style={{ color:"#111827", fontSize:15, marginBottom:8, fontWeight:700 }}>Delete this record?</p>
      <p style={{ color:"#6b7280", fontSize:12, marginBottom:28 }}>{label}</p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button onClick={onCancel} style={{ background:"#f3f4f6", border:"1px solid #d1d5db", color:"#374151", borderRadius:8, padding:"10px 22px", cursor:"pointer", fontWeight:600 }}>Cancel</button>
        <button onClick={onConfirm} style={{ background:"#ef4444", border:"none", color:"#fff", borderRadius:8, padding:"10px 22px", cursor:"pointer", fontWeight:800 }}>Delete</button>
      </div>
    </div>
  );
}

// ── CEST 2.0 Components keys ──
const COMP_KEYS = ["sel","hn","hrd","drrm","bgcet","dg"];

// ── CEST 2.0 Beneficiary types (from the image) ──
const BENEF_TYPES = {
  gida:      "GIDA Communities",
  conflict:  "Communities-in-conflict",
  women:     "Women's Organization",
  ip:        "Indigenous People",
  marginal:  "Marginalized Sector",
  landless:  "Landless Rural Farmers",
  fisher:    "Artisanal Fisher folks",
};

// ─── Training Form ────────────────────────────────────────────────────────────
function TrainingForm({ initial, onSave, onCancel }) {
  const blank = {
    date: "",
    year: "",
    municipality: "",
    community: "",
    title: "",
    budget: "",
    moa: "",
    component: "",
    beneficiaryTypes: [],
    beneficiaries: { male:"", female:"", total:"" },
  };

  const [f, setF] = useState(initial ? {
    ...blank, ...initial,
    budget: initial.budget || "",
    component: initial.component || "",
    beneficiaryTypes: initial.beneficiaryTypes || [],
    beneficiaries: { ...blank.beneficiaries, ...initial.beneficiaries },
  } : blank);

  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const toggleBenef = k => set("beneficiaryTypes", f.beneficiaryTypes.includes(k) ? f.beneficiaryTypes.filter(x=>x!==k) : [...f.beneficiaryTypes,k]);

  const submit = () => {
    const e = {};
    if (!f.title.trim())    e.title    = "Required";
    if (!f.community.trim()) e.community = "Required";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave({ ...f, budget: f.budget !== "" ? Number(f.budget) : "" });
  };

  const labelStyle = { ...LS, color:"#6b7280" };

  return (
    <div>
      {/* Date / Year / Municipality */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={LS}>Date</label>
          <input type="date" value={f.date} onChange={e=>set("date",e.target.value)} style={IS}/>
        </div>
        <div>
          <label style={LS}>Year</label>
          <input type="number" value={f.year} onChange={e=>set("year", e.target.value===""?"":Number(e.target.value))} style={IS} placeholder="e.g. 2024"/>
        </div>
        <div>
          <label style={LS}>Municipality / City</label>
          <input value={f.municipality} onChange={e=>set("municipality",e.target.value)} style={IS} placeholder="Enter municipality"/>
        </div>
      </div>

      {/* Community */}
      <div style={{ marginBottom:14 }}>
        <label style={LS}>Community / Beneficiaries *</label>
        <input value={f.community} onChange={e=>set("community",e.target.value)} style={{...IS,borderColor:err.community?"#ef4444":"#d1d5db"}} placeholder="Enter community"/>
        {err.community&&<span style={{color:"#ef4444",fontSize:11}}>{err.community}</span>}
      </div>

      {/* Training Title */}
      <div style={{ marginBottom:14 }}>
        <label style={LS}>List of Trainings Conducted *</label>
        <input value={f.title} onChange={e=>set("title",e.target.value)} style={{...IS,borderColor:err.title?"#ef4444":"#d1d5db"}} placeholder="Enter training title"/>
        {err.title&&<span style={{color:"#ef4444",fontSize:11}}>{err.title}</span>}
      </div>

      {/* Budget / MOAs */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={LS}>Budget (₱)</label>
          <input type="number" value={f.budget} onChange={e=>set("budget",e.target.value)} style={IS} placeholder="0"/>
        </div>
        <div>
          <label style={LS}>MOAs</label>
          <input value={f.moa} onChange={e=>set("moa",e.target.value)} style={IS} placeholder="e.g. LGU, DA"/>
        </div>
      </div>

      {/* CEST 2.0 Components — single select */}
      <div style={{ marginBottom:14 }}>
        <label style={LS}>CEST 2.0 Components</label>
        <select value={f.component} onChange={e=>set("component",e.target.value)} style={IS}>
          <option value="">— Select Component —</option>
          {Object.entries(COMPONENTS).map(([k,v])=>(
            <option key={k} value={k}>{k.toUpperCase()} — {v}</option>
          ))}
        </select>
      </div>

      {/* CEST 2.0 Beneficiary Types */}
      <div style={{ marginBottom:14 }}>
        <label style={LS}>CEST 2.0 Beneficiaries</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {Object.entries(BENEF_TYPES).map(([k,v])=>(
            <button key={k} onClick={()=>toggleBenef(k)} style={{ background:f.beneficiaryTypes.includes(k)?"#0369a1":"#f3f4f6", border:`1px solid ${f.beneficiaryTypes.includes(k)?"#0369a1":"#d1d5db"}`, color:f.beneficiaryTypes.includes(k)?"#fff":"#374151", borderRadius:6, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* No. of Beneficiaries */}
      <div style={{ marginBottom:22 }}>
        <label style={LS}>No. of Beneficiaries</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["male","Male"],["female","Female"],["total","Total"]].map(([k,l])=>(
            <div key={k}>
              <label style={labelStyle}>{l}</label>
              <input type="number" value={f.beneficiaries[k]} min="0" onChange={e=>set("beneficiaries",{...f.beneficiaries,[k]:e.target.value===""?"":Number(e.target.value)})} style={IS} placeholder=""/>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button onClick={onCancel} style={{ background:"#f3f4f6", border:"1px solid #d1d5db", color:"#374151", borderRadius:8, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:600 }}>Cancel</button>
        <button onClick={submit} style={{ background:"#1e40af", border:"none", color:"#fff", borderRadius:8, padding:"10px 26px", cursor:"pointer", fontSize:13, fontWeight:800 }}>💾 Save Training</button>
      </div>
    </div>
  );
}

// ─── Main TrainingsPage ───────────────────────────────────────────────────────
export default function TrainingsPage() {
  const [trainings, setTrainings] = usePersistedState("cest_trainings", []);
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  const showToast = (msg, color="#16a34a") => { setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  const saveTraining = data => {
    if (data.id) {
      setTrainings(ts => ts.map(t => t.id===data.id ? data : t));
      showToast("✓ Training updated");
    } else {
      setTrainings(ts => [...ts, {...data, id: Math.max(0,...ts.map(t=>t.id))+1}]);
      showToast("✓ Training added");
    }
    setModal(null);
  };

  const deleteTraining = id => {
    setTrainings(ts => ts.filter(t => t.id!==id));
    showToast("Training deleted","#ef4444");
    setModal(null);
  };

  const years = ["All", ...Array.from(new Set(trainings.map(t=>t.year))).filter(Boolean).sort()];

  const filtered = trainings.filter(t => {
    const mSearch = !search
      || t.title?.toLowerCase().includes(search.toLowerCase())
      || t.community?.toLowerCase().includes(search.toLowerCase())
      || t.municipality?.toLowerCase().includes(search.toLowerCase());
    const mYear = yearFilter==="All" || String(t.year)===String(yearFilter);
    return mSearch && mYear;
  });

  const groupTH = (bg) => ({ padding:"6px 10px", textAlign:"center", color:"#fff", fontWeight:800, fontSize:11, background:bg, borderRight:"1px solid rgba(255,255,255,0.2)", whiteSpace:"nowrap" });
  const subTH   = (bg) => ({ ...thBase, background:bg, textAlign:"center", fontSize:10 });

  return (
    <div style={{ position:"relative" }}>
      {/* Toast */}
      {toast && <div style={{ position:"fixed", top:18, right:18, zIndex:3000, background:toast.color, color:"#fff", borderRadius:10, padding:"11px 22px", fontWeight:800, fontSize:13, boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>{toast.msg}</div>}

      {/* Modals */}
      {modal?.type==="add"    && <Modal title="➕ Add Training"  onClose={()=>setModal(null)}><TrainingForm onSave={saveTraining} onCancel={()=>setModal(null)}/></Modal>}
      {modal?.type==="edit"   && <Modal title="✏️ Edit Training" onClose={()=>setModal(null)}><TrainingForm initial={modal.data} onSave={saveTraining} onCancel={()=>setModal(null)}/></Modal>}
      {modal?.type==="delete" && <Modal title="Delete Training"  onClose={()=>setModal(null)}><ConfirmDelete label={modal.data.title} onConfirm={()=>deleteTraining(modal.data.id)} onCancel={()=>setModal(null)}/></Modal>}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:16, color:"#111827", fontWeight:900 }}>🎓 Trainings Conducted</h2>
          <p style={{ margin:"3px 0 0", fontSize:12, color:"#6b7280" }}>{trainings.length} total training records</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search training, community, municipality..." style={{...IS, minWidth:260, boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}/>
          <select value={yearFilter} onChange={e=>setYearFilter(e.target.value)} style={{...IS, width:"auto", minWidth:100}}>
            {years.map(y=><option key={y}>{y}</option>)}
          </select>
          <button onClick={()=>setModal({type:"add"})} style={{ background:"#1e40af", border:"none", color:"#fff", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>＋ Add Training</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 8px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              {/* Row 1 — group headers */}
              <tr>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center" }}>No.</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center" }}>Date / Year</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle" }}>Municipality / City</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle" }}>Community / Beneficiaries</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle" }}>List of Trainings Conducted</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center" }}>Budget</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center" }}>MOAs</th>
                {/* CEST 2.0 Components — single column */}
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center", background:"#1e3a8f", color:"#fff" }}>CEST 2.0 Components</th>
                {/* CEST 2.0 Beneficiaries group */}
                <th colSpan={Object.keys(BENEF_TYPES).length} style={groupTH("#0369a1")}>CEST 2.0 Beneficiaries</th>
                {/* No. of Beneficiaries group */}
                <th colSpan={3} style={groupTH("#166534")}>No. of Beneficiaries</th>
                <th rowSpan={2} style={{ ...thBase, verticalAlign:"middle", textAlign:"center" }}>Actions</th>
              </tr>
              {/* Row 2 — sub-headers */}
              <tr>
                {/* Beneficiary types */}
                {Object.values(BENEF_TYPES).map(v=>(
                  <th key={v} style={subTH("#0369a1")}>{v}</th>
                ))}
                {/* No. of Beneficiaries */}
                <th style={subTH("#166534")}>Male</th>
                <th style={subTH("#166534")}>Female</th>
                <th style={subTH("#166534")}>Total</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ background: i%2===0?"#fff":"#f8faff", borderBottom:"1px solid #f3f4f6" }}>
                  <TD style={{color:"#9ca3af",textAlign:"center"}}>{t.id}</TD>
                  <TD style={{textAlign:"center",fontWeight:700,color:"#1e40af",whiteSpace:"nowrap"}}>
                    {t.date ? <div style={{fontSize:11}}>{t.date}</div> : null}
                    {t.year ? <div>{t.year}</div> : null}
                  </TD>
                  <TD style={{color:"#1e40af",fontWeight:600}}>{t.municipality}</TD>
                  <TD>{t.community}</TD>
                  <TD style={{maxWidth:200}}>{t.title}</TD>
                  <TD style={{textAlign:"right",whiteSpace:"nowrap",color:"#16a34a",fontWeight:700}}>
                    {t.budget!==""&&t.budget!=null ? `₱${Number(t.budget).toLocaleString()}` : ""}
                  </TD>
                  <TD style={{textAlign:"center"}}>{t.moa}</TD>
                  <TD style={{textAlign:"center"}}>
                    {t.component ? (
                      <span style={{ background:COMP_COLORS[t.component]+"22", color:COMP_COLORS[t.component], borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>
                        {t.component.toUpperCase()} — {COMPONENTS[t.component]}
                      </span>
                    ) : ""}
                  </TD>
                  {/* Beneficiary types */}
                  {Object.keys(BENEF_TYPES).map(k=>(
                    <TD key={k} style={{textAlign:"center"}}>
                      {(t.beneficiaryTypes||[]).includes(k) ? <span style={{color:"#0369a1",fontWeight:900,fontSize:14}}>✓</span> : ""}
                    </TD>
                  ))}
                  {/* No. of Beneficiaries */}
                  <TD style={{textAlign:"center"}}>{t.beneficiaries?.male||""}</TD>
                  <TD style={{textAlign:"center"}}>{t.beneficiaries?.female||""}</TD>
                  <TD style={{textAlign:"center",fontWeight:700}}>{t.beneficiaries?.total||""}</TD>
                  {/* Actions */}
                  <TD>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>setModal({type:"edit",data:t})} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1e40af", borderRadius:5, padding:"3px 8px", fontSize:11, cursor:"pointer" }}>Edit</button>
                      <button onClick={()=>setModal({type:"delete",data:t})} style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", borderRadius:5, padding:"3px 8px", fontSize:11, cursor:"pointer" }}>Del</button>
                    </div>
                  </TD>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={7+1+Object.keys(BENEF_TYPES).length+3+1} style={{ padding:32, textAlign:"center", color:"#9ca3af" }}>No training records found.</td></tr>
              )}
            </tbody>

            {/* Footer totals */}
            <tfoot>
              <tr style={{ background:"#1e3a5f", color:"#fff", fontWeight:800 }}>
                <td colSpan={5} style={{ padding:"8px 10px", fontSize:12 }}>Total No. of Trainings Conducted: {filtered.length}</td>
                <td style={{ padding:"8px 10px", fontSize:12, textAlign:"right" }}>
                  ₱{filtered.reduce((s,t)=>s+Number(t.budget||0),0).toLocaleString()}
                </td>
                <td colSpan={1+Object.keys(BENEF_TYPES).length+4} style={{ padding:"8px 10px" }}/>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}