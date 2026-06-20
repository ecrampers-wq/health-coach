import { useState, useEffect, useCallback } from "react";

// ─── PLAN TARGETS (from the coaching dashboard) ───────────────────────────────
const PLAN = {
  calories: 2500,
  protein: 180,
  carbs: 235,
  fat: 78,
  sleep: 7.75, // 7h45m
  steps: 8000,
  weight_target: 79, // goal weight kg
  workouts_per_week: 3,
  zone2_sessions_per_week: 3,
  zone2_hr_max: 145,
  zone2_hr_min: 125,
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(d) {
  const date = new Date(d);
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function weekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch { return init; }
  });
  const save = useCallback((v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, save];
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dumbbell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M6 8H2v8h4M22 8h-4v8h4M9 12h6"/></svg>,
    run: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="1.5"/><path d="M17 9l-4-4.5L9 9l-2 5h4l2 4.5M13 9l1 4-4 2"/></svg>,
    bike: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 000-2h-3l-4.5 11.5M12 17.5l-2.5-6.5H15"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>,
    food: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>,
    scale: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 20h20L12 3z"/><path d="M12 8v6M9 14h6"/></svg>,
    steps: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l3-10 3 3 3-8M3 18h18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a2.5 2.5 0 015 0c1.5 0 2.5 1 2.5 2.5 1.5.5 2.5 1.8 2.5 3.5 0 1-.3 1.8-.8 2.5.5.7.8 1.5.8 2.5 0 2-1.5 3.5-3 4V19h-6v-1.5C8.5 16.5 7 15 7 13c0-1 .3-1.8.8-2.5C7.3 9.8 7 9 7 8c0-1.7 1-3 2.5-3.5C9.5 3 10.5 2 12 2"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    arrow_left: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 15 8 19"/><polyline points="16 15 16 19"/><line x1="5" y1="19" x2="19" y2="19"/><path d="M7.5 15C5 15 3 13 3 10.5V5h18v5.5C21 13 19 15 16.5 15h-9z"/><path d="M3 8H1M21 8h2"/></svg>,
  };
  return icons[name] || null;
};

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0F14",
  surface: "#161922",
  card: "#1C2130",
  border: "#252C3E",
  accent: "#4F8EF7",
  accentDim: "#1E2D4A",
  green: "#3DD68C",
  greenDim: "#1A3529",
  orange: "#F7854F",
  orangeDim: "#3A2015",
  red: "#EF4444",
  redDim: "#2D1414",
  purple: "#A78BFA",
  purpleDim: "#281E42",
  yellow: "#FBBF24",
  yellowDim: "#2E2208",
  text: "#E8EAF0",
  textSub: "#7C87A0",
  textDim: "#3D4761",
};

// ─── SCORE ENGINE ─────────────────────────────────────────────────────────────
function scoreDay(day) {
  const scores = {};
  // Sleep
  if (day.sleep) {
    const h = day.sleep.hours + (day.sleep.minutes || 0) / 60;
    scores.sleep = Math.min(100, Math.round((h / PLAN.sleep) * 100));
  }
  // Nutrition
  if (day.nutrition) {
    const cal = Math.min(100, Math.round((day.nutrition.calories / PLAN.calories) * 100));
    const pro = Math.min(100, Math.round((day.nutrition.protein / PLAN.protein) * 100));
    const fat = day.nutrition.fat > PLAN.fat * 1.2 ? 70 : 100;
    scores.nutrition = Math.round((cal + pro + fat) / 3);
  }
  // Steps
  if (day.steps != null) {
    scores.steps = Math.min(100, Math.round((day.steps / PLAN.steps) * 100));
  }
  // Weight (just record, no score)
  // Workouts
  if (day.workouts && day.workouts.length > 0) scores.lifting = 100;
  // Cardio (runs + rides)
  if (day.cardio && day.cardio.length > 0) {
    const zone2 = day.cardio.filter(c => c.avgHR >= PLAN.zone2_hr_min && c.avgHR <= PLAN.zone2_hr_max);
    scores.cardio = zone2.length > 0 ? 100 : 60; // partial credit if cardio done but not zone2
  }
  const vals = Object.values(scores);
  scores.overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  return scores;
}

function scoreWeek(days) {
  const liftDays = days.filter(d => d.workouts && d.workouts.length > 0).length;
  const zone2Days = days.filter(d => d.cardio && d.cardio.some(c => c.avgHR >= PLAN.zone2_hr_min && c.avgHR <= PLAN.zone2_hr_max)).length;
  const sleepAvg = days.filter(d => d.sleep).map(d => d.sleep.hours + (d.sleep.minutes || 0) / 60);
  const avgSleep = sleepAvg.length ? sleepAvg.reduce((a, b) => a + b, 0) / sleepAvg.length : 0;
  const calAvg = days.filter(d => d.nutrition).map(d => d.nutrition.calories);
  const avgCal = calAvg.length ? calAvg.reduce((a, b) => a + b, 0) / calAvg.length : 0;
  return { liftDays, zone2Days, avgSleep, avgCal };
}

