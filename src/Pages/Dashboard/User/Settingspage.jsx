import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",   label: "Search Medicines", path: "/user/search",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",     label: "My Cart",          path: "/user/cart",     icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",   label: "My Orders",        path: "/user/orders",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile",  label: "Profile",          path: "/user/profile",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { key: "settings", label: "Settings",         path: "/user/settings", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
];

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0"><span className="text-white text-[11px] font-black">HH</span></div>
          <div><h1 className="text-[15px] font-bold text-gray-900 leading-tight">HealthHaul Nepal</h1><p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Customer Portal</p></div>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-green-50/80 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="overflow-hidden min-w-0"><p className="text-[13px] font-bold text-gray-800 truncate">{user?.name || "Customer"}</p><p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
              ${active === key ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-200/60" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all">
          <span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></span>Sign Out
        </button>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><span className="text-white text-[10px] font-black">HH</span></div><h4 className="font-bold text-green-400 text-base">HealthHaul Nepal</h4></div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your trusted partner for fast, reliable medicine delivery across Nepal.</p>
            <div className="flex flex-wrap gap-2 mt-4">{["Licensed Pharmacies","30-min Delivery","Secure Payment"].map(t=><span key={t} className="bg-gray-800/80 text-gray-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-700/50">{t}</span>)}</div>
          </div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">My Account</h5><ul className="space-y-2 text-gray-400 text-sm">{["Search Medicines","My Orders","My Cart","Profile"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Help & Support</h5><ul className="space-y-2 text-gray-400 text-sm">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex justify-between items-center"><p className="text-gray-500 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p><p className="text-gray-600 text-xs">Made with ❤️ in Nepal</p></div>
      </div>
    </footer>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-green-500" : "bg-gray-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-4.5" : "translate-x-0.5"}`}/>
    </button>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition">
        <span className="text-[13px] font-semibold text-gray-800 pr-4">{q}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && <div className="px-4 pb-4 text-[12px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">{a}</div>}
    </div>
  );
}

