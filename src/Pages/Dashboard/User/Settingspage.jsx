import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Topbar({ user, cartCount, onLogout, navigate }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Dashboard</button>
        <button onClick={() => navigate("/user/search")}    className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")}    className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
      </nav>
      <div className="flex-1 max-w-sm mx-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search medicines, categories…" className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition" onFocus={() => navigate("/user/search")} readOnly/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-700 bg-gray-100 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left"><p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p><p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p></div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
          </div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{["Search Medicines","My Orders","My Cart","Profile"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-green-500" : "bg-gray-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`}/>
    </button>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition">
        <span className="text-[13px] font-semibold text-gray-800 pr-4">{q}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && <div className="px-4 pb-4 text-[12px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">{a}</div>}
    </div>
  );
}

const FAQS = [
  { q: "How do I track my order?", a: "Go to 'My Orders' from the top navigation. Each order shows a real-time tracking bar with statuses: Pending → On the Way → Delivered." },
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
  const [ticketSent, setTicketSent]       = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  const [notifs, setNotifs] = useState({ orderUpdates: true, deliveryAlerts: true, promotions: false, smsAlerts: true, emailDigest: false });
  const [prefs, setPrefs]   = useState({ saveAddress: true, searchHistory: true, analytics: false });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>{toast.msg}</div>}

      <Topbar user={user} cartCount={0} onLogout={handleLogout} navigate={navigate}/>

      <main className="flex-1 px-8 py-6 space-y-5">
        {/* Page header */}
        <div>
          <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Settings</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage your preferences and support</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[{ key: "notifications", label: "Notifications" }, { key: "privacy", label: "Privacy" }, { key: "support", label: "Help & Support" }].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${activeTab === key ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Notifications Tab ── */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
            <h3 className="text-[15px] font-black text-gray-900 mb-1">Notification Preferences</h3>
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
                  <Toggle enabled={notifs[key]} onChange={val => setNotifs(p => ({ ...p, [key]: val }))}/>
                </div>
              ))}
            </div>
            <button onClick={saveSettings} className="mt-5 w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 transition text-[13px]">Save Notification Settings</button>
          </div>
        )}

        {/* ── Privacy Tab ── */}
        {activeTab === "privacy" && (
          <div className="space-y-4 max-w-lg">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-[15px] font-black text-gray-900 mb-1">Privacy Preferences</h3>
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
                    <Toggle enabled={prefs[key]} onChange={val => setPrefs(p => ({ ...p, [key]: val }))}/>
                  </div>
                ))}
              </div>
              <button onClick={saveSettings} className="mt-5 w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 transition text-[13px]">Save Privacy Settings</button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[14px] font-black text-gray-900 mb-3">App Information</h3>
              <div className="space-y-0.5">
                {[
                  { label: "App Version", value: "v1.0.0" },
                  { label: "Platform", value: "Web" },
                  { label: "Support Email", value: "support@healthhaul.com.np" },
                  { label: "Working Hours", value: "Sun–Fri, 8 AM – 8 PM" },
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
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[15px] font-black text-gray-900 mb-0.5">Submit a Support Ticket</h3>
              <p className="text-[11px] text-gray-400 mb-5">We typically respond within 2–4 hours</p>
              {ticketSent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="font-black text-gray-800 mb-1 text-[15px]">Ticket Submitted!</h4>
                  <p className="text-gray-400 text-[13px] mb-5">We'll get back to you shortly.</p>
                  <button onClick={() => { setTicketSent(false); setTicket({ category: "general", subject: "", message: "" }); }}
                    className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition">Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Category</label>
                    <select value={ticket.category} onChange={e => setTicket(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50">
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Issue</option>
                      <option value="payment">Payment Problem</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="refund">Refund Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Subject</label>
                    <input type="text" placeholder="Brief description of your issue" value={ticket.subject} onChange={e => setTicket(p => ({ ...p, subject: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 transition" required/>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Message</label>
                    <textarea rows={4} placeholder="Describe your issue in detail…" value={ticket.message} onChange={e => setTicket(p => ({ ...p, message: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 resize-none bg-gray-50/50 transition" required/>
                  </div>
                  <button type="submit" disabled={ticketLoading}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 disabled:opacity-50 transition text-[13px]">
                    {ticketLoading ? "Submitting…" : "Submit Ticket"}
                  </button>
                </form>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[15px] font-black text-gray-900 mb-0.5">Frequently Asked Questions</h3>
              <p className="text-[11px] text-gray-400 mb-5">Quick answers to common questions</p>
              <div className="space-y-2">
                {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a}/>)}
              </div>
              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-600">Call Support</p>
                  <p className="text-green-600 font-black text-[13px]">+977-01-XXXXXXX</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}