// ─── FEEDBACK ENGINE ──────────────────────────────────────────────────────────
function feedback(day, scores) {
  const msgs = [];
  if (scores.sleep != null) {
    const h = day.sleep.hours + (day.sleep.minutes || 0) / 60;
    if (h >= PLAN.sleep) msgs.push({ type: "green", text: `Sleep: ${h.toFixed(1)}h logged — testosterone and cortisol recovery on track. ✓` });
    else if (h >= PLAN.sleep - 1) msgs.push({ type: "yellow", text: `Sleep: ${h.toFixed(1)}h — close to target. Even 20 extra minutes compounds over weeks.` });
    else msgs.push({ type: "red", text: `Sleep: ${h.toFixed(1)}h is ${(PLAN.sleep - h).toFixed(1)}h short. This elevates cortisol and suppresses testosterone. Prioritize tonight.` });
  }
  if (scores.nutrition != null) {
    const n = day.nutrition;
    if (n.protein >= PLAN.protein) msgs.push({ type: "green", text: `Protein: ${n.protein}g — muscle preservation target hit. ✓` });
    else msgs.push({ type: "orange", text: `Protein: ${n.protein}g of ${PLAN.protein}g target. ${PLAN.protein - n.protein}g short — add a protein source to your next meal.` });
    const diff = n.calories - PLAN.calories;
    if (Math.abs(diff) <= 150) msgs.push({ type: "green", text: `Calories: ${n.calories} kcal — on target for fat loss. ✓` });
    else if (diff > 150) msgs.push({ type: "orange", text: `Calories: ${n.calories} kcal — ${diff} over target. This slows your cut. Tighten tomorrow.` });
    else msgs.push({ type: "yellow", text: `Calories: ${n.calories} kcal — ${Math.abs(diff)} under target. Don't undereat; you'll lose muscle.` });
  }
  if (scores.steps != null) {
    if (day.steps >= PLAN.steps) msgs.push({ type: "green", text: `Steps: ${day.steps.toLocaleString()} — NEAT target met. ✓` });
    else msgs.push({ type: "yellow", text: `Steps: ${day.steps.toLocaleString()} of ${PLAN.steps.toLocaleString()} — ${(PLAN.steps - day.steps).toLocaleString()} to go. Take a post-dinner walk.` });
  }
  if (day.cardio && day.cardio.length > 0) {
    day.cardio.forEach(c => {
      const isZ2 = c.avgHR >= PLAN.zone2_hr_min && c.avgHR <= PLAN.zone2_hr_max;
      const isHigh = c.avgHR > PLAN.zone2_hr_max;
      if (isZ2) msgs.push({ type: "green", text: `${c.type === "run" ? "Run" : "Ride"}: ${c.duration} min at ${c.avgHR} bpm — perfect Zone 2. Mitochondrial biogenesis happening. ✓` });
      else if (isHigh) msgs.push({ type: "orange", text: `${c.type === "run" ? "Run" : "Ride"}: ${c.avgHR} bpm is Zone ${c.avgHR > 172 ? "5" : "4"} — above longevity-optimal. Next session, slow down to 130–145 bpm.` });
      else msgs.push({ type: "yellow", text: `${c.type === "run" ? "Run" : "Ride"}: ${c.duration} min at ${c.avgHR} bpm — recovery pace. Good.` });
    });
  }
  if (day.workouts && day.workouts.length > 0) {
    msgs.push({ type: "green", text: `Strength session logged: ${day.workouts.map(w => w.exercise).join(", ")}. Progressive overload on track.` });
  }
  if (msgs.length === 0) msgs.push({ type: "textSub", text: "Log today's data to get personalized feedback." });
  return msgs;
}

// ─── MINI COMPONENTS ──────────────────────────────────────────────────────────
const Ring = ({ pct, size = 60, stroke = 5, color = C.accent, label, sublabel }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(pct, 100) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      {label && <div style={{ fontSize: 11, color: C.textSub, textAlign: "center", lineHeight: 1.3 }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 10, color: C.textDim, textAlign: "center" }}>{sublabel}</div>}
    </div>
  );
};

const Bar = ({ pct, color = C.accent, height = 6 }) => (
  <div style={{ background: C.border, borderRadius: 99, height, overflow: "hidden", flexShrink: 0 }}>
    <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
  </div>
);

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? C.green : score >= 60 ? C.yellow : C.orange;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: color + "22", color }}>{score}%</span>;
};