const FAQS = [
  { q: "How do I track my order?", a: "Go to 'My Orders' from the sidebar. Each order shows a real-time tracking bar with statuses: Pending → On the Way → Delivered." },
  { q: "How long does delivery take?", a: "We aim to deliver within 30 minutes for orders within the delivery area. Times may vary based on location and demand." },
  { q: "Can I cancel my order?", a: "Orders can only be cancelled before they are dispatched. Please contact our support team immediately if you need to cancel." },
  { q: "What payment methods are accepted?", a: "We accept Cash on Delivery (COD), Khalti, and eSewa digital wallets." },
  { q: "How do I return a medicine?", a: "Returns are accepted for sealed, unopened medicines within 24 hours of delivery. Contact our support team to initiate a return." },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [toast, setToast]   = useState(null);
  const [activeTab, setActiveTab] = useState("notifications");
  const [ticket, setTicket] = useState({ category: "general", subject: "", message: "" });
  const [ticketSent, setTicketSent]     = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  // Notification preferences stored locally
  const [notifs, setNotifs] = useState({
    orderUpdates:    true,
    deliveryAlerts:  true,
    promotions:      false,
    smsAlerts:       true,
    emailDigest:     false,
  });

  // Privacy / preferences
  const [prefs, setPrefs] = useState({
    saveAddress:     true,
    searchHistory:   true,
    analytics:       false,
  });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);

    // Load saved settings
    const savedNotifs = JSON.parse(localStorage.getItem("hh_notifs") || "null");
    const savedPrefs  = JSON.parse(localStorage.getItem("hh_prefs")  || "null");
    if (savedNotifs) setNotifs(savedNotifs);
    if (savedPrefs)  setPrefs(savedPrefs);
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const saveSettings = () => {
    localStorage.setItem("hh_notifs", JSON.stringify(notifs));
    localStorage.setItem("hh_prefs",  JSON.stringify(prefs));
    showToast("Settings saved successfully!");
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) { showToast("Please fill all fields", "error"); return; }
    setTicketLoading(true);
    setTimeout(() => { setTicketSent(true); setTicketLoading(false); }, 1000);
  };

  const TABS = [
    { key: "notifications", label: "Notifications" },
    { key: "privacy",       label: "Privacy" },
    { key: "support",       label: "Help & Support" },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="settings" user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
            {toast.type === "error"
              ? <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            {toast.msg}
          </div>
        )}

        <header className="bg-white border-b border-gray-100 px-7 py-4 sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Settings</h2>
          <p className="text-gray-400 text-xs mt-0.5">Manage your preferences and support</p>
        </header>

        <main className="flex-1 px-7 py-5 space-y-4">

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all
                  ${activeTab === key ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1">Notification Preferences</h3>
              <p className="text-[12px] text-gray-400 mb-5">Choose what you'd like to be notified about</p>

              <div className="space-y-0.5">
                {[
                  { key: "orderUpdates",   label: "Order Status Updates",   desc: "Get notified when your order status changes" },
                  { key: "deliveryAlerts", label: "Delivery Alerts",        desc: "Alerts when your delivery is on the way" },
                  { key: "smsAlerts",      label: "SMS Notifications",      desc: "Receive updates via text message" },
                  { key: "promotions",     label: "Promotions & Offers",    desc: "Deals, discounts and special offers" },
                  { key: "emailDigest",    label: "Weekly Email Digest",    desc: "A weekly summary of your orders and offers" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 pr-4">
                      <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <Toggle enabled={notifs[key]} onChange={val => setNotifs(p => ({ ...p, [key]: val }))} />
                  </div>
                ))}
              </div>

              <button onClick={saveSettings}
                className="mt-5 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-sm shadow-green-200 text-[13px]">
                Save Notification Settings
              </button>
            </div>
          )}

          {/* ── Privacy Tab ── */}
          {activeTab === "privacy" && (
            <div className="space-y-4 max-w-lg">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Privacy Preferences</h3>
                <p className="text-[12px] text-gray-400 mb-5">Control how your data is used</p>

                <div className="space-y-0.5">
                  {[
                    { key: "saveAddress",   label: "Save Delivery Addresses", desc: "Quickly reuse past addresses at checkout" },
                    { key: "searchHistory", label: "Save Search History",      desc: "See your recent medicine searches" },
                    { key: "analytics",     label: "Usage Analytics",          desc: "Help us improve the app (anonymous data only)" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                      <div className="flex-1 pr-4">
                        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <Toggle enabled={prefs[key]} onChange={val => setPrefs(p => ({ ...p, [key]: val }))} />
                    </div>
                  ))}
                </div>

                <button onClick={saveSettings}
                  className="mt-5 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-sm shadow-green-200 text-[13px]">
                  Save Privacy Settings
                </button>
              </div>

              {/* App info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-[14px] font-bold text-gray-900 mb-3">App Information</h3>
                <div className="space-y-0.5">
                  {[
                    { label: "App Version",      value: "v1.0.0" },
                    { label: "Platform",         value: "Web" },
                    { label: "Support Email",    value: "support@healthhaul.com.np" },
                    { label: "Working Hours",    value: "Sun–Fri, 8 AM – 8 PM" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <span className="text-[12px] text-gray-500">{label}</span>
                      <span className="text-[12px] font-semibold text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Help & Support Tab ── */}
          {activeTab === "support" && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Ticket */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 mb-0.5">Submit a Support Ticket</h3>
                <p className="text-[11px] text-gray-400 mb-5">We typically respond within 2–4 hours</p>
                {ticketSent ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✅</div>
                    <h4 className="font-bold text-gray-800 mb-1 text-[15px]">Ticket Submitted!</h4>
                    <p className="text-gray-400 text-sm mb-5">We'll get back to you shortly.</p>
                    <button onClick={() => { setTicketSent(false); setTicket({ category: "general", subject: "", message: "" }); }}
                      className="border border-green-500 text-green-600 px-5 py-2 rounded-xl text-[13px] font-semibold hover:bg-green-50 transition">
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Category</label>
                      <select value={ticket.category} onChange={e => setTicket(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 bg-gray-50/50">
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="payment">Payment Problem</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="refund">Refund Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Subject</label>
                      <input type="text" placeholder="Brief description of your issue"
                        value={ticket.subject} onChange={e => setTicket(p => ({ ...p, subject: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 bg-gray-50/50 transition" required/>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Message</label>
                      <textarea rows={4} placeholder="Describe your issue in detail…"
                        value={ticket.message} onChange={e => setTicket(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none bg-gray-50/50 transition" required/>
                    </div>
                    <button type="submit" disabled={ticketLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition text-[13px]">
                      {ticketLoading ? "Submitting…" : "Submit Ticket"}
                    </button>
                  </form>
                )}
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 mb-0.5">Frequently Asked Questions</h3>
                <p className="text-[11px] text-gray-400 mb-5">Quick answers to common questions</p>
                <div className="space-y-2">
                  {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a}/>)}
                </div>
                <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-600">Call Support</p>
                    <p className="text-green-600 font-bold text-[13px]">+977-01-XXXXXXX</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
        <Footer />
      </div>
    </div>
  );
}