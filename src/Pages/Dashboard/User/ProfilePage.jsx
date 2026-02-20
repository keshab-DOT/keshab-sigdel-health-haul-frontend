import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <h1 className="text-xl font-bold text-green-600">HealthHaul Nepal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Customer Portal</p>
      </div>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Customer"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h4 className="font-bold text-green-400 text-lg mb-3">HealthHaul Nepal</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner for fast, reliable medicine delivery across Nepal.
              Licensed pharmacies, verified products, doorstep delivery.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Licensed Pharmacies", "30-min Delivery", "Secure Payment"].map(t => (
                <span key={t} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Search Medicines", "My Orders", "My Cart", "Profile"].map(l => (
                <li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Help Center", "Contact Us", "Refund Policy", "Terms of Service"].map(l => (
                <li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex justify-between items-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3.5 text-left hover:bg-gray-50 transition">
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">{a}</div>}
    </div>
  );
}

export default function ProfilePage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser]       = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm]       = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [ticket, setTicket]   = useState({ category: "general", subject: "", message: "" });
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    setForm({ name: stored.name || "", email: stored.email || "", phone: stored.phone || "" });
    // if coming from /user/support route, show support tab
    if (location.pathname === "/user/support") setActiveTab("support");
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update localStorage with new name
      const updated = { ...user, name: form.name, phone: form.phone };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) { showToast("Please fill all fields", "error"); return; }
    setTicketLoading(true);
    // Simulate ticket submission (no backend endpoint assumed)
    setTimeout(() => { setTicketSent(true); setTicketLoading(false); }, 1000);
  };

  const TABS = [
    { key: "profile", label: "My Profile" },
    { key: "support", label: "Help & Support" },
    { key: "account", label: "Account Info" },
  ];

  const FAQS = [
    { q: "How do I track my order?", a: "Go to 'My Orders' from the sidebar. Each order shows a real-time tracking bar with statuses: Pending → On the Way → Delivered." },
    { q: "How long does delivery take?", a: "We aim to deliver within 30 minutes for orders within the delivery area. Times may vary based on location and demand." },
    { q: "Can I cancel my order?", a: "Orders can only be cancelled before they are dispatched. Please contact our support team immediately if you need to cancel." },
    { q: "What payment methods are accepted?", a: "We accept Cash on Delivery (COD), Khalti, and eSewa digital wallets." },
    { q: "How do I return a medicine?", a: "Returns are accepted for sealed, unopened medicines within 24 hours of delivery. Contact our support team to initiate a return." },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="profile" user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-h-screen">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
            {toast.type === "error"
              ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Profile & Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account information and preferences</p>
        </div>

        <main className="flex-1 px-8 py-6 space-y-5">
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 flex items-center gap-5 text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-green-100 text-sm">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg className="w-3.5 h-3.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs text-green-200 font-medium">Verified Account</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-200">Account Type</p>
              <p className="font-bold text-sm capitalize">{user.roles?.[0] || user.roles || "Customer"}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === key ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* ── My Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
              <h3 className="text-base font-bold text-gray-800 mb-5">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" value={form.email} disabled
                    className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"/>
                  <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} placeholder="98XXXXXXXX"
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"/>
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-sm mt-2">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ── Help & Support Tab ── */}
          {activeTab === "support" && (
            <div className="grid md:grid-cols-2 gap-5">
              {/* Ticket Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-800 mb-1">Submit a Support Ticket</h3>
                <p className="text-xs text-gray-400 mb-5">We typically respond within 2–4 hours</p>
                {ticketSent ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">✅</div>
                    <h4 className="font-bold text-gray-800 mb-1">Ticket Submitted!</h4>
                    <p className="text-gray-500 text-sm mb-5">We'll get back to you shortly.</p>
                    <button onClick={() => { setTicketSent(false); setTicket({ category: "general", subject: "", message: "" }); }}
                      className="border border-green-500 text-green-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select value={ticket.category} onChange={e => setTicket(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="payment">Payment Problem</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="refund">Refund Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                      <input type="text" placeholder="Brief description of your issue"
                        value={ticket.subject} onChange={e => setTicket(p => ({ ...p, subject: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" required/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                      <textarea rows={4} placeholder="Describe your issue in detail..."
                        value={ticket.message} onChange={e => setTicket(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" required/>
                    </div>
                    <button type="submit" disabled={ticketLoading}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition">
                      {ticketLoading ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </form>
                )}
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-800 mb-1">Frequently Asked Questions</h3>
                <p className="text-xs text-gray-400 mb-5">Quick answers to common questions</p>
                <div className="space-y-2">
                  {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a}/>)}
                </div>
                <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Call Support</p>
                    <p className="text-green-600 font-bold text-sm">+977-01-XXXXXXX</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Account Info Tab ── */}
          {activeTab === "account" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
              <h3 className="text-base font-bold text-gray-800 mb-5">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: "Full Name",     value: user.name },
                  { label: "Email",         value: user.email },
                  { label: "Phone",         value: form.phone || "Not set" },
                  { label: "Account Type",  value: user.roles?.[0] || user.roles || "Customer" },
                  { label: "Account ID",    value: user._id || user.id || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500 font-medium">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%] break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="mt-6 border border-red-100 rounded-xl p-4 bg-red-50/50">
                <h4 className="text-sm font-bold text-red-600 mb-1">Danger Zone</h4>
                <p className="text-xs text-gray-500 mb-3">This action will log you out of all sessions.</p>
                <button onClick={handleLogout}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition">
                  Logout of Account
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}