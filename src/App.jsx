import { useState, useMemo, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ═══ إعداد Firebase ═══
const firebaseConfig = {
  apiKey: "AIzaSyC-aDeCu_D5Eisj9ONVUGK7VTkXDHlSJKs",
  authDomain: "baraka-pwa.firebaseapp.com",
  projectId: "baraka-pwa",
  storageBucket: "baraka-pwa.firebasestorage.app",
  messagingSenderId: "499025330633",
  appId: "1:499025330633:web:d081d02e1ce8f82fee6818"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ═══ دوال قراءة وحفظ البيانات ═══
async function loadFromFirebase(key, defaultValue) {
  try {
    const snap = await getDoc(doc(db, "baraka", key));
    return snap.exists() ? snap.data().value : defaultValue;
  } catch { return defaultValue; }
}

async function saveToFirebase(key, value) {
  try { await setDoc(doc(db, "baraka", key), { value }); } catch(e) { console.error(e); }
}

const initialSubscribers = [
  { id: "M001", name: "أحمد الزايدي", phone: "06 12 34 56 78", address: "حي النصر - زنقة 5 - رقم 12", lastReading: 120 },
  { id: "M002", name: "محمد العلوي", phone: "06 23 45 67 89", address: "حي النصر - زنقة 6 - رقم 8", lastReading: 220 },
  { id: "M003", name: "فاطمة الكتاني", phone: "06 34 56 78 90", address: "حي الازدهار - زنقة 3 - رقم 15", lastReading: 180 },
  { id: "M004", name: "سعيد بنعلي", phone: "06 45 67 89 01", address: "حي الازدهار - زنقة 4 - رقم 7", lastReading: 280 },
  { id: "M005", name: "الحسين الشرفي", phone: "06 56 78 90 12", address: "الحي الجديد - قرب السوق", lastReading: 115 },
  { id: "M006", name: "زينب المنصوري", phone: "06 67 89 01 23", address: "حي السلام - زنقة 2 - رقم 3", lastReading: 95 },
  { id: "M007", name: "عمر البوعزاوي", phone: "06 78 90 12 34", address: "حي الفتح - زنقة 1 - رقم 20", lastReading: 340 },
];

const MONTH = "يونيو 2026";
const emptyForm = { id: "", name: "", phone: "", address: "", lastReading: "" };

// ═══════════════════════════════════════
// SVG ICON LIBRARY
// ═══════════════════════════════════════
const Icon = {
  water: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2C12 2 5 9.5 5 14a7 7 0 0014 0C19 9.5 12 2 12 2zm0 17a5 5 0 01-5-5c0-3.17 3.5-7.9 5-10 1.5 2.1 5 6.83 5 10a5 5 0 01-5 5z"/></svg>,
  meter: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M6 12h1M17 12h1M12 6V5M12 18v1"/></svg>,
  users: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  list: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill={c}/><circle cx="3" cy="12" r="1" fill={c}/><circle cx="3" cy="18" r="1" fill={c}/></svg>,
  csv: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
  home: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  plus: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  settings: (c="currentColor",s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  edit: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  back: (c="currentColor",s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>,
  check: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
  qr: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill={c}/><rect x="16" y="5" width="3" height="3" fill={c}/><rect x="5" y="16" width="3" height="3" fill={c}/><line x1="14" y1="14" x2="14" y2="14"/><line x1="17" y1="14" x2="21" y2="14"/><line x1="14" y1="17" x2="14" y2="21"/><line x1="17" y1="17" x2="21" y2="17"/></svg>,
  search: (c="currentColor",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  calendar: (c="currentColor",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chart: (c="currentColor",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  person: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  pin: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  download: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  upload: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  share: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  logout: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  hash: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
  chevronLeft: (c="currentColor",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>,
  close: (c="currentColor",s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  checkCircle: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>,
  clock: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  globe: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  info: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  save: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  warning: (c="currentColor",s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [readings, setReadings] = useState({ M001: 135, M002: 250, M003: 195, M004: 310, M005: 125 });
  const [loaded, setLoaded] = useState(false);
  const [smsSent, setSmsSent] = useState(0);
  const [serviceIp, setServiceIp] = useState("...");

  // ═══ شاشة الخدمة (للتطبيق Android فقط) ═══
  const isAndroidApp = window.Capacitor?.isNativePlatform?.() || window.location.protocol === 'capacitor:';

  useEffect(() => {
    // الحصول على IP الهاتف
    if (isAndroidApp) {
      fetch('https://api.ipify.org?format=json')
        .catch(() => {})
      // نستخدم RTCPeerConnection للحصول على IP المحلي
      try {
        const pc = new RTCPeerConnection({iceServers:[]});
        pc.createDataChannel('');
        pc.createOffer().then(o => pc.setLocalDescription(o));
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            const ip = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            if (ip) setServiceIp(ip[1]);
          }
        };
      } catch(e) {}
    }
  }, [isAndroidApp]);
  const [searchText, setSearchText] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [newReading, setNewReading] = useState("");
  const [readingError, setReadingError] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [csvExported, setCsvExported] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editSub, setEditSub] = useState(null);

  // ═══ تحميل البيانات من Firebase عند البداية ═══
  useEffect(() => {
    async function loadData() {
      const subs = await loadFromFirebase("subscribers", initialSubscribers);
      const reads = await loadFromFirebase("readings", { M001: 135, M002: 250, M003: 195, M004: 310, M005: 125 });
      setSubscribers(subs);
      setReadings(reads);
      setLoaded(true);
    }
    loadData();
  }, []);

  // ═══ حفظ تلقائي عند كل تغيير ═══
  useEffect(() => { if (loaded) saveToFirebase("subscribers", subscribers); }, [subscribers, loaded]);
  useEffect(() => { if (loaded) saveToFirebase("readings", readings); }, [readings, loaded]);

  const totalSubscribers = subscribers.length;
  const readCount = Object.keys(readings).filter(id => subscribers.find(s => s.id === id)).length;
  const totalConsumption = Object.entries(readings).reduce((acc, [id, val]) => {
    const sub = subscribers.find(s => s.id === id);
    return sub ? acc + Math.max(0, val - sub.lastReading) : acc;
  }, 0);

  const filteredSubs = useMemo(() =>
    subscribers.filter(s =>
      s.id.toLowerCase().includes(searchText.toLowerCase()) ||
      s.name.includes(searchText) ||
      s.phone.includes(searchText)
    ), [subscribers, searchText]);

  const nextId = useMemo(() => {
    const nums = subscribers.map(s => parseInt(s.id.replace(/\D/g, ""))).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return "M" + String(max + 1).padStart(3, "0");
  }, [subscribers]);

  function validateForm(f, isEdit = false) {
    const errs = {};
    if (!f.id.trim()) errs.id = "رقم العداد مطلوب";
    else if (!/^[A-Za-z0-9]+$/.test(f.id.trim())) errs.id = "أحرف وأرقام فقط";
    else {
      const dup = subscribers.find(s => s.id.toLowerCase() === f.id.trim().toLowerCase() && (!isEdit || s.id !== editSub?.id));
      if (dup) errs.id = "رقم العداد مستخدم مسبقاً";
    }
    if (!f.name.trim()) errs.name = "الاسم مطلوب";
    if (!f.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9 +]+$/.test(f.phone)) errs.phone = "رقم هاتف غير صحيح";
    if (!f.address.trim()) errs.address = "العنوان مطلوب";
    if (!String(f.lastReading).trim()) errs.lastReading = "القراءة الابتدائية مطلوبة";
    else if (isNaN(parseInt(f.lastReading)) || parseInt(f.lastReading) < 0) errs.lastReading = "قراءة غير صحيحة";
    return errs;
  }

  function openAddSubscriber() {
    setEditSub(null); setForm({ ...emptyForm, id: nextId }); setFormErrors({}); setFormSuccess(""); setScreen("subForm");
  }
  function openEditSubscriber(sub) {
    setEditSub(sub); setForm({ id: sub.id, name: sub.name, phone: sub.phone, address: sub.address, lastReading: String(sub.lastReading) }); setFormErrors({}); setFormSuccess(""); setScreen("subForm");
  }
  function handleSaveSubscriber() {
    const isEdit = !!editSub;
    const errs = validateForm(form, isEdit);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const newId = form.id.trim().toUpperCase();
    if (isEdit) {
      const oldId = editSub.id;
      setSubscribers(prev => prev.map(s => s.id === oldId
        ? { id: newId, name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), lastReading: parseInt(form.lastReading) } : s));
      if (oldId !== newId) {
        setReadings(prev => { const n = { ...prev }; if (n[oldId] !== undefined) { n[newId] = n[oldId]; delete n[oldId]; } return n; });
      }
      setFormSuccess("edit");
    } else {
      setSubscribers(prev => [...prev, { id: newId, name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), lastReading: parseInt(form.lastReading) }]);
      setFormSuccess("add");
    }
    setTimeout(() => { setFormSuccess(""); setScreen("subscribers"); }, 1400);
  }
  function handleDeleteSubscriber(sub) {
    setSubscribers(prev => prev.filter(s => s.id !== sub.id));
    setReadings(prev => { const n = { ...prev }; delete n[sub.id]; return n; });
    setDeleteConfirm(null); setScreen("subscribers");
  }
  function handleSelectSub(sub) {
    setSelectedSub(sub); setNewReading(readings[sub.id] ? String(readings[sub.id]) : ""); setReadingError(""); setScreen("enterReading");
  }
  function handleSaveReading() {
    const val = parseInt(newReading);
    if (!newReading || isNaN(val)) { setReadingError("الرجاء إدخال قراءة صحيحة"); return; }
    if (val < selectedSub.lastReading) { setReadingError("القراءة الجديدة أقل من القراءة السابقة!"); return; }
    setReadings(prev => ({ ...prev, [selectedSub.id]: val }));
    setSavedMsg(true);
    setTimeout(() => { setSavedMsg(false); setScreen("subscribers"); }, 1200);
  }

  // ── Header ──
  function Header({ title, onBack, action }) {
    return (
      <div style={{ background: "#1565C0", color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icon.back("#fff", 22)}</button>}
          <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
        </div>
        {action && <button onClick={action.fn} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>{action.icon && action.icon}{action.label}</button>}
      </div>
    );
  }

  // ── Delete Modal ──
  function DeleteModal() {
    if (!deleteConfirm) return null;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 320, width: "100%", direction: "rtl", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 64, height: 64, background: "#FFF0F0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>{Icon.trash("#e53935", 28)}</div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>حذف المنخرط</div>
          <div style={{ color: "#555", marginBottom: 4, fontSize: 14 }}>هل أنت متأكد من حذف:</div>
          <div style={{ fontWeight: 700, color: "#e53935", fontSize: 16, marginBottom: 4 }}>{deleteConfirm.name}</div>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>رقم العداد: {deleteConfirm.id} — لا يمكن التراجع</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDeleteConfirm(null)} style={{ ...styles.outlineBtn, flex: 1, padding: "11px" }}>إلغاء</button>
            <button onClick={() => handleDeleteSubscriber(deleteConfirm)} style={{ ...styles.primaryBtn, flex: 1, padding: "11px", background: "#e53935", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{Icon.trash("#fff", 16)} حذف</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // HOME
  // ══════════════════════════════════════
  // شاشة الخدمة للتطبيق Android
  if (isAndroidApp) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px', fontFamily: 'Arial, sans-serif',
      direction: 'rtl', color: 'white'
    }}>
      {/* شعار */}
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, marginBottom: 24,
        boxShadow: '0 0 40px rgba(37,99,235,0.5)'
      }}>💧</div>

      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', textAlign: 'center' }}>
        جمعية البركة للتنمية
      </h1>
      <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 40px', textAlign: 'center' }}>
        تسيير الماء الصالح للشرب
      </p>

      {/* حالة الخدمة */}
      <div style={{
        background: 'rgba(255,255,255,0.07)', borderRadius: 16,
        padding: '24px', width: '100%', maxWidth: 320,
        border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: '#22C55E', boxShadow: '0 0 10px #22C55E'
          }}/>
          <span style={{ fontSize: 15, fontWeight: 600 }}>الخدمة تعمل في الخلفية</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>عنوان IP</span>
            <span style={{ fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace' }}>{serviceIp}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>المنفذ</span>
            <span style={{ fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace' }}>8765</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>رسائل مرسلة</span>
            <span style={{ fontWeight: 700, color: '#22C55E' }}>{smsSent}</span>
          </div>
        </div>
      </div>

      {/* تعليمات */}
      <div style={{
        background: 'rgba(37,99,235,0.15)', borderRadius: 12,
        padding: '16px', width: '100%', maxWidth: 320,
        border: '1px solid rgba(37,99,235,0.3)'
      }}>
        <p style={{ fontSize: 12, color: '#93C5FD', margin: 0, lineHeight: 1.8, textAlign: 'center' }}>
          📡 تأكد أن الحاسوب والهاتف<br/>
          متصلان بنفس شبكة WiFi<br/>
          ثم أرسل SMS من برنامج الحاسوب
        </p>
      </div>

      <p style={{ fontSize: 11, color: '#475569', marginTop: 32, textAlign: 'center' }}>
        يمكنك إغلاق هذه الشاشة — الخدمة ستبقى تعمل
      </p>
    </div>
  );

  if (screen === "home") return (
    <div style={styles.app}>
      <DeleteModal />
      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg,#1565C0,#1976D2)", color: "#fff", padding: "18px 16px 20px", direction: "rtl", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 0.3 }}>جمعية البركة</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>تسيير الماء الصالح للشرب</div>
          </div>
          <div style={{ width: 46, height: 46, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icon.water("#fff", 26)}
          </div>
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 8 }}>
        {/* Month badge */}
        <div style={{ margin: "14px 14px 0", background: "#E3F2FD", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, direction: "rtl" }}>
          {Icon.calendar("#1565C0", 18)}
          <span style={{ color: "#1565C0", fontWeight: 600, fontSize: 14 }}>الشهر الحالي: {MONTH}</span>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "14px 14px 0", direction: "rtl" }}>
          {[
            { icon: Icon.meter("#1565C0", 32), label: "إدخال القراءات", action: () => setScreen("subscribers"), color: "#E3F2FD", accent: "#1565C0" },
            { icon: Icon.users("#2E7D32", 32), label: "لائحة المنخرطين", action: () => setScreen("subscribers"), color: "#E8F5E9", accent: "#2E7D32" },
            { icon: Icon.list("#E65100", 32), label: "القراءات المسجلة", action: () => setScreen("recordedReadings"), color: "#FFF3E0", accent: "#E65100" },
            { icon: Icon.csv("#6A1B9A", 32), label: "تصدير CSV", action: () => setScreen("exportCSV"), color: "#F3E5F5", accent: "#6A1B9A" },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{ background: item.color, border: `1.5px solid ${item.color}`, borderRadius: 16, padding: "18px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: item.accent, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "transform .1s" }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ margin: "14px", background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "14px 14px 10px", direction: "rtl", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6, color: "#333" }}>
            {Icon.chart("#333", 18)} إحصائيات سريعة
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <Stat label="إجمالي المنخرطين" value={totalSubscribers} color="#1565C0" />
            <div style={{ width: 1, background: "#eee" }} />
            <Stat label="غير مقروءة" value={totalSubscribers - readCount} color="#F57C00" />
            <div style={{ width: 1, background: "#eee" }} />
            <Stat label="تمت قراءتها" value={readCount} color="#2E7D32" />
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 12px", borderTop: "1px solid #eee", background: "#fff", flexShrink: 0 }}>
        {[
          { icon: (a) => Icon.home(a ? "#1565C0" : "#9E9E9E", 22), label: "الرئيسية", active: true, action: () => setScreen("home") },
          { icon: (a) => Icon.plus(a ? "#1565C0" : "#9E9E9E", 22), label: "منخرط جديد", active: false, action: openAddSubscriber },
          { icon: (a) => Icon.settings(a ? "#1565C0" : "#9E9E9E", 22), label: "الإعدادات", active: false, action: () => setScreen("settings") },
        ].map(n => (
          <button key={n.label} onClick={n.action} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: n.active ? "#1565C0" : "#9E9E9E", fontWeight: n.active ? 700 : 400, fontSize: 11, minWidth: 60 }}>
            {n.icon(n.active)}
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ══════════════════════════════════════
  // SUBSCRIBERS LIST
  // ══════════════════════════════════════
  if (screen === "subscribers") return (
    <div style={styles.app}>
      <DeleteModal />
      <Header title="لائحة المنخرطين" onBack={() => setScreen("home")} action={{ icon: Icon.plus("#fff", 15), label: "إضافة", fn: openAddSubscriber }} />
      <div style={{ padding: "10px 12px", background: "#f5f5f5", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", padding: "9px 13px", direction: "rtl", gap: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {Icon.search("#aaa", 18)}
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="بحث برقم العداد أو الاسم أو الهاتف..."
            style={{ border: "none", outline: "none", width: "100%", fontSize: 14, direction: "rtl", background: "transparent" }} />
          {searchText && <button onClick={() => setSearchText("")} style={{ background: "#eee", border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>{Icon.close("#666", 11)}</button>}
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {filteredSubs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#bbb" }}>{Icon.search("#ddd", 40)}<div style={{ marginTop: 8 }}>لا توجد نتائج</div></div>}
        {filteredSubs.map(sub => {
          const hasReading = readings[sub.id] !== undefined;
          return (
            <div key={sub.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid #f3f3f3", direction: "rtl", gap: 10, background: "#fff" }}>
              <div onClick={() => handleSelectSub(sub)} style={{ width: 44, height: 44, borderRadius: "50%", background: hasReading ? "#E8F5E9" : "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                {hasReading ? Icon.checkCircle("#2E7D32", 22) : Icon.meter("#1565C0", 22)}
              </div>
              <div onClick={() => handleSelectSub(sub)} style={{ flex: 1, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{sub.name}</span>
                  <span style={{ fontSize: 12, color: "#1565C0", fontWeight: 600, background: "#E3F2FD", borderRadius: 6, padding: "2px 7px" }}>{sub.id}</span>
                </div>
                <div style={{ color: "#1565C0", fontSize: 13, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>{Icon.phone("#1565C0", 12)} {sub.phone}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>{Icon.pin("#bbb", 12)} {sub.address}</div>
              </div>
              <button onClick={() => openEditSubscriber(sub)} style={{ background: "#F5F5F5", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {Icon.edit("#555", 18)}
              </button>
            </div>
          );
        })}
        <div style={{ textAlign: "center", padding: 12, color: "#bbb", fontSize: 13 }}>{filteredSubs.length} منخرط</div>
      </div>
    </div>
  );

  // ══════════════════════════════════════
  // ADD / EDIT FORM
  // ══════════════════════════════════════
  if (screen === "subForm") return (
    <div style={styles.app}>
      <Header title={editSub ? "تعديل بيانات المنخرط" : "إضافة منخرط جديد"} onBack={() => setScreen("subscribers")} />
      <div style={{ padding: 16, direction: "rtl", overflowY: "auto", flex: 1 }}>
        {/* ID field */}
        <FormField label={editSub ? "رقم العداد (قابل للتعديل)" : "رقم العداد"} placeholder="مثال: M008"
          value={form.id} onChange={v => setForm(f => ({ ...f, id: v.toUpperCase() }))}
          error={formErrors.id} icon={Icon.hash("#888", 18)} />
        {editSub && form.id !== editSub.id && (
          <div style={{ background: "#FFF8E1", border: "1px solid #FFD54F", borderRadius: 10, padding: "9px 12px", marginBottom: 14, fontSize: 13, color: "#7B5800", display: "flex", alignItems: "center", gap: 6 }}>
            {Icon.warning("#F9A825", 16)} تغيير الرقم من <strong>{editSub.id}</strong> إلى <strong>{form.id || "..."}</strong>
          </div>
        )}
        <FormField label="الاسم الكامل" placeholder="مثال: محمد العلوي" value={form.name}
          onChange={v => setForm(f => ({ ...f, name: v }))} error={formErrors.name} icon={Icon.person("#888", 18)} />
        <FormField label="رقم الهاتف" placeholder="06 XX XX XX XX" value={form.phone}
          onChange={v => setForm(f => ({ ...f, phone: v }))} error={formErrors.phone} icon={Icon.phone("#888", 18)} type="tel" />
        <FormField label="العنوان" placeholder="الحي، الزنقة، رقم البيت" value={form.address}
          onChange={v => setForm(f => ({ ...f, address: v }))} error={formErrors.address} icon={Icon.pin("#888", 18)} />
        <FormField label="القراءة الابتدائية (م³)" placeholder="0" value={form.lastReading}
          onChange={v => setForm(f => ({ ...f, lastReading: v }))} error={formErrors.lastReading} icon={Icon.meter("#888", 18)} type="number" />

        {formSuccess === "add" && <SuccessMsg text="تمت إضافة المنخرط بنجاح!" />}
        {formSuccess === "edit" && <SuccessMsg text="تم تحديث البيانات بنجاح!" />}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={() => setScreen("subscribers")} style={{ ...styles.outlineBtn, flex: 1 }}>إلغاء</button>
          <button onClick={handleSaveSubscriber} style={{ ...styles.primaryBtn, flex: 2, background: editSub ? "#1565C0" : "#1565C0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {editSub ? Icon.save("#fff", 18) : Icon.check("#fff", 18)}
            {editSub ? "حفظ التعديلات" : "حفظ المنخرط"}
          </button>
        </div>

        {editSub && (
          <button onClick={() => setDeleteConfirm(editSub)} style={{ ...styles.outlineBtn, width: "100%", marginTop: 12, color: "#e53935", borderColor: "#FFCDD2", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#FFF5F5" }}>
            {Icon.trash("#e53935", 18)} حذف هذا المنخرط
          </button>
        )}
      </div>
      <DeleteModal />
    </div>
  );

  // ══════════════════════════════════════
  // ENTER READING
  // ══════════════════════════════════════
  if (screen === "enterReading" && selectedSub) {
    const consumption = newReading && !isNaN(parseInt(newReading)) ? parseInt(newReading) - selectedSub.lastReading : null;
    return (
      <div style={styles.app}>
        <Header title="إدخال قراءة جديدة" onBack={() => setScreen("subscribers")} action={{ icon: Icon.edit("#fff", 14), label: "تعديل", fn: () => openEditSubscriber(selectedSub) }} />
        <div style={{ padding: 16, direction: "rtl", overflowY: "auto", flex: 1 }}>
          <button style={{ ...styles.outlineBtn, width: "100%", marginBottom: 16, color: "#1565C0", borderColor: "#BBDEFB", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icon.qr("#1565C0", 20)} مسح QR العداد
          </button>
          <FieldRO label="رقم العداد" value={selectedSub.id} />
          <FieldRO label="اسم المنخرط" value={selectedSub.name} />
          <FieldRO label="القراءة السابقة" value={selectedSub.lastReading} highlight />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14, color: "#444" }}>القراءة الجديدة <span style={{ color: "red" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input value={newReading} onChange={e => { setNewReading(e.target.value); setReadingError(""); }} type="number" inputMode="numeric"
                style={{ width: "100%", padding: "12px 14px", border: `2px solid ${readingError ? "#e53935" : "#1565C0"}`, borderRadius: 12, fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1565C0", textAlign: "center" }} />
              {newReading && <button onClick={() => setNewReading("")} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "#eee", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>{Icon.close("#666", 12)}</button>}
            </div>
            {readingError && <div style={{ color: "#e53935", fontSize: 13, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>{Icon.warning("#e53935", 14)} {readingError}</div>}
          </div>
          {consumption !== null && consumption >= 0 && (
            <div style={{ background: "#E8F5E9", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #C8E6C9" }}>
              <span style={{ color: "#2E7D32", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{Icon.water("#2E7D32", 18)} الاستهلاك</span>
              <span style={{ color: "#2E7D32", fontWeight: 800, fontSize: 20 }}>{consumption} م³</span>
            </div>
          )}
          {savedMsg && <SuccessMsg text="تم حفظ القراءة بنجاح!" />}
          <button onClick={handleSaveReading} style={{ ...styles.primaryBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icon.check("#fff", 20)} حفظ القراءة
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // RECORDED READINGS
  // ══════════════════════════════════════
  if (screen === "recordedReadings") {
    const total = subscribers.reduce((acc, sub) => {
      const r = readings[sub.id]; return r ? acc + Math.max(0, r - sub.lastReading) : acc;
    }, 0);
    return (
      <div style={styles.app}>
        <Header title="القراءات المسجلة" onBack={() => setScreen("home")} />
        <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 0", background: "#fff", borderBottom: "1px solid #eee", flexShrink: 0 }}>
          <Stat label="الكل" value={totalSubscribers} color="#1565C0" />
          <div style={{ width: 1, background: "#eee" }} />
          <Stat label="تمت قراءتها" value={readCount} color="#2E7D32" />
          <div style={{ width: 1, background: "#eee" }} />
          <Stat label="غير مقروءة" value={totalSubscribers - readCount} color="#F57C00" />
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {subscribers.map(sub => {
            const r = readings[sub.id]; const cons = r != null ? r - sub.lastReading : null;
            return (
              <div key={sub.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid #f3f3f3", direction: "rtl", gap: 10, background: "#fff" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: r != null ? "#E8F5E9" : "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {r != null ? Icon.checkCircle("#2E7D32", 20) : Icon.clock("#F57C00", 20)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{sub.name}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{sub.id}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  {r != null ? <><div style={{ fontWeight: 700, fontSize: 15, color: "#333" }}>{r}</div><div style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>{cons} م³</div></> : <span style={{ color: "#ddd", fontSize: 13 }}>لم تُقرأ</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 16px", background: "#fff", borderTop: "2px solid #E3F2FD", direction: "rtl", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 700, color: "#333", display: "flex", alignItems: "center", gap: 6 }}>{Icon.water("#1565C0", 18)} إجمالي الاستهلاك</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#1565C0" }}>{total} م³</span>
        </div>
        <div style={{ padding: "0 14px 14px", flexShrink: 0 }}>
          <button onClick={() => setScreen("exportCSV")} style={{ ...styles.outlineBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icon.csv("#555", 18)} تصدير CSV
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // EXPORT CSV
  // ══════════════════════════════════════
  if (screen === "exportCSV") {
    function doExport() {
      // نفس هيكل النموذج: رقم العداد, القراءة الجديدة
      const rows = [["رقم العداد", "القراءة الجديدة"]];
      subscribers.forEach(sub => {
        rows.push([sub.id, readings[sub.id] ?? ""]);
      });
      const blob = new Blob(["\uFEFF" + rows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `قراءات_${MONTH}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setCsvExported(true);
      setTimeout(() => setCsvExported(false), 2000);
    }

    function doExportTemplate() {
      // نموذج فارغ للملء
      const rows = [["رقم العداد", "القراءة الجديدة"]];
      subscribers.forEach(sub => rows.push([sub.id, ""]));
      const blob = new Blob(["\uFEFF" + rows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `نموذج-القراءات.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return (
      <div style={styles.app}>
        <Header title="تصدير / استيراد CSV" onBack={() => setScreen("home")} />
        <div style={{ padding: 16, direction: "rtl", flex: 1, overflowY: "auto" }}>

          {/* هيكل الملف */}
          <div style={{ background: "#E3F2FD", borderRadius: 12, padding: 14, marginBottom: 16, border: "1px solid #BBDEFB" }}>
            <div style={{ fontWeight: 700, color: "#1565C0", marginBottom: 8, fontSize: 14 }}>📋 هيكل ملف CSV</div>
            <div style={{ background: "#fff", borderRadius: 8, padding: 10, fontFamily: "monospace", fontSize: 12, direction: "ltr", color: "#333", lineHeight: 1.8 }}>
              رقم العداد,القراءة الجديدة<br/>
              M001,145<br/>
              M002,267<br/>
              M003,195
            </div>
          </div>

          {/* إحصائيات */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #eee", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee", alignItems: "center" }}>
              <span style={{ color: "#555", fontSize: 14 }}>عدد المنخرطين</span>
              <span style={{ fontWeight: 700, color: "#1565C0" }}>{subscribers.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee", alignItems: "center" }}>
              <span style={{ color: "#555", fontSize: 14 }}>قراءات مسجلة</span>
              <span style={{ fontWeight: 700, color: "#2E7D32" }}>{readCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", alignItems: "center" }}>
              <span style={{ color: "#555", fontSize: 14 }}>إجمالي الاستهلاك</span>
              <span style={{ fontWeight: 700, color: "#1565C0" }}>{totalConsumption} م³</span>
            </div>
          </div>

          {csvExported && <SuccessMsg text="تم التصدير بنجاح!" />}

          {/* أزرار التصدير */}
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#333", fontSize: 14 }}>📤 تصدير</div>
          <button onClick={doExport} style={{ ...styles.primaryBtn, width: "100%", background: "#2E7D32", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
            {Icon.download("#fff", 18)} تصدير القراءات (CSV)
          </button>
          <button onClick={doExportTemplate} style={{ ...styles.outlineBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {Icon.csv("#555", 18)} تحميل نموذج فارغ
          </button>

          {/* استيراد */}
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#333", fontSize: 14 }}>📥 استيراد</div>
          <label style={{ display: "block", width: "100%", cursor: "pointer" }}>
            <div style={{ ...styles.outlineBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#F3E5F5", borderColor: "#CE93D8", color: "#6A1B9A", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, boxSizing: "border-box" }}>
              {Icon.upload("#6A1B9A", 18)} اختيار ملف CSV للاستيراد
            </div>
            <input type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => {
                const text = ev.target.result.replace(/^\uFEFF/, '').trim();
                const lines = text.split(/\r?\n/).filter(l => l.trim());
                const startIdx = lines[0].includes('رقم') || lines[0].toLowerCase().includes('id') ? 1 : 0;
                let imported = 0, errors = 0;
                const newReadings = { ...readings };
                for (let i = startIdx; i < lines.length; i++) {
                  const parts = lines[i].split(',').map(p => p.trim().replace(/"/g, ''));
                  if (parts.length < 2) continue;
                  const id = parts[0].toUpperCase();
                  const val = parseInt(parts[1]);
                  const sub = subscribers.find(s => s.id === id);
                  if (!sub || isNaN(val) || val < sub.lastReading) { errors++; continue; }
                  newReadings[id] = val;
                  imported++;
                }
                setReadings(newReadings);
                setCsvExported(true);
                setTimeout(() => setCsvExported(false), 3000);
                alert(`✅ تم استيراد ${imported} قراءة${errors > 0 ? `\n⚠️ ${errors} صف بها أخطاء` : ''}`);
              };
              reader.readAsText(file, 'utf-8');
              e.target.value = '';
            }} />
          </label>
          <div style={{ fontSize: 12, color: "#999", marginTop: 8, textAlign: "center" }}>
            الملف يجب أن يحتوي على: رقم العداد، القراءة الجديدة
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════
  if (screen === "settings") return (
    <div style={styles.app}>
      <Header title="الإعدادات" onBack={() => setScreen("home")} />
      <div style={{ direction: "rtl", flex: 1, overflowY: "auto" }}>
        {[
          { icon: Icon.calendar("#1565C0", 20), label: "الشهر الحالي", value: MONTH, bg: "#E3F2FD" },
          { icon: Icon.users("#2E7D32", 20), label: "عدد المنخرطين", value: `${totalSubscribers} منخرط`, bg: "#E8F5E9" },
          { icon: Icon.save("#E65100", 20), label: "النسخ الاحتياطي", value: "آخر نسخة: 10-06-2026", bg: "#FFF3E0" },
          { icon: Icon.globe("#6A1B9A", 20), label: "اللغة", value: "العربية", bg: "#F3E5F5" },
          { icon: Icon.info("#0277BD", 20), label: "حول التطبيق", value: "الإصدار 1.0.0", bg: "#E1F5FE" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #f3f3f3", background: "#fff", cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, background: item.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 12, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{item.label}</div><div style={{ fontSize: 12, color: "#aaa" }}>{item.value}</div></div>
            {Icon.chevronLeft("#ccc", 18)}
          </div>
        ))}
        <div style={{ padding: 16 }}>
          <button onClick={() => setScreen("home")} style={{ ...styles.primaryBtn, width: "100%", background: "#e53935", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icon.logout("#fff", 18)} تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

// ── Stat ──
function Stat({ label, value, color }) {
  return <div style={{ textAlign: "center", padding: "0 8px" }}><div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div><div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{label}</div></div>;
}

// ── Success Message ──
function SuccessMsg({ text }) {
  return (
    <div style={{ background: "#E8F5E9", color: "#2E7D32", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>
      {text}
    </div>
  );
}

// ── Form Field ──
function FormField({ label, placeholder, value, onChange, error, icon, type = "text" }) {
  return (
    <div style={{ marginBottom: 16, direction: "rtl" }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14, color: "#444" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{icon}</span>
        <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
          style={{ width: "100%", padding: "11px 42px 11px 13px", border: `1.5px solid ${error ? "#e53935" : "#e0e0e0"}`, borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", direction: "rtl", background: error ? "#fff5f5" : "#fff", transition: "border-color .2s" }} />
      </div>
      {error && <div style={{ color: "#e53935", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {error}
      </div>}
    </div>
  );
}

// ── Read-only Field ──
function FieldRO({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: 14, direction: "rtl" }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14, color: "#444" }}>{label}</label>
      <input readOnly value={value} onChange={() => {}}
        style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${highlight ? "#BBDEFB" : "#e0e0e0"}`, borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: highlight ? "#E3F2FD" : "#fafafa", color: highlight ? "#1565C0" : "#555", fontWeight: highlight ? 700 : 400 }} />
    </div>
  );
}

const styles = {
  app: { maxWidth: 420, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f5f7fa", direction: "rtl" },
  primaryBtn: { background: "#1565C0", color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  outlineBtn: { background: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};