const Input = ({ label, type = "number", value, onChange, min, max, step, placeholder, unit, small }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input type={type} value={value} onChange={e => onChange(type === "number" ? +e.target.value : e.target.value)}
        min={min} max={max} step={step} placeholder={placeholder}
        style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: small ? "6px 10px" : "9px 12px",
          color: C.text, fontSize: small ? 13 : 15, outline: "none", width: "100%" }} />
      {unit && <span style={{ fontSize: 12, color: C.textSub, whiteSpace: "nowrap" }}>{unit}</span>}
    </div>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled }) => {
  const styles = {
    primary: { bg: C.accent, color: "#fff", border: "none" },
    ghost: { bg: "transparent", color: C.textSub, border: `1px solid ${C.border}` },
    danger: { bg: C.redDim, color: C.red, border: `1px solid ${C.red}44` },
    success: { bg: C.greenDim, color: C.green, border: `1px solid ${C.green}44` },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: s.bg, color: s.color, border: s.border, borderRadius: 8, padding: size === "sm" ? "5px 12px" : "9px 18px",
        fontSize: size === "sm" ? 12 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        display: "inline-flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
};

const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, children, color = C.accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <span style={{ color }}><Icon name={icon} size={16} /></span>
    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</span>
  </div>
);

// ─── MODALS / PANELS ──────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", border: `1px solid ${C.border}`, padding: "24px 20px", width: "100%", maxWidth: 600, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ background: C.card, border: "none", borderRadius: 8, color: C.textSub, padding: "5px 8px", cursor: "pointer" }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── LOG PANELS ───────────────────────────────────────────────────────────────
function SleepPanel({ data, onSave }) {
  const [h, setH] = useState(data?.hours ?? 7);
  const [m, setM] = useState(data?.minutes ?? 30);
  const [qual, setQual] = useState(data?.quality ?? 3);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Hours" value={h} onChange={setH} min={0} max={12} step={1} unit="hrs" />
        <Input label="Minutes" value={m} onChange={setM} min={0} max={59} step={5} unit="min" />
      </div>
      <div>
        <label style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Sleep Quality</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setQual(n)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: qual === n ? C.accentDim : C.surface,
                border: `1px solid ${qual === n ? C.accent : C.border}`, color: qual === n ? C.accent : C.textSub,
                fontSize: 15, cursor: "pointer" }}>{"⭐".slice(0, n > 0 ? 1 : 0).repeat(n)}{n}</button>
          ))}
        </div>
      </div>
      <Btn onClick={() => onSave({ hours: h, minutes: m, quality: qual })}>Save Sleep</Btn>
    </div>
  );
}

