import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

function InputField({ label, type = "text", value, onChange, disabled, placeholder, hint }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition
          ${disabled ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-gray-50/50"}`}
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const navigate  = useNavigate();
  const [user, setUser]           = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm]           = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    setForm({ name: stored.name || "", email: stored.email || "", phone: stored.phone || "" });
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
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

  const TABS = [
    { key: "profile", label: "My Profile" },
    { key: "account", label: "Account Info" },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="profile" user={user} onLogout={handleLogout} />
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
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Profile</h2>
          <p className="text-gray-400 text-xs mt-0.5">Manage your personal information</p>
        </header>

        <main className="flex-1 px-7 py-5 space-y-4">

          {/* Profile Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex items-center gap-5">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-black text-white flex-shrink-0 backdrop-blur-sm border border-white/20">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 relative">
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-green-100/80 text-xs">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <span className="text-[11px] text-green-200 font-medium">Verified Account</span>
              </div>
            </div>
            <div className="text-right relative">
              <p className="text-[11px] text-green-300 uppercase tracking-wider font-semibold">Account Type</p>
              <p className="font-bold text-[13px] text-white capitalize mt-0.5">{user.roles?.[0] || user.roles || "Customer"}</p>
            </div>
          </div>

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

          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
              <h3 className="text-[15px] font-bold text-gray-900 mb-5">Edit Profile</h3>
              <div className="space-y-4">
                <InputField label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                <InputField label="Email Address" type="email" value={form.email} disabled hint="Email cannot be changed" />
                <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX" />
                <button onClick={handleSaveProfile} disabled={saving}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition shadow-sm shadow-green-200 text-[13px] mt-2">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ── Account Info Tab ── */}
          {activeTab === "account" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
              <h3 className="text-[15px] font-bold text-gray-900 mb-5">Account Information</h3>
              <div className="space-y-1 mb-6">
                {[
                  { label: "Full Name",    value: user.name },
                  { label: "Email",        value: user.email },
                  { label: "Phone",        value: form.phone || "Not set" },
                  { label: "Account Type", value: user.roles?.[0] || user.roles || "Customer" },
                  { label: "Account ID",   value: user._id || user.id || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-[13px] text-gray-500 font-medium">{label}</span>
                    <span className="text-[13px] font-bold text-gray-800 text-right max-w-[55%] break-all">{value}</span>
                  </div>
                ))}
              </div>
              {/* Danger Zone */}
              <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
                <h4 className="text-[13px] font-bold text-red-600 mb-1">Danger Zone</h4>
                <p className="text-[11px] text-gray-400 mb-3">This action will sign you out of all sessions.</p>
                <button onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-red-600 transition">
                  Sign Out of Account
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