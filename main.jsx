import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import {
  Home as HomeIcon, FileQuestion, Video, BookOpen, TrendingUp, GraduationCap, LogOut,
  LogIn, UserPlus, Upload, Trash2, FileText, ChevronRight, Plus, X, Play, Target, Flame, Shield,
  NotebookPen, CheckCircle2, Circle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
:root{
  --ink:#08111C; --bg:#0B1827; --surface:#102438; --surface-2:#15314C;
  --line:rgba(255,255,255,.08); --line-strong:rgba(255,255,255,.14);
  --teal:#2DD4BF; --teal-deep:#0F9C8E; --gold:#F2B544; --gold-soft:#FFD888;
  --coral:#FF7A7A; --text:#EAF2FA; --muted:#9DB1C8; --muted-dim:#67809B;
  --font-display:'Bricolage Grotesque',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif; --font-num:'Space Grotesk',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{ font-family:var(--font-body); color:var(--text);
  background:radial-gradient(1100px 600px at 85% -10%, rgba(45,212,191,.14), transparent 60%),
    radial-gradient(900px 600px at -10% 10%, rgba(242,181,68,.10), transparent 55%), var(--bg);
  -webkit-font-smoothing:antialiased; }
button{font-family:inherit;}
.mm-shell{ display:flex; min-height:100vh; }
.mm-loader{ min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; color:var(--muted); }
.mm-spin{ width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,255,255,.12);border-top-color:var(--gold);animation:spin .8s linear infinite; }
@keyframes spin{ to{ transform:rotate(360deg); } }
.mm-auth{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
.mm-auth-card{ width:100%; max-width:400px; }
.mm-auth-brand{ display:flex; align-items:center; gap:12px; justify-content:center; margin-bottom:22px; }
.mm-auth-brand .mm-logo-mark{ width:46px;height:46px; }
.mm-auth-brand b{ font-family:var(--font-display); font-weight:800; font-size:21px; letter-spacing:-.01em; display:block; line-height:1; }
.mm-auth-brand small{ color:var(--muted-dim); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; }
.mm-auth-box{ background:linear-gradient(160deg,#143150,#0C1C2E 70%); border:1px solid var(--line); border-radius:24px; padding:26px 22px; }
.mm-auth-box h1{ font-family:var(--font-display); font-size:21px; font-weight:700; letter-spacing:-.01em; }
.mm-auth-box p.sub{ color:var(--muted); font-size:13px; margin:6px 0 18px; line-height:1.5; }
.mm-auth-switch{ text-align:center; margin-top:16px; font-size:13px; color:var(--muted); }
.mm-auth-switch button{ background:none;border:none;color:var(--gold-soft);font-weight:600;cursor:pointer;font-size:13px; }
.mm-msg{ font-size:12.5px; border-radius:12px; padding:11px 13px; margin-bottom:14px; line-height:1.45; }
.mm-msg.err{ background:rgba(255,122,122,.12); border:1px solid rgba(255,122,122,.3); color:#FFB4B4; }
.mm-msg.ok{ background:rgba(45,212,191,.12); border:1px solid rgba(45,212,191,.3); color:#9FF0E5; }
.mm-nav{ position:fixed; z-index:40; left:0; right:0; bottom:0; display:flex; justify-content:space-around; align-items:center;
  background:rgba(8,17,28,.82); backdrop-filter:blur(18px); border-top:1px solid var(--line); padding:8px 4px calc(10px + env(safe-area-inset-bottom)); }
.mm-navbtn{ background:none;border:none;cursor:pointer; color:var(--muted-dim); display:flex;flex-direction:column;align-items:center;gap:3px;
  font-size:10px;font-weight:600;letter-spacing:.01em; padding:6px 7px;border-radius:12px; transition:color .18s; }
.mm-navbtn.on{ color:var(--gold); }
.mm-navbtn.on .mm-navicon{ background:linear-gradient(180deg,rgba(242,181,68,.22),rgba(242,181,68,.06)); box-shadow:0 0 0 1px rgba(242,181,68,.35) inset; }
.mm-navicon{ width:40px;height:30px;border-radius:11px;display:flex;align-items:center;justify-content:center; transition:.18s; }
.mm-brand{ display:none; }
.mm-main{ flex:1; padding:0 18px calc(96px + env(safe-area-inset-bottom)); max-width:760px; margin:0 auto; width:100%; }
.mm-topbar{ display:flex; align-items:center; justify-content:space-between; padding:20px 2px 14px; position:sticky; top:0; z-index:20; background:linear-gradient(180deg, var(--bg) 60%, transparent); }
.mm-logo{ display:flex; align-items:center; gap:11px; }
.mm-logo-mark{ width:40px;height:40px;border-radius:12px; flex:none; background:linear-gradient(150deg,#15314C,#0B1827);
  border:1px solid rgba(242,181,68,.4); display:flex;align-items:center;justify-content:center; color:var(--gold); box-shadow:0 6px 20px -10px rgba(242,181,68,.6); }
.mm-logo-txt b{ font-family:var(--font-display); font-weight:800; font-size:17px; letter-spacing:-.01em; display:block; line-height:1; }
.mm-logo-txt small{ color:var(--muted-dim); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; }
.mm-signout{ background:var(--surface); border:1px solid var(--line); border-radius:11px; width:38px;height:38px; color:var(--muted); cursor:pointer; display:flex;align-items:center;justify-content:center; }
.mm-hero{ position:relative; overflow:hidden; border-radius:24px; padding:24px 22px;
  background:radial-gradient(420px 220px at 100% 0%, rgba(45,212,191,.20), transparent 70%), linear-gradient(160deg,#143150,#0C1C2E 70%); border:1px solid var(--line); margin-top:4px; }
.mm-hero h1{ font-family:var(--font-display); font-weight:800; font-size:clamp(22px,6vw,30px); line-height:1.04; letter-spacing:-.02em; max-width:16ch; }
.mm-hero .grad{ background:linear-gradient(90deg,var(--gold-soft),var(--gold)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.mm-hero p{ color:var(--muted); margin-top:10px; font-size:13.5px; max-width:42ch; line-height:1.5; }
.mm-quote{ margin-top:16px; padding-top:14px; border-top:1px solid var(--line); font-size:12.5px; color:var(--gold-soft); font-style:italic; display:flex; gap:8px; align-items:flex-start; }
.mm-admin-badge{ display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; color:var(--gold-soft); background:rgba(242,181,68,.12); border:1px solid rgba(242,181,68,.3); padding:4px 10px; border-radius:999px; margin-bottom:12px; }
.mm-ring-card{ display:flex; gap:18px; align-items:center; margin-top:14px; padding:18px; background:var(--surface); border:1px solid var(--line); border-radius:20px; }
.mm-ring{ position:relative; width:96px; height:96px; flex:none; }
.mm-ring .val{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.mm-ring .val b{ font-family:var(--font-num); font-size:26px; font-weight:700; line-height:1; }
.mm-ring .val small{ font-size:10px; color:var(--muted-dim); letter-spacing:.06em; margin-top:2px; }
.mm-ring-meta{ flex:1; }
.mm-ring-meta .lbl{ font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:var(--muted-dim); font-weight:600; }
.mm-ring-meta .big{ font-family:var(--font-display); font-size:18px; font-weight:700; margin:3px 0 8px; }
.mm-chips{ display:flex; gap:8px; flex-wrap:wrap; }
.mm-chip{ font-size:11px; padding:5px 9px; border-radius:999px; background:var(--surface-2); border:1px solid var(--line); color:var(--muted); display:flex; align-items:center; gap:5px; font-weight:500; }
.mm-chip b{ color:var(--text); font-family:var(--font-num); }
.mm-sec-head{ display:flex; align-items:baseline; justify-content:space-between; margin:26px 2px 12px; }
.mm-sec-head h2{ font-family:var(--font-display); font-size:19px; font-weight:700; letter-spacing:-.01em; }
.mm-sec-head .sub{ color:var(--muted-dim); font-size:12px; }
.mm-tiles{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.mm-tile{ text-align:left; cursor:pointer; border:1px solid var(--line); border-radius:18px; padding:16px;
  background:linear-gradient(160deg,var(--surface),rgba(16,36,56,.5)); color:var(--text); display:flex; flex-direction:column; gap:10px; transition:transform .16s, border-color .16s; position:relative; overflow:hidden; }
.mm-tile:hover{ transform:translateY(-2px); border-color:var(--line-strong); }
.mm-tile .ic{ width:38px;height:38px;border-radius:11px; display:flex;align-items:center;justify-content:center; }
.mm-tile h3{ font-size:14.5px; font-weight:700; font-family:var(--font-display); }
.mm-tile p{ font-size:11.5px; color:var(--muted-dim); line-height:1.4; }
.mm-tile .arr{ position:absolute; top:16px; right:14px; color:var(--muted-dim); }
.mm-seg{ display:flex; width:100%; background:var(--surface); border:1px solid var(--line); border-radius:13px; padding:4px; gap:4px; margin:2px 0 14px; }
.mm-seg button{ flex:1; border:none; background:none; color:var(--muted); font-weight:600; font-size:12.5px; padding:9px 10px; border-radius:9px; cursor:pointer; transition:.15s; }
.mm-seg button.on{ background:linear-gradient(180deg, rgba(242,181,68,.22), rgba(242,181,68,.06)); color:var(--gold-soft); box-shadow:0 0 0 1px rgba(242,181,68,.3) inset; }
.mm-subjects{ display:flex; gap:8px; overflow-x:auto; padding:2px 2px 10px; scrollbar-width:none; }
.mm-subjects::-webkit-scrollbar{ display:none; }
.mm-subj{ flex:none; cursor:pointer; padding:9px 14px; border-radius:999px; font-size:12.5px; font-weight:600; background:var(--surface); border:1px solid var(--line); color:var(--muted); transition:.16s; white-space:nowrap; display:flex; align-items:center; gap:7px; }
.mm-subj.on{ background:linear-gradient(180deg,rgba(45,212,191,.22),rgba(45,212,191,.07)); color:var(--text); border-color:rgba(45,212,191,.45); }
.mm-subj .cnt{ font-size:10.5px; background:rgba(255,255,255,.1); padding:1px 6px; border-radius:999px; font-family:var(--font-num); }
.mm-filelist{ display:flex; flex-direction:column; gap:10px; }
.mm-file{ display:flex; align-items:center; gap:13px; padding:14px; border-radius:16px; background:var(--surface); border:1px solid var(--line); transition:border-color .16s; }
.mm-file .fic{ width:42px;height:42px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center; }
.mm-file .fmeta{ flex:1; min-width:0; cursor:pointer; }
.mm-file .fmeta b{ font-size:13.5px; font-weight:600; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mm-file .fmeta small{ font-size:11px; color:var(--muted-dim); }
.mm-iconbtn{ background:var(--surface-2); border:1px solid var(--line); border-radius:10px; width:34px;height:34px; cursor:pointer; color:var(--muted); display:flex;align-items:center;justify-content:center; flex:none; transition:.15s; }
.mm-iconbtn.danger:hover{ color:var(--coral); border-color:rgba(255,122,122,.4); }
.mm-btn{ cursor:pointer; border:none; border-radius:13px; font-weight:600; font-size:13.5px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:12px 18px; transition:.16s; }
.mm-btn:disabled{ opacity:.55; cursor:not-allowed; }
.mm-btn-gold{ background:linear-gradient(180deg,var(--gold-soft),var(--gold)); color:#3A2A06; box-shadow:0 8px 24px -12px rgba(242,181,68,.8); }
.mm-btn-ghost{ background:var(--surface); border:1px solid var(--line); color:var(--text); }
.mm-btn-block{ width:100%; }
.mm-empty{ text-align:center; padding:38px 24px; border:1px dashed var(--line-strong); border-radius:20px; background:rgba(16,36,56,.4); display:flex; flex-direction:column; align-items:center; gap:6px; }
.mm-empty .eic{ width:54px;height:54px;border-radius:16px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--muted-dim);margin-bottom:6px; }
.mm-empty h4{ font-family:var(--font-display); font-size:15px; font-weight:700; }
.mm-empty p{ font-size:12.5px; color:var(--muted-dim); max-width:32ch; line-height:1.5; }
.mm-modal{ position:fixed; inset:0; z-index:90; background:rgba(4,9,16,.78); backdrop-filter:blur(8px); display:flex; flex-direction:column; padding:14px; }
.mm-modal-top{ display:flex; align-items:center; justify-content:space-between; padding:6px 4px 12px; }
.mm-modal-top b{ font-family:var(--font-display); font-size:15px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:75%; }
.mm-modal-body{ flex:1; border-radius:16px; overflow:hidden; background:#000; border:1px solid var(--line); }
.mm-modal-body iframe, .mm-modal-body video{ width:100%; height:100%; border:none; display:block; background:#000; }
.mm-form{ display:flex; flex-direction:column; gap:13px; padding:18px; background:var(--surface); border:1px solid var(--line); border-radius:20px; }
.mm-field label{ font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--muted-dim); font-weight:600; display:block; margin-bottom:6px; }
.mm-input, .mm-select{ width:100%; background:var(--ink); border:1px solid var(--line); border-radius:12px; padding:12px 13px; color:var(--text); font-family:var(--font-body); font-size:14px; outline:none; transition:border-color .15s; }
.mm-input:focus, .mm-select:focus{ border-color:rgba(45,212,191,.5); }
.mm-row{ display:grid; grid-template-columns:1fr 1fr; gap:11px; }
.mm-grade{ display:flex; align-items:center; gap:13px; padding:13px 14px; border-radius:15px; background:var(--surface); border:1px solid var(--line); }
.mm-grade .gdot{ width:10px;height:10px;border-radius:50%; flex:none; }
.mm-grade .gmeta{ flex:1; min-width:0; }
.mm-grade .gmeta b{ font-size:13.5px; font-weight:600; }
.mm-grade .gmeta small{ display:block; font-size:11px; color:var(--muted-dim); }
.mm-grade .gnote{ font-family:var(--font-num); font-size:17px; font-weight:700; }
.mm-grade .gnote small{ font-size:11px; color:var(--muted-dim); font-weight:500; }
.mm-chartcard{ padding:18px 8px 10px 0; background:var(--surface); border:1px solid var(--line); border-radius:20px; margin-bottom:14px; }
.mm-chartcard .ch-head{ padding:0 16px 6px; display:flex; justify-content:space-between; align-items:center; }
.mm-chartcard .ch-head b{ font-family:var(--font-display); font-size:14px; }
.mm-chartcard .ch-head span{ font-size:11px; color:var(--muted-dim); }
.mm-tooltip{ background:var(--ink); border:1px solid var(--line-strong); border-radius:12px; padding:9px 12px; font-size:12px; }
.mm-tooltip .tt-s{ color:var(--muted); }
.mm-tooltip .tt-n{ font-family:var(--font-num); font-weight:700; color:var(--gold-soft); }
.mm-note-banner{ font-size:11px; color:var(--muted-dim); text-align:center; padding:14px 8px 4px; line-height:1.5; }
.mm-note-banner b{ color:var(--muted); }
.mm-erritem{ padding:14px; border-radius:16px; background:var(--surface); border:1px solid var(--line); display:flex; flex-direction:column; gap:9px; transition:opacity .15s; }
.mm-erritem.done{ opacity:.55; }
.mm-erritem .econtent{ font-size:14px; line-height:1.5; }
.mm-erritem .econtent.done{ text-decoration:line-through; color:var(--muted); }
.mm-erritem .ecorr{ font-size:12.5px; color:var(--muted); background:var(--ink); border:1px solid var(--line); border-radius:10px; padding:9px 11px; line-height:1.5; }
.mm-erritem .ecorr b{ color:var(--gold-soft); font-weight:600; }
.mm-erritem .efoot{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.mm-erritem .efoot .right{ display:flex; align-items:center; gap:10px; }
.mm-erritem .edate{ font-size:11px; color:var(--muted-dim); }
.mm-masterbtn{ display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; background:none; border:none; cursor:pointer; color:var(--muted-dim); padding:0; }
.mm-masterbtn.on{ color:var(--teal); }
.mm-prog{ font-size:11.5px; color:var(--muted-dim); margin:2px 2px 12px; }
.mm-prog b{ color:var(--teal); font-family:var(--font-num); }
textarea.mm-input{ resize:vertical; min-height:74px; line-height:1.5; }
.mm-subjavg{ display:flex; flex-direction:column; gap:8px; }
.mm-savg{ background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:12px 14px; }
.mm-savg .top{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:9px; }
.mm-savg .nm{ font-size:13px; font-weight:600; min-width:0; }
.mm-savg .nm small{ color:var(--muted-dim); font-weight:500; font-size:11px; }
.mm-savg .av{ font-family:var(--font-num); font-size:15px; font-weight:700; flex:none; }
.mm-savg .av small{ color:var(--muted-dim); font-weight:500; font-size:11px; }
.mm-savg .bar{ height:7px; border-radius:999px; background:rgba(255,255,255,.07); overflow:hidden; }
.mm-savg .bar span{ display:block; height:100%; border-radius:999px; }
.mm-genavg{ display:flex; align-items:center; justify-content:space-between; padding:15px 17px; border-radius:16px; margin-top:12px;
  background:linear-gradient(160deg, rgba(45,212,191,.13), rgba(242,181,68,.09)); border:1px solid var(--line-strong); }
.mm-genavg .l{ font-family:var(--font-display); font-size:14.5px; font-weight:700; }
.mm-genavg .v{ font-family:var(--font-num); font-size:25px; font-weight:700; color:var(--gold-soft); }
.mm-genavg .v small{ font-size:12px; color:var(--muted-dim); font-weight:500; }
@media(min-width:860px){
  .mm-nav{ flex-direction:column; justify-content:flex-start; top:0; right:auto; bottom:0; width:228px; border-top:none; border-right:1px solid var(--line); padding:24px 16px; gap:6px; align-items:stretch; }
  .mm-brand{ display:flex; align-items:center; gap:11px; padding:4px 8px 22px; }
  .mm-navbtn{ flex-direction:row; justify-content:flex-start; gap:12px; font-size:13.5px; padding:11px 12px; width:100%; }
  .mm-navbtn .mm-navicon{ width:34px;height:34px; }
  .mm-main{ margin-left:228px; }
}
`;

const SUBJECTS_BY_SEMESTER = {
  1: ["UE1 · Découverte des métiers","UE2 · Bio-statistiques","UE3 · Informatique médicale","UE4 · Rayonnement et santé","UE5 · Biochimie","UE6 · Embryologie","UE7 · Physiologie humaine","UE8 · Anatomie","UE9 · Chimie"],
  2: ["UE10 · Anglais","UE11 · SSH","UE12 · Santé et environnement","UE13 · Bio-cellulaire et moléculaire","UE14 · Histologie"],
};
const DEFAULT_SUBJECTS = [...SUBJECTS_BY_SEMESTER[1], ...SUBJECTS_BY_SEMESTER[2]];
const SUBJECT_COLORS = ["#2DD4BF","#F2B544","#7DD3FC","#FCA5A5","#C4B5FD","#86EFAC","#FDBA74","#F9A8D4","#5EEAD4","#FCD34D","#93C5FD","#D8B4FE","#6EE7B7","#FDA4AF"];
const MOTIVATION = [
  "La régularité bat le talent quand le talent reste assis.",
  "Un QCM par jour, c'est un rang gagné chaque semaine.",
  "Le major n'est pas le plus doué. C'est le plus constant.",
  "Tu ne révises pas pour aujourd'hui. Tu construis ton classement.",
];
const fmt = (n) => (Number.isFinite(n) ? n.toFixed(2).replace(".", ",") : "—");
const todayISO = () => new Date().toISOString().slice(0, 10);
const frDate = (iso) => { try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); } catch { return iso; } };
const subjColor = (subjects, name) => { const i = subjects.indexOf(name); return SUBJECT_COLORS[(i < 0 ? 0 : i) % SUBJECT_COLORS.length]; };
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) { const id = u.searchParams.get("v"); if (id) return `https://www.youtube.com/embed/${id}`; }
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("vimeo.com")) { const id = u.pathname.split("/").filter(Boolean).pop(); if (id) return `https://player.vimeo.com/video/${id}`; }
  } catch { /* lien invalide */ }
  return url;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || "", supabaseKey || "");

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      if (sess) loadProfile(sess.user.id); else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const value = {
    session, user: session?.user || null, profile,
    isAdmin: profile?.role === "admin", loading,
    signUp: (email, password, fullName) => supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function traduire(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email ou mot de passe incorrect.";
  if (m.includes("already registered")) return "Cet email a déjà un compte.";
  if (m.includes("email not confirmed")) return "Confirme d'abord ton email (vérifie ta boîte mail).";
  if (m.includes("password")) return "Mot de passe trop court (6 caractères minimum).";
  return msg || "Une erreur est survenue.";
}

function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const isSignup = mode === "signup";
  async function submit(e) {
    e.preventDefault(); setErr(""); setOk(""); setBusy(true);
    try {
      if (isSignup) {
        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) throw error;
        setOk("Compte créé. Vérifie ta boîte mail pour confirmer, puis connecte-toi.");
        setMode("login");
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) throw error;
      }
    } catch (e2) { setErr(traduire(e2.message)); } finally { setBusy(false); }
  }
  return (
    <div className="mm-auth">
      <div className="mm-auth-card">
        <div className="mm-auth-brand">
          <div className="mm-logo-mark"><GraduationCap size={24} /></div>
          <div><b>Major Mindset</b><small>PASS · Antilles-Guyane</small></div>
        </div>
        <div className="mm-auth-box">
          <h1>{isSignup ? "Crée ton compte" : "Connexion"}</h1>
          <p className="sub">{isSignup ? "Rejoins la plateforme de travail de la promo." : "Retrouve tes QCM, cours, vidéos et le suivi de tes notes."}</p>
          {err && <div className="mm-msg err">{err}</div>}
          {ok && <div className="mm-msg ok">{ok}</div>}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {isSignup && (
              <div className="mm-field"><label>Nom et prénom</label>
                <input className="mm-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jeanne Dupont" required /></div>
            )}
            <div className="mm-field"><label>Email</label>
              <input className="mm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@etu.univ-antilles.fr" required /></div>
            <div className="mm-field"><label>Mot de passe</label>
              <input className="mm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required /></div>
            <button className="mm-btn mm-btn-gold mm-btn-block" type="submit" disabled={busy}>
              {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}{busy ? "Un instant…" : isSignup ? "Créer mon compte" : "Me connecter"}
            </button>
          </form>
          <div className="mm-auth-switch">
            {isSignup ? "Déjà un compte ? " : "Pas encore de compte ? "}
            <button onClick={() => { setMode(isSignup ? "login" : "signup"); setErr(""); setOk(""); }}>{isSignup ? "Se connecter" : "S'inscrire"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BUCKET = "library";
function Library({ kind }) {
  const { isAdmin } = useAuth();
  const isQcm = kind === "qcm";
  const accent = isQcm ? "var(--teal)" : "var(--gold)";
  const Icon = isQcm ? FileQuestion : BookOpen;
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState(1);
  const [active, setActive] = useState(SUBJECTS_BY_SEMESTER[1][0]);
  const [extraSubjects, setExtraSubjects] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newSubj, setNewSubj] = useState("");
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState(null);
  const fileRef = useRef(null);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("documents").select("*").eq("kind", kind).order("created_at", { ascending: false });
    setDocs(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, [kind]);
  const subjects = useMemo(() => {
    const known = SUBJECTS_BY_SEMESTER[semester];
    const fromDocs = docs.map((d) => d.subject);
    const extras = Array.from(new Set([...extraSubjects, ...fromDocs])).filter((s) => !DEFAULT_SUBJECTS.includes(s));
    return [...known, ...extras];
  }, [docs, extraSubjects, semester]);
  function switchSemester(s) { setSemester(s); setActive(SUBJECTS_BY_SEMESTER[s][0]); setAdding(false); }
  const list = docs.filter((d) => d.subject === active);
  const countFor = (s) => docs.filter((d) => d.subject === s).length;
  async function onUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      for (const f of files) {
        const safe = f.name.replace(/[^\w.\-]+/g, "_");
        const path = `${kind}/${active.replace(/[^A-Za-z0-9]+/g, "_")}/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, f, { contentType: "application/pdf" });
        if (upErr) throw upErr;
        const { data: u } = await supabase.auth.getUser();
        const { error: insErr } = await supabase.from("documents").insert({ kind, subject: active, name: f.name, path, uploaded_by: u.user?.id });
        if (insErr) throw insErr;
      }
      await load();
    } catch (err) { alert("Échec du dépôt : " + (err.message || err)); }
    finally { setBusy(false); e.target.value = ""; }
  }
  async function open(doc) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(doc.path, 3600);
    if (error) { alert("Impossible d'ouvrir le fichier."); return; }
    setViewer({ url: data.signedUrl, name: doc.name });
  }
  async function remove(doc) {
    if (!confirm(`Supprimer « ${doc.name} » ?`)) return;
    await supabase.storage.from(BUCKET).remove([doc.path]);
    await supabase.from("documents").delete().eq("id", doc.id);
    await load();
  }
  return (
    <>
      <div className="mm-sec-head"><h2>{isQcm ? "Espace QCM" : "Espace Cours"}</h2></div>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "-6px 2px 16px" }}>{isQcm ? "Les QCM en PDF de la promo, classés par matière." : "Les cours en PDF, retrouvables matière par matière."}</p>
      <div className="mm-seg">
        <button className={semester === 1 ? "on" : ""} onClick={() => switchSemester(1)}>Semestre 1</button>
        <button className={semester === 2 ? "on" : ""} onClick={() => switchSemester(2)}>Semestre 2</button>
      </div>
      <div className="mm-subjects">
        {subjects.map((s) => (
          <button key={s} className={`mm-subj ${active === s ? "on" : ""}`} onClick={() => setActive(s)}>
            {s}{countFor(s) ? <span className="cnt">{countFor(s)}</span> : null}
          </button>
        ))}
        {isAdmin && (adding ? (
          <form style={{ flex: "none" }} onSubmit={(e) => { e.preventDefault(); const n = newSubj.trim(); if (n) { setExtraSubjects((p) => [...p, n]); setActive(n); } setNewSubj(""); setAdding(false); }}>
            <input autoFocus className="mm-input" style={{ width: 130, padding: "8px 10px" }} placeholder="Matière…" value={newSubj} onChange={(e) => setNewSubj(e.target.value)} />
          </form>
        ) : (<button className="mm-subj" onClick={() => setAdding(true)}><Plus size={13} />Matière</button>))}
      </div>
      {isAdmin && (
        <>
          <input ref={fileRef} type="file" accept="application/pdf" multiple hidden onChange={onUpload} />
          <button className="mm-btn mm-btn-gold mm-btn-block" style={{ margin: "6px 0 16px" }} disabled={busy} onClick={() => fileRef.current?.click()}>
            <Upload size={16} />{busy ? "Dépôt en cours…" : `Déposer un PDF · ${active}`}
          </button>
        </>
      )}
      {loading ? (<div className="mm-empty"><div className="mm-spin" /></div>)
        : list.length === 0 ? (
          <div className="mm-empty"><div className="eic"><Icon size={24} /></div>
            <h4>Rien en {active} pour l'instant</h4>
            <p>{isAdmin ? "Dépose le premier PDF de cette matière." : "Reviens bientôt, le contenu est en préparation."}</p></div>
        ) : (
          <div className="mm-filelist">
            {list.map((d) => (
              <div className="mm-file" key={d.id}>
                <div className="fic" style={{ background: "rgba(255,255,255,.06)", color: accent }}><FileText size={20} /></div>
                <div className="fmeta" onClick={() => open(d)}><b>{d.name}</b><small>PDF · {d.subject} · appuie pour ouvrir</small></div>
                <button className="mm-iconbtn" onClick={() => open(d)}><ChevronRight size={16} /></button>
                {isAdmin && <button className="mm-iconbtn danger" onClick={() => remove(d)}><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
        )}
      {viewer && (
        <div className="mm-modal" onClick={() => setViewer(null)}>
          <div className="mm-modal-top"><b>{viewer.name}</b><button className="mm-iconbtn" onClick={() => setViewer(null)}><X size={18} /></button></div>
          <div className="mm-modal-body" onClick={(e) => e.stopPropagation()}><iframe title={viewer.name} src={viewer.url} /></div>
        </div>
      )}
    </>
  );
}

function Videos() {
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [viewer, setViewer] = useState(null);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  async function add(e) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    const { error } = await supabase.from("videos").insert({ title: title.trim(), url: url.trim() });
    if (error) { alert("Échec : " + error.message); return; }
    setTitle(""); setUrl(""); setForm(false); load();
  }
  async function remove(v) {
    if (!confirm(`Supprimer « ${v.title} » ?`)) return;
    await supabase.from("videos").delete().eq("id", v.id); load();
  }
  return (
    <>
      <div className="mm-sec-head"><h2>Espace Vidéos</h2></div>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "-6px 2px 16px" }}>Tes propres vidéos de cours, hébergées sur YouTube ou Vimeo et regroupées ici.</p>
      {isAdmin && (form ? (
        <form className="mm-form" onSubmit={add} style={{ marginBottom: 16 }}>
          <div className="mm-field"><label>Titre</label><input className="mm-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cours d'anatomie — séance 1" required /></div>
          <div className="mm-field"><label>Lien YouTube ou Vimeo</label><input className="mm-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/..." required /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="mm-btn mm-btn-gold" type="submit" style={{ flex: 1 }}><Plus size={16} />Ajouter</button>
            <button className="mm-btn mm-btn-ghost" type="button" onClick={() => setForm(false)}>Annuler</button>
          </div>
        </form>
      ) : (<button className="mm-btn mm-btn-gold mm-btn-block" style={{ marginBottom: 16 }} onClick={() => setForm(true)}><Plus size={16} />Ajouter une vidéo</button>))}
      {loading ? (<div className="mm-empty"><div className="mm-spin" /></div>)
        : videos.length === 0 ? (
          <div className="mm-empty"><div className="eic"><Video size={24} /></div><h4>Aucune vidéo pour l'instant</h4>
            <p>{isAdmin ? "Ajoute le lien d'une de tes vidéos." : "Les vidéos arrivent bientôt."}</p></div>
        ) : (
          <div className="mm-filelist">
            {videos.map((v) => (
              <div className="mm-file" key={v.id}>
                <div className="fic" style={{ background: "rgba(125,211,252,.14)", color: "#7DD3FC" }}><Play size={18} /></div>
                <div className="fmeta" onClick={() => setViewer(v)}><b>{v.title}</b><small>Vidéo · appuie pour lire</small></div>
                <button className="mm-iconbtn" onClick={() => setViewer(v)}><Play size={15} /></button>
                {isAdmin && <button className="mm-iconbtn danger" onClick={() => remove(v)}><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
        )}
      {viewer && (
        <div className="mm-modal" onClick={() => setViewer(null)}>
          <div className="mm-modal-top"><b>{viewer.title}</b><button className="mm-iconbtn" onClick={() => setViewer(null)}><X size={18} /></button></div>
          <div className="mm-modal-body" onClick={(e) => e.stopPropagation()}>
            <iframe title={viewer.title} src={toEmbedUrl(viewer.url)} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </>
  );
}

function ChartTip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="mm-tooltip">
      <div className="tt-s">{p.subject} · {p.label}</div>
      <div>Note <span className="tt-n">{fmt(p.note)}</span> · moy. <span className="tt-n">{fmt(p.moyenne)}</span></div>
    </div>
  );
}

function Notes() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0]);
  const [date, setDate] = useState(todayISO());
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState(() => { const v = window.localStorage.getItem("mm_target"); return v ? parseFloat(v) : 16; });
  useEffect(() => { window.localStorage.setItem("mm_target", String(target)); }, [target]);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("grades").select("*").order("date", { ascending: true });
    setGrades(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const sorted = useMemo(() => [...grades].sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id)), [grades]);
  const average = useMemo(() => { if (!grades.length) return NaN; return grades.reduce((a, g) => a + Number(g.note), 0) / grades.length; }, [grades]);
  const bySubject = useMemo(() => {
    const map = {};
    for (const g of grades) { (map[g.subject] = map[g.subject] || []).push(Number(g.note)); }
    return Object.entries(map)
      .map(([subject, notes]) => ({ subject, avg: notes.reduce((a, b) => a + b, 0) / notes.length, count: notes.length }))
      .sort((a, b) => a.avg - b.avg);
  }, [grades]);
  const colorFor = (v) => (v >= target ? "var(--teal)" : v >= 10 ? "var(--gold)" : "var(--coral)");
  const chartData = useMemo(() => {
    let sum = 0;
    return sorted.map((g, i) => { sum += Number(g.note); return { i, label: frDate(g.date), note: Number(g.note), moyenne: +(sum / (i + 1)).toFixed(2), subject: g.subject }; });
  }, [sorted]);
  async function add(e) {
    e.preventDefault();
    const n = parseFloat(String(note).replace(",", "."));
    if (!Number.isFinite(n) || n < 0 || n > 20) return;
    const { error } = await supabase.from("grades").insert({ user_id: user.id, note: +n.toFixed(2), subject, date, label: label.trim() || null });
    if (error) { alert("Échec : " + error.message); return; }
    setNote(""); setLabel(""); load();
  }
  async function remove(id) { await supabase.from("grades").delete().eq("id", id); load(); }
  const recent = [...sorted].reverse();
  return (
    <>
      <div className="mm-sec-head"><h2>Suivi des notes</h2><span className="sub">{grades.length} note{grades.length > 1 ? "s" : ""}</span></div>
      <div className="mm-chartcard">
        <div className="ch-head"><b>Évolution de ta moyenne</b><span>objectif {fmt(target)}</span></div>
        {loading ? (<div style={{ padding: "30px", textAlign: "center" }}><div className="mm-spin" style={{ margin: "0 auto" }} /></div>)
          : chartData.length === 0 ? (<div style={{ padding: "30px 16px", textAlign: "center", color: "var(--muted-dim)", fontSize: 13 }}>Ajoute des notes pour voir ta courbe d'ascension.</div>)
          : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 18, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#67809B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tick={{ fill: "#67809B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <ReferenceLine y={target} stroke="#F2B544" strokeDasharray="5 5" strokeOpacity={0.8} />
                <Line type="monotone" dataKey="note" stroke="rgba(125,211,252,.5)" strokeWidth={1.5} dot={{ r: 3, fill: "#7DD3FC" }} />
                <Line type="monotone" dataKey="moyenne" stroke="#2DD4BF" strokeWidth={2.6} dot={{ r: 3, fill: "#2DD4BF", stroke: "#0B1827", strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
      </div>

      {grades.length > 0 && (
        <>
          <div className="mm-sec-head"><h2 style={{ fontSize: 16 }}>Moyennes par matière</h2><span className="sub">de la plus fragile à la plus solide</span></div>
          <div className="mm-subjavg">
            {bySubject.map((rsub) => (
              <div className="mm-savg" key={rsub.subject}>
                <div className="top">
                  <div className="nm">{rsub.subject} <small>· {rsub.count} note{rsub.count > 1 ? "s" : ""}</small></div>
                  <div className="av" style={{ color: colorFor(rsub.avg) }}>{fmt(rsub.avg)}<small> /20</small></div>
                </div>
                <div className="bar"><span style={{ width: `${Math.min(100, (rsub.avg / 20) * 100)}%`, background: colorFor(rsub.avg) }} /></div>
              </div>
            ))}
          </div>
          <div className="mm-genavg"><span className="l">Moyenne générale</span><span className="v">{fmt(average)}<small> /20</small></span></div>
        </>
      )}

      <div className="mm-ring-card" style={{ marginTop: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--muted-dim)", fontWeight: 600 }}>Ton objectif de moyenne</div>
          <input type="range" min="8" max="20" step="0.5" value={target} onChange={(e) => setTarget(parseFloat(e.target.value))} style={{ width: "100%", marginTop: 12, accentColor: "#F2B544" }} />
        </div>
        <div style={{ fontFamily: "var(--font-num)", fontSize: 30, fontWeight: 700, color: "var(--gold-soft)" }}>{fmt(target)}</div>
      </div>
      <div className="mm-sec-head"><h2 style={{ fontSize: 16 }}>Ajouter une note</h2></div>
      <form className="mm-form" onSubmit={add}>
        <div className="mm-row">
          <div className="mm-field"><label>Note / 20</label><input className="mm-input" inputMode="decimal" placeholder="14,5" value={note} onChange={(e) => setNote(e.target.value)} required /></div>
          <div className="mm-field"><label>Date</label><input className="mm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        </div>
        <div className="mm-field"><label>Matière</label>
          <select className="mm-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <optgroup label="Semestre 1">{SUBJECTS_BY_SEMESTER[1].map((s) => <option key={s} value={s}>{s}</option>)}</optgroup>
            <optgroup label="Semestre 2">{SUBJECTS_BY_SEMESTER[2].map((s) => <option key={s} value={s}>{s}</option>)}</optgroup>
          </select>
        </div>
        <div className="mm-field"><label>Intitulé (optionnel)</label><input className="mm-input" placeholder="Colle n°2, partiel blanc…" value={label} onChange={(e) => setLabel(e.target.value)} /></div>
        <button className="mm-btn mm-btn-gold mm-btn-block" type="submit"><Plus size={16} />Enregistrer la note</button>
      </form>
      {recent.length > 0 && (
        <>
          <div className="mm-sec-head"><h2 style={{ fontSize: 16 }}>Historique</h2><span className="sub">moy. {fmt(average)}</span></div>
          <div className="mm-filelist">
            {recent.map((g) => (
              <div className="mm-grade" key={g.id}>
                <span className="gdot" style={{ background: subjColor(DEFAULT_SUBJECTS, g.subject) }} />
                <div className="gmeta"><b>{g.subject}</b><small>{g.label ? g.label + " · " : ""}{frDate(g.date)}</small></div>
                <div className="gnote" style={{ color: g.note >= target ? "var(--teal)" : g.note >= 10 ? "var(--text)" : "var(--coral)" }}>{fmt(g.note)}<small> /20</small></div>
                <button className="mm-iconbtn danger" onClick={() => remove(g.id)}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="mm-note-banner"><b>Tes notes sont privées</b> : toi seul peux les voir, et elles te suivent sur tous tes appareils.</p>
    </>
  );
}

function Errors() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState(1);
  const [active, setActive] = useState(SUBJECTS_BY_SEMESTER[1][0]);
  const [content, setContent] = useState("");
  const [correction, setCorrection] = useState("");
  const [showForm, setShowForm] = useState(false);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("errors").select("*").order("created_at", { ascending: false });
    setItems(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  function switchSemester(s) { setSemester(s); setActive(SUBJECTS_BY_SEMESTER[s][0]); setShowForm(false); }
  const subjects = useMemo(() => {
    const known = SUBJECTS_BY_SEMESTER[semester];
    const extras = Array.from(new Set(items.map((i) => i.subject))).filter((s) => !DEFAULT_SUBJECTS.includes(s));
    return [...known, ...extras];
  }, [items, semester]);
  const list = items.filter((i) => i.subject === active);
  const countFor = (s) => items.filter((i) => i.subject === s).length;
  const mastered = list.filter((i) => i.mastered).length;
  async function add(e) {
    e.preventDefault();
    if (!content.trim()) return;
    const { error } = await supabase.from("errors").insert({ user_id: user.id, subject: active, content: content.trim(), correction: correction.trim() || null });
    if (error) { alert("Échec : " + error.message); return; }
    setContent(""); setCorrection(""); setShowForm(false); load();
  }
  async function toggleMaster(it) { await supabase.from("errors").update({ mastered: !it.mastered }).eq("id", it.id); load(); }
  async function remove(id) { if (!confirm("Supprimer cette erreur ?")) return; await supabase.from("errors").delete().eq("id", id); load(); }
  return (
    <>
      <div className="mm-sec-head"><h2>Carnet d'erreurs</h2></div>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "-6px 2px 16px" }}>Note tes erreurs par matière pour ne plus jamais les refaire. Privé : toi seul les vois.</p>
      <div className="mm-seg">
        <button className={semester === 1 ? "on" : ""} onClick={() => switchSemester(1)}>Semestre 1</button>
        <button className={semester === 2 ? "on" : ""} onClick={() => switchSemester(2)}>Semestre 2</button>
      </div>
      <div className="mm-subjects">
        {subjects.map((s) => (
          <button key={s} className={`mm-subj ${active === s ? "on" : ""}`} onClick={() => { setActive(s); setShowForm(false); }}>
            {s}{countFor(s) ? <span className="cnt">{countFor(s)}</span> : null}
          </button>
        ))}
      </div>
      {showForm ? (
        <form className="mm-form" onSubmit={add} style={{ marginBottom: 16 }}>
          <div className="mm-field"><label>Ton erreur · {active}</label>
            <textarea className="mm-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Ex. J'ai confondu liaison peptidique et liaison ester…" required /></div>
          <div className="mm-field"><label>À retenir / correction (optionnel)</label>
            <textarea className="mm-input" value={correction} onChange={(e) => setCorrection(e.target.value)} placeholder="La bonne réponse + comment ne plus se tromper" /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="mm-btn mm-btn-gold" type="submit" style={{ flex: 1 }}><Plus size={16} />Enregistrer</button>
            <button className="mm-btn mm-btn-ghost" type="button" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </form>
      ) : (
        <button className="mm-btn mm-btn-gold mm-btn-block" style={{ margin: "6px 0 16px" }} onClick={() => setShowForm(true)}>
          <Plus size={16} />Ajouter une erreur · {active}
        </button>
      )}
      {loading ? (<div className="mm-empty"><div className="mm-spin" /></div>)
        : list.length === 0 ? (
          <div className="mm-empty"><div className="eic"><NotebookPen size={24} /></div>
            <h4>Aucune erreur notée en {active}</h4>
            <p>Chaque erreur notée est une erreur que tu ne referas plus le jour J.</p></div>
        ) : (
          <>
            <div className="mm-prog">{mastered > 0 ? <><b>{mastered}/{list.length}</b> maîtrisée{mastered > 1 ? "s" : ""} en {active}</> : <>{list.length} erreur{list.length > 1 ? "s" : ""} à revoir</>}</div>
            <div className="mm-filelist">
              {list.map((it) => (
                <div className={`mm-erritem ${it.mastered ? "done" : ""}`} key={it.id}>
                  <div className={`econtent ${it.mastered ? "done" : ""}`}>{it.content}</div>
                  {it.correction && <div className="ecorr"><b>À retenir : </b>{it.correction}</div>}
                  <div className="efoot">
                    <button className={`mm-masterbtn ${it.mastered ? "on" : ""}`} onClick={() => toggleMaster(it)}>
                      {it.mastered ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                      {it.mastered ? "Maîtrisée" : "Marquer maîtrisée"}
                    </button>
                    <div className="right">
                      <span className="edate">{frDate(it.created_at)}</span>
                      <button className="mm-iconbtn danger" onClick={() => remove(it.id)}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      <p className="mm-note-banner"><b>Astuce :</b> relis ton carnet la veille des partiels. Coche « maîtrisée » au fur et à mesure.</p>
    </>
  );
}

function Home({ setTab }) {
  const { profile, isAdmin } = useAuth();
  const [counts, setCounts] = useState({ qcm: 0, cours: 0, videos: 0, grades: 0, erreurs: 0 });
  const [average, setAverage] = useState(NaN);
  const motivation = useMemo(() => MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)], []);
  const target = (() => { const v = window.localStorage.getItem("mm_target"); return v ? parseFloat(v) : 16; })();
  useEffect(() => {
    (async () => {
      const [docs, vids, grades, errs] = await Promise.all([
        supabase.from("documents").select("kind"),
        supabase.from("videos").select("id"),
        supabase.from("grades").select("note"),
        supabase.from("errors").select("id"),
      ]);
      const d = docs.data || [];
      setCounts({ qcm: d.filter((x) => x.kind === "qcm").length, cours: d.filter((x) => x.kind === "cours").length, videos: (vids.data || []).length, grades: (grades.data || []).length, erreurs: (errs.data || []).length });
      const g = grades.data || [];
      if (g.length) setAverage(g.reduce((a, x) => a + Number(x.note), 0) / g.length);
    })();
  }, []);
  const pct = Number.isFinite(average) ? Math.min(100, (average / 20) * 100) : 0;
  const r = 42, c = 2 * Math.PI * r, offset = c - (pct / 100) * c;
  const firstName = (profile?.full_name || "").split(" ")[0];
  const tiles = [
    { id: "qcm", t: "QCM", d: `${counts.qcm} fichier${counts.qcm > 1 ? "s" : ""}`, ic: FileQuestion, c: "var(--teal)", bg: "rgba(45,212,191,.14)" },
    { id: "cours", t: "Cours", d: `${counts.cours} fichier${counts.cours > 1 ? "s" : ""}`, ic: BookOpen, c: "var(--gold)", bg: "rgba(242,181,68,.14)" },
    { id: "videos", t: "Vidéos", d: `${counts.videos} vidéo${counts.videos > 1 ? "s" : ""}`, ic: Video, c: "#7DD3FC", bg: "rgba(125,211,252,.14)" },
    { id: "notes", t: "Mes notes", d: `${counts.grades} note${counts.grades > 1 ? "s" : ""}`, ic: TrendingUp, c: "#C4B5FD", bg: "rgba(196,181,253,.14)" },
    { id: "erreurs", t: "Carnet d'erreurs", d: `${counts.erreurs} erreur${counts.erreurs > 1 ? "s" : ""}`, ic: NotebookPen, c: "#FCA5A5", bg: "rgba(252,165,165,.14)" },
  ];
  return (
    <>
      <section className="mm-hero">
        {isAdmin && <div className="mm-admin-badge"><Shield size={12} />Mode admin</div>}
        <h1>{firstName ? <>Salut {firstName}, vise la <span className="grad">place de major.</span></> : <>Vise la place de <span className="grad">major de promo.</span></>}</h1>
        <p>Ta plateforme de travail pour la première année de médecine des Antilles et de la Guyane.</p>
        <div className="mm-quote"><Flame size={15} style={{ flex: "none", marginTop: 1 }} />{motivation}</div>
      </section>
      <div className="mm-ring-card">
        <div className="mm-ring">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
            <circle cx="48" cy="48" r={r} fill="none" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 48 48)" />
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD888" /><stop offset="1" stopColor="#2DD4BF" /></linearGradient></defs>
          </svg>
          <div className="val"><b>{Number.isFinite(average) ? fmt(average) : "—"}</b><small>/ 20</small></div>
        </div>
        <div className="mm-ring-meta">
          <div className="lbl">Moyenne générale</div>
          <div className="big">{Number.isFinite(average) ? "Tu es en route." : "Ajoute ta 1ʳᵉ note"}</div>
          <div className="mm-chips"><span className="mm-chip"><Target size={12} />Objectif <b>{fmt(target)}</b></span></div>
        </div>
      </div>
      <div className="mm-sec-head"><h2>Tes espaces</h2></div>
      <div className="mm-tiles">
        {tiles.map((t) => { const I = t.ic; return (
          <button key={t.id} className="mm-tile" onClick={() => setTab(t.id)}>
            <div className="ic" style={{ background: t.bg, color: t.c }}><I size={20} /></div>
            <div><h3>{t.t}</h3><p>{t.d}</p></div><ChevronRight className="arr" size={16} />
          </button>
        ); })}
      </div>
    </>
  );
}

const NAV = [
  { id: "home", label: "Accueil", icon: HomeIcon },
  { id: "qcm", label: "QCM", icon: FileQuestion },
  { id: "videos", label: "Vidéos", icon: Video },
  { id: "cours", label: "Cours", icon: BookOpen },
  { id: "notes", label: "Notes", icon: TrendingUp },
  { id: "erreurs", label: "Erreurs", icon: NotebookPen },
];

function App() {
  const { session, loading, signOut } = useAuth();
  const [tab, setTab] = useState("home");
  if (loading) return (<div className="mm-loader"><div className="mm-spin" /><span>Chargement…</span></div>);
  if (!session) return <AuthScreen />;
  return (
    <div className="mm-shell">
      <nav className="mm-nav">
        <div className="mm-brand"><div className="mm-logo-mark"><GraduationCap size={22} /></div><div className="mm-logo-txt"><b>Major Mindset</b><small>Antilles · Guyane</small></div></div>
        {NAV.map((n) => { const I = n.icon; return (
          <button key={n.id} className={`mm-navbtn ${tab === n.id ? "on" : ""}`} onClick={() => setTab(n.id)}>
            <span className="mm-navicon"><I size={20} /></span><span>{n.label}</span>
          </button>
        ); })}
      </nav>
      <main className="mm-main">
        <div className="mm-topbar">
          <div className="mm-logo"><div className="mm-logo-mark"><GraduationCap size={22} /></div><div className="mm-logo-txt"><b>Major Mindset</b><small>PASS · Antilles-Guyane</small></div></div>
          <button className="mm-signout" onClick={signOut} title="Se déconnecter"><LogOut size={17} /></button>
        </div>
        {tab === "home" && <Home setTab={setTab} />}
        {tab === "qcm" && <Library kind="qcm" />}
        {tab === "cours" && <Library kind="cours" />}
        {tab === "videos" && <Videos />}
        {tab === "notes" && <Notes />}
        {tab === "erreurs" && <Errors />}
      </main>
    </div>
  );
}

function Root() {
  return (<><style>{CSS}</style><AuthProvider><App /></AuthProvider></>);
}
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><Root /></React.StrictMode>);