function NutritionPanel({ data, onSave }) {
  const [cal, setCal] = useState(data?.calories ?? "");
  const [pro, setPro] = useState(data?.protein ?? "");
  const [carb, setCarb] = useState(data?.carbs ?? "");
  const [fat, setFat] = useState(data?.fat ?? "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: C.card, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 11, color: C.textSub, marginBottom: 8 }}>TARGETS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, textAlign: "center" }}>
          {[["Kcal", PLAN.calories], ["Protein", PLAN.protein+"g"], ["Carbs", PLAN.carbs+"g"], ["Fat", PLAN.fat+"g"]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{v}</div><div style={{ fontSize: 11, color: C.textSub }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Calories" value={cal} onChange={setCal} unit="kcal" />
        <Input label="Protein" value={pro} onChange={setPro} unit="g" />
        <Input label="Carbs" value={carb} onChange={setCarb} unit="g" />
        <Input label="Fat" value={fat} onChange={setFat} unit="g" />
      </div>
      <Btn onClick={() => onSave({ calories: +cal, protein: +pro, carbs: +carb, fat: +fat })}>Save Nutrition</Btn>
    </div>
  );
}

function CardioPanel({ data, onSave }) {
  const [type, setType] = useState("run");
  const [dist, setDist] = useState("");
  const [dur, setDur] = useState("");
  const [hr, setHR] = useState("");
  const [note, setNote] = useState("");
  const sessions = data || [];

  const add = () => {
    if (!dur || !hr) return;
    onSave([...sessions, { type, distance: +dist, duration: +dur, avgHR: +hr, note, id: Date.now() }]);
    setDist(""); setDur(""); setHR(""); setNote("");
  };

  const remove = (id) => onSave(sessions.filter(s => s.id !== id));

  const hrColor = (h) => h >= PLAN.zone2_hr_min && h <= PLAN.zone2_hr_max ? C.green : h > PLAN.zone2_hr_max ? C.orange : C.textSub;
  const hrLabel = (h) => h >= PLAN.zone2_hr_min && h <= PLAN.zone2_hr_max ? "Zone 2 ✓" : h > PLAN.zone2_hr_max ? `Zone ${h > 172 ? "5" : "4"} ↑` : "Zone 1";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["run", "bike"].map(t => (
          <button key={t} onClick={() => setType(t)}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: type === t ? C.accentDim : C.surface,
              border: `1px solid ${type === t ? C.accent : C.border}`, color: type === t ? C.accent : C.textSub,
              fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icon name={t === "run" ? "run" : "bike"} size={14} />{t === "run" ? "Run" : "Bike Ride"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Input label="Distance" value={dist} onChange={setDist} unit="km" />
        <Input label="Duration" value={dur} onChange={setDur} unit="min" />
        <Input label="Avg HR" value={hr} onChange={setHR} unit="bpm" />
      </div>
      {hr > 0 && (
        <div style={{ background: C.surface, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.textSub }}>Zone 2 target: 125–145 bpm</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: hrColor(+hr) }}>{hrLabel(+hr)}</span>
        </div>
      )}
      <Input label="Note (optional)" type="text" value={note} onChange={setNote} placeholder="How did it feel?" />
      <Btn onClick={add}><Icon name="plus" size={14} />Add Session</Btn>

      {sessions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase" }}>Today's Sessions</div>
          {sessions.map(s => (
            <div key={s.id} style={{ background: C.surface, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={s.type === "run" ? "run" : "bike"} size={13} color={C.accent} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.type === "run" ? "Run" : "Ride"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: hrColor(s.avgHR), marginLeft: 4 }}>{hrLabel(s.avgHR)}</span>
                </div>
                <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>
                  {s.distance > 0 ? `${s.distance} km · ` : ""}{s.duration} min · {s.avgHR} bpm avg
                </div>
              </div>
              <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EXERCISES_DB = ["Pull-ups (weighted)", "Dips (weighted)", "Barbell Row", "Overhead Press", "Bench Press", "Romanian Deadlift", "Bulgarian Split Squat", "Lat Pulldown", "Cable Row", "Push-up", "Squat", "Deadlift", "Incline Press", "Face Pull", "Tricep Dip", "Bicep Curl", "Leg Press", "Other"];

function LiftingPanel({ data, onSave }) {
  const [exercise, setExercise] = useState(EXERCISES_DB[0]);
  const [custom, setCustom] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const workouts = data || [];

  const addSet = () => setSets([...sets, { reps: "", weight: "" }]);
  const updateSet = (i, k, v) => { const s = [...sets]; s[i][k] = v; setSets(s); };
  const removeSet = (i) => setSets(sets.filter((_, idx) => idx !== i));

  const addExercise = () => {
    const name = exercise === "Other" ? custom : exercise;
    if (!name || sets.every(s => !s.reps)) return;
    const entry = { exercise: name, sets: sets.filter(s => s.reps), id: Date.now() };
    onSave([...workouts, entry]);
    setSets([{ reps: "", weight: "" }]);
    setCustom("");
  };
  const removeEx = (id) => onSave(workouts.filter(w => w.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Exercise</label>
        <select value={exercise} onChange={e => setExercise(e.target.value)}
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 14, outline: "none" }}>
          {EXERCISES_DB.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        {exercise === "Other" && (
          <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Exercise name"
            style={{ marginTop: 8, width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        )}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sets</label>
          <Btn variant="ghost" size="sm" onClick={addSet}><Icon name="plus" size={12} />Add Set</Btn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sets.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: C.textDim, width: 22, textAlign: "center", flexShrink: 0 }}>{i + 1}</div>
              <input type="number" value={s.reps} onChange={e => updateSet(i, "reps", e.target.value)} placeholder="Reps"
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 14, outline: "none" }} />
              <input type="number" value={s.weight} onChange={e => updateSet(i, "weight", e.target.value)} placeholder="kg"
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 14, outline: "none" }} />
              <span style={{ fontSize: 11, color: C.textSub, width: 20 }}>kg</span>
              {sets.length > 1 && (
                <button onClick={() => removeSet(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}><Icon name="x" size={13} /></button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Btn onClick={addExercise}><Icon name="plus" size={14} />Add Exercise</Btn>

      {workouts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase" }}>Today's Lifts</div>
          {workouts.map(w => (
            <div key={w.id} style={{ background: C.surface, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{w.exercise}</div>
                <button onClick={() => removeEx(w.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim }}><Icon name="trash" size={13} /></button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {w.sets.map((s, i) => (
                  <span key={i} style={{ fontSize: 12, background: C.card, borderRadius: 6, padding: "3px 8px", color: C.textSub }}>
                    {s.reps} reps{s.weight ? ` × ${s.weight}kg` : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepsWeightPanel({ steps, weight, onSave }) {
  const [s, setS] = useState(steps ?? "");
  const [w, setW] = useState(weight ?? "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Input label="Step Count" value={s} onChange={setS} unit="steps" />
      <div style={{ background: C.card, borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.textSub }}>Daily target</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{PLAN.steps.toLocaleString()} steps</span>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
        <Input label="Body Weight" value={w} onChange={setW} unit="kg" step={0.1} />
        <div style={{ fontSize: 12, color: C.textSub, marginTop: 6 }}>
          Current: 85 kg → Goal: {PLAN.weight_target} kg
        </div>
      </div>
      <Btn onClick={() => onSave({ steps: +s || null, weight: +w || null })}>Save</Btn>
    </div>
  );
}

// ─── TODAY VIEW ───────────────────────────────────────────────────────────────
function TodayView({ today, onUpdate }) {
  const [modal, setModal] = useState(null);
  const scores = scoreDay(today);
  const msgs = feedback(today, scores);

  const modules = [
    { key: "sleep", label: "Sleep", icon: "moon", color: C.purple, score: scores.sleep,
      summary: today.sleep ? `${today.sleep.hours}h ${today.sleep.minutes || 0}m` : null, target: `${PLAN.sleep}h target` },
    { key: "nutrition", label: "Nutrition", icon: "food", color: C.green, score: scores.nutrition,
      summary: today.nutrition ? `${today.nutrition.calories} kcal · ${today.nutrition.protein}g protein` : null, target: `${PLAN.calories} kcal · ${PLAN.protein}g protein` },
    { key: "lifting", label: "Lifting", icon: "dumbbell", color: C.accent, score: scores.lifting,
      summary: today.workouts?.length > 0 ? `${today.workouts.length} exercise${today.workouts.length > 1 ? "s" : ""}` : null, target: "3× per week" },
    { key: "cardio", label: "Cardio", icon: "run", color: C.orange, score: scores.cardio,
      summary: today.cardio?.length > 0 ? `${today.cardio.length} session${today.cardio.length > 1 ? "s" : ""}` : null, target: "Zone 2: 125–145 bpm" },
    { key: "steps", label: "Steps", icon: "steps", color: C.yellow, score: scores.steps,
      summary: today.steps ? today.steps.toLocaleString() : null, target: `${PLAN.steps.toLocaleString()} steps` },
  ];

  const openModal = (key) => {
    const modalMap = {
      sleep: "sleep", nutrition: "nutrition", lifting: "lifting", cardio: "cardio", steps: "steps"
    };
    setModal(modalMap[key]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Date + overall score */}
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{fmt(todayKey())}</div>
          <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>Daily tracking</div>
        </div>
        {scores.overall > 0 && (
          <div style={{ textAlign: "center" }}>
            <Ring pct={scores.overall} size={64} stroke={6} color={scores.overall >= 75 ? C.green : scores.overall >= 50 ? C.yellow : C.orange} />
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 4 }}>Today's score</div>
          </div>
        )}
      </Card>

      {/* Tracking modules */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {modules.map(m => (
          <button key={m.key} onClick={() => openModal(m.key)}
            style={{ background: C.card, border: `1px solid ${m.score != null ? m.color + "44" : C.border}`, borderRadius: 14, padding: "14px 16px",
              cursor: "pointer", textAlign: "left", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ background: m.color + "22", borderRadius: 8, padding: 7 }}><Icon name={m.icon} size={16} color={m.color} /></div>
              {m.score != null && <ScoreBadge score={m.score} />}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.label}</div>
            <div style={{ fontSize: 11, color: m.summary ? m.color : C.textDim, marginTop: 3 }}>
              {m.summary || m.target}
            </div>
            {m.score != null && <Bar pct={m.score} color={m.score >= 80 ? C.green : m.score >= 60 ? C.yellow : C.orange} height={3} />}
            {m.score == null && <div style={{ fontSize: 10, color: C.textDim, marginTop: 8 }}>Tap to log →</div>}
          </button>
        ))}
        {/* Weight card - separate */}
        <button onClick={() => setModal("steps")}
          style={{ background: C.card, border: `1px solid ${today.weight ? C.green + "44" : C.border}`, borderRadius: 14, padding: "14px 16px",
            cursor: "pointer", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ background: C.orange + "22", borderRadius: 8, padding: 7 }}><Icon name="scale" size={16} color={C.orange} /></div>
            {today.weight && <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{today.weight} kg</span>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Weight</div>
          <div style={{ fontSize: 11, color: today.weight ? C.green : C.textDim, marginTop: 3 }}>
            {today.weight ? `${(today.weight - PLAN.weight_target).toFixed(1)} kg to goal` : "Goal: " + PLAN.weight_target + " kg"}
          </div>
        </button>
      </div>

      {/* Feedback */}
      {msgs.length > 0 && (
        <Card>
          <SectionTitle icon="brain" color={C.accent}>Coach Feedback</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((m, i) => {
              const col = m.type === "green" ? C.green : m.type === "yellow" ? C.yellow : m.type === "orange" ? C.orange : m.type === "red" ? C.red : C.textSub;
              const bg = m.type === "green" ? C.greenDim : m.type === "yellow" ? C.yellowDim : m.type === "orange" ? C.orangeDim : m.type === "red" ? C.redDim : C.surface;
              return (
                <div key={i} style={{ background: bg, borderRadius: 10, padding: "10px 13px", borderLeft: `3px solid ${col}` }}>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{m.text}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal open={modal === "sleep"} onClose={() => setModal(null)} title="Log Sleep">
        <SleepPanel data={today.sleep} onSave={d => { onUpdate({ ...today, sleep: d }); setModal(null); }} />
      </Modal>
      <Modal open={modal === "nutrition"} onClose={() => setModal(null)} title="Log Nutrition">
        <NutritionPanel data={today.nutrition} onSave={d => { onUpdate({ ...today, nutrition: d }); setModal(null); }} />
      </Modal>
      <Modal open={modal === "lifting"} onClose={() => setModal(null)} title="Log Lifting Session">
        <LiftingPanel data={today.workouts} onSave={d => { onUpdate({ ...today, workouts: d }); }} />
      </Modal>
      <Modal open={modal === "cardio"} onClose={() => setModal(null)} title="Log Cardio">
        <CardioPanel data={today.cardio} onSave={d => { onUpdate({ ...today, cardio: d }); }} />
      </Modal>
      <Modal open={modal === "steps"} onClose={() => setModal(null)} title="Log Steps & Weight">
        <StepsWeightPanel steps={today.steps} weight={today.weight}
          onSave={d => { onUpdate({ ...today, steps: d.steps ?? today.steps, weight: d.weight ?? today.weight }); setModal(null); }} />
      </Modal>
    </div>
  );
}

// ─── WEEKLY RECAP ─────────────────────────────────────────────────────────────
function WeeklyRecap({ allDays }) {
  const today = todayKey();
  const ws = weekStart(today);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const days = weekDates.map(k => ({ date: k, ...(allDays[k] || {}) }));
  const stats = scoreWeek(days);

  const weights = days.filter(d => d.weight).map(d => ({ date: d.date, w: d.weight }));
  const sleepData = days.filter(d => d.sleep).map(d => ({ date: d.date, h: d.sleep.hours + (d.sleep.minutes || 0) / 60 }));

  const recapMsgs = [];
  if (stats.liftDays >= PLAN.workouts_per_week) recapMsgs.push({ type: "green", text: `Strength: ${stats.liftDays}/${PLAN.workouts_per_week} sessions completed. Weekly strength target hit. ✓` });
  else recapMsgs.push({ type: "orange", text: `Strength: ${stats.liftDays}/${PLAN.workouts_per_week} sessions this week. ${PLAN.workouts_per_week - stats.liftDays} more needed.` });

  if (stats.zone2Days >= PLAN.zone2_sessions_per_week) recapMsgs.push({ type: "green", text: `Zone 2 cardio: ${stats.zone2Days}/${PLAN.zone2_sessions_per_week} sessions in range. Mitochondrial base building. ✓` });
  else recapMsgs.push({ type: "orange", text: `Zone 2: ${stats.zone2Days}/${PLAN.zone2_sessions_per_week} sessions this week. Focus on 125–145 bpm runs.` });

  if (stats.avgSleep >= PLAN.sleep) recapMsgs.push({ type: "green", text: `Sleep avg: ${stats.avgSleep.toFixed(1)}h — hormonal recovery on track. ✓` });
  else if (stats.avgSleep > 0) recapMsgs.push({ type: "red", text: `Sleep avg: ${stats.avgSleep.toFixed(1)}h — below ${PLAN.sleep}h target. This is your top anti-aging priority.` });

  if (stats.avgCal > 0) {
    const diff = Math.round(stats.avgCal - PLAN.calories);
    if (Math.abs(diff) <= 150) recapMsgs.push({ type: "green", text: `Avg calories: ${Math.round(stats.avgCal)} kcal — on target. Fat loss deficit maintained. ✓` });
    else if (diff > 150) recapMsgs.push({ type: "yellow", text: `Avg calories: ${Math.round(stats.avgCal)} kcal — ${diff} over target. This slows your cut by ~${(diff * 7 / 7700 * 1000).toFixed(0)}g/week.` });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 4 }}>This Week</div>
        <div style={{ fontSize: 13, color: C.textSub }}>w/c {fmt(ws)}</div>
      </Card>

      {/* Day grid */}
      <Card>
        <SectionTitle icon="chart" color={C.accent}>Daily Overview</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {days.map((d, i) => {
            const sc = scoreDay(d);
            const isToday = d.date === today;
            const col = sc.overall >= 80 ? C.green : sc.overall >= 50 ? C.yellow : sc.overall > 0 ? C.orange : C.textDim;
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textSub, marginBottom: 4 }}>{DAYS[new Date(d.date).getDay()]}</div>
                <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? C.accent : C.textSub, marginBottom: 6 }}>
                  {new Date(d.date).getDate()}
                </div>
                <Ring pct={sc.overall || 0} size={36} stroke={4} color={col}
                  label={sc.overall > 0 ? `${sc.overall}%` : "–"} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>LIFTING SESSIONS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: stats.liftDays >= PLAN.workouts_per_week ? C.green : C.orange }}>
            {stats.liftDays}<span style={{ fontSize: 16, color: C.textSub }}>/{PLAN.workouts_per_week}</span>
          </div>
          <Bar pct={stats.liftDays / PLAN.workouts_per_week * 100} color={stats.liftDays >= PLAN.workouts_per_week ? C.green : C.orange} />
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>ZONE 2 SESSIONS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: stats.zone2Days >= PLAN.zone2_sessions_per_week ? C.green : C.orange }}>
            {stats.zone2Days}<span style={{ fontSize: 16, color: C.textSub }}>/{PLAN.zone2_sessions_per_week}</span>
          </div>
          <Bar pct={stats.zone2Days / PLAN.zone2_sessions_per_week * 100} color={stats.zone2Days >= PLAN.zone2_sessions_per_week ? C.green : C.orange} />
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>AVG SLEEP</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: stats.avgSleep >= PLAN.sleep ? C.green : stats.avgSleep > 0 ? C.red : C.textDim }}>
            {stats.avgSleep > 0 ? stats.avgSleep.toFixed(1) : "—"}<span style={{ fontSize: 14, color: C.textSub }}>h</span>
          </div>
          <Bar pct={stats.avgSleep / PLAN.sleep * 100} color={stats.avgSleep >= PLAN.sleep ? C.green : C.red} />
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>AVG CALORIES</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: stats.avgCal > 0 && Math.abs(stats.avgCal - PLAN.calories) <= 150 ? C.green : stats.avgCal > 0 ? C.yellow : C.textDim }}>
            {stats.avgCal > 0 ? Math.round(stats.avgCal) : "—"}<span style={{ fontSize: 14, color: C.textSub }}>kcal</span>
          </div>
          {stats.avgCal > 0 && <Bar pct={Math.min((stats.avgCal / PLAN.calories) * 100, 130)} color={Math.abs(stats.avgCal - PLAN.calories) <= 150 ? C.green : C.yellow} />}
        </Card>
      </div>

      {/* Weight trend */}
      {weights.length >= 2 && (
        <Card>
          <SectionTitle icon="scale" color={C.orange}>Weight Trend</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {weights.map((w, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 8, padding: "7px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textSub }}>{DAYS[new Date(w.date).getDay()]}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{w.w} kg</div>
              </div>
            ))}
          </div>
          {weights.length >= 2 && (
            <div style={{ marginTop: 10, fontSize: 13, color: C.textSub }}>
              Δ this week: <span style={{ fontWeight: 700, color: weights[weights.length-1].w < weights[0].w ? C.green : C.orange }}>
                {(weights[weights.length-1].w - weights[0].w).toFixed(1)} kg
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Coach recap */}
      <Card>
        <SectionTitle icon="brain" color={C.accent}>Weekly Coach Summary</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recapMsgs.map((m, i) => {
            const col = m.type === "green" ? C.green : m.type === "yellow" ? C.yellow : m.type === "orange" ? C.orange : C.red;
            const bg = m.type === "green" ? C.greenDim : m.type === "yellow" ? C.yellowDim : m.type === "orange" ? C.orangeDim : C.redDim;
            return (
              <div key={i} style={{ background: bg, borderRadius: 10, padding: "10px 13px", borderLeft: `3px solid ${col}` }}>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{m.text}</div>
              </div>
            );
          })}
          {recapMsgs.length === 0 && <div style={{ fontSize: 13, color: C.textSub }}>Log data throughout the week to get your weekly recap.</div>}
        </div>
      </Card>
    </div>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ allDays }) {
  const keys = Object.keys(allDays).sort().reverse().slice(0, 30);
  if (keys.length === 0) return (
    <Card><div style={{ textAlign: "center", padding: 40, color: C.textSub, fontSize: 14 }}>No history yet. Start logging today!</div></Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {keys.map(k => {
        const d = allDays[k];
        const sc = scoreDay(d);
        const col = sc.overall >= 80 ? C.green : sc.overall >= 60 ? C.yellow : C.orange;
        return (
          <Card key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fmt(k)}</div>
              <div style={{ fontSize: 12, color: C.textSub, marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {d.sleep && <span><Icon name="moon" size={11} color={C.purple} /> {d.sleep.hours}h{d.sleep.minutes ? `${d.sleep.minutes}m` : ""}</span>}
                {d.nutrition && <span><Icon name="food" size={11} color={C.green} /> {d.nutrition.calories}kcal</span>}
                {d.workouts?.length > 0 && <span><Icon name="dumbbell" size={11} color={C.accent} /> {d.workouts.length} ex</span>}
                {d.cardio?.length > 0 && <span><Icon name="run" size={11} color={C.orange} /> {d.cardio.length} session</span>}
                {d.steps && <span><Icon name="steps" size={11} color={C.yellow} /> {d.steps.toLocaleString()}</span>}
              </div>
            </div>
            {sc.overall > 0 && (
              <div style={{ textAlign: "center" }}>
                <Ring pct={sc.overall} size={44} stroke={4} color={col} />
                <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>{sc.overall}%</div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── PLAN VIEW ────────────────────────────────────────────────────────────────
function PlanView() {
  const planData = [
    { icon: "dumbbell", color: C.accent, title: "Strength", items: ["3 sessions/week", "Weighted pull-ups & dips focus", "Add compound lower body", "Progressive overload each session"] },
    { icon: "run", color: C.orange, title: "Cardio", items: ["3× Zone 2 runs (125–145 bpm)", "1× VO2 max intervals (4 min on/off)", "Slow down — conversation pace", "45–60 min Zone 2 sessions"] },
    { icon: "moon", color: C.purple, title: "Sleep", items: ["7h 45m minimum target", "Consistent bedtime daily", "Room temp 17–19°C", "Magnesium glycinate before bed", "No screens 30 min before bed"] },
    { icon: "food", color: C.green, title: "Nutrition", items: [`${PLAN.calories} kcal/day (${PLAN.protein}g protein)`, "Mediterranean-style food base", "Oily fish 3–4× per week", "Blueberries, leafy greens daily", "Minimize alcohol & processed food"] },
    { icon: "steps", color: C.yellow, title: "Steps & Activity", items: [`${PLAN.steps.toLocaleString()} steps/day minimum`, "Walk after meals", "Take stairs when possible"] },
    { icon: "scale", color: C.orange, title: "Body Composition", items: [`Goal: ${PLAN.weight_target} kg (from 85 kg)`, "~0.3–0.4 kg/week fat loss", "Slow cut: preserve muscle", "DEXA scan every 3 months"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card style={{ background: C.accentDim, border: `1px solid ${C.accent}44` }}>
        <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Your Coaching Plan</div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          25-year-old male, 85 kg → 79 kg goal. Intermediate lifter. Investment banker, 60 hrs/week.
          Primary goals: fat loss, muscle maintenance, longevity optimization, slow aging.
        </div>
      </Card>
      {planData.map((p, i) => (
        <Card key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ background: p.color + "22", borderRadius: 8, padding: 8 }}><Icon name={p.icon} size={16} color={p.color} /></div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{p.title}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {p.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: C.textSub }}>
                <span style={{ color: p.color, marginTop: 2, flexShrink: 0 }}><Icon name="check" size={13} /></span>
                {item}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [allDays, setAllDays] = useStorage("coach_days_v2", {});
  const [tab, setTab] = useState("today");

  const today = todayKey();
  const todayData = allDays[today] || {};

  const updateToday = (data) => {
    setAllDays({ ...allDays, [today]: data });
  };

  const tabs = [
    { key: "today", icon: "target", label: "Today" },
    { key: "week", icon: "chart", label: "Week" },
    { key: "history", icon: "star", label: "History" },
    { key: "plan", icon: "trophy", label: "Plan" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>Coach</div>
            <div style={{ fontSize: 11, color: C.textSub }}>Personal tracking & feedback</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.keys(allDays).length > 0 && (
              <div style={{ background: C.accentDim, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: C.accent, fontWeight: 600 }}>
                {Object.keys(allDays).length}d logged
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 100px" }}>
        {tab === "today" && <TodayView today={todayData} onUpdate={updateToday} />}
        {tab === "week" && <WeeklyRecap allDays={allDays} />}
        {tab === "history" && <HistoryView allDays={allDays} />}
        {tab === "plan" && <PlanView />}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, padding: "10px 0 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                color: tab === t.key ? C.accent : C.textDim, transition: "color 0.15s", padding: "4px 16px" }}>
              <Icon name={t.icon} size={20} color={tab === t.key ? C.accent : C.textDim} />
              <span style={{ fontSize: 10, fontWeight: tab === t.key ? 700 : 400, letterSpacing: "0.04em" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
