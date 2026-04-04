import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Topbar({ user, onLogout, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/user/dashboard" },
    { key: "search", label: "Browse Medicines", path: "/user/search" },
    { key: "orders", label: "My Orders", path: "/user/orders" },
    { key: "chat", label: "Chat", path: "/user/chat" },
  ];
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 sticky top-0 z-30 h-[56px] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight hidden xs:inline">HealthHaul</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 ml-4">
        {navItems.map(({ key, label, path }) => (
          <button key={key} onClick={() => navigate(path)}
            className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1.5 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </button>
        <button onClick={() => navigate("/user/profile")} className="hidden sm:flex items-center gap-2 bg-gray-50 border border-green-300 rounded-xl px-2.5 py-1.5 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left">
            <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p>
          </div>
        </button>
        <button onClick={onLogout} className="hidden sm:flex w-9 h-9 items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
        <button onClick={() => setMenuOpen(o => !o)} className="md:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition">
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-[56px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 py-2 px-4 flex flex-col gap-1">
          {navItems.map(({ key, label, path }) => (
            <button key={key} onClick={() => { navigate(path); setMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">
              {label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-2 flex items-center justify-between">
            <button onClick={() => { navigate("/user/profile"); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[12px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-gray-800">{user?.name?.split(" ")[0] || "User"}</p>
                <p className="text-[11px] text-gray-400 capitalize">{user?.roles?.[0] || "Customer"}</p>
              </div>
            </button>
            <button onClick={() => { onLogout(); setMenuOpen(false); }} className="flex items-center gap-1.5 text-[13px] font-medium text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ navigate }) {
  const quickLinks = [
    { label: "Search Medicines", path: "/user/search" },
    { label: "My Orders", path: "/user/orders" },
    { label: "My Cart", path: "/user/cart" },
    { label: "Profile", path: "/user/profile" },
  ];
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="px-4 sm:px-8 pt-8 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Your trusted partner for fast and reliable medicine delivery across Nepal.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              {quickLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-white transition text-left w-full">{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Us</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                <a href="mailto:sigdelbibek9898@gmail.com" className="hover:text-white transition break-all">sigdelbibek9898@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <a href="tel:9829396927" className="hover:text-white transition">9829396927</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                <span>Itahari-8, Sunsari, Nepal</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function InputField({ label, type = "text", value, onChange, disabled, placeholder, hint }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
        className={`w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition ${disabled ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-gray-50/50"}`} />
      {hint && <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    setForm({ name: stored.name || "", email: stored.email || "", phone: stored.phone || "" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { }
    localStorage.removeItem("user"); localStorage.removeItem("token"); navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    try {
      const { data } = await api.put("/auth/update-profile", { name: form.name.trim(), phone: form.phone });
      const updated = { ...user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setForm(f => ({ ...f, name: updated.name, phone: updated.phone || "" }));
      showToast("Profile updated successfully!");
    } catch (err) { showToast(err.response?.data?.message || "Failed to update profile", "error"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>{toast.msg}</div>}

      <Topbar user={user} onLogout={handleLogout} navigate={navigate} />

      <main className="flex-1 px-4 sm:px-8 py-4 sm:py-6 space-y-5">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-black text-gray-900 tracking-tight">My Profile</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage your personal information</p>
        </div>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 px-5 sm:px-7 py-5 sm:py-6 flex items-center gap-4 sm:gap-5">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-green-400 blur-3xl" /></div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl font-black text-white flex-shrink-0 border border-white/20">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 relative min-w-0">
            <h3 className="text-base sm:text-lg font-black text-white truncate">{user.name}</h3>
            <p className="text-white/50 text-[12px] truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[11px] text-green-300 font-medium">Verified Account</span>
            </div>
          </div>
          <div className="text-right relative hidden xs:block flex-shrink-0">
            <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Account Type</p>
            <p className="font-black text-[13px] text-white capitalize mt-0.5">{user.roles?.[0] || user.roles || "Customer"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[{ key: "profile", label: "Edit Profile" }, { key: "account", label: "Account Info" }].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${activeTab === key ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Edit Profile</h3>
            <div className="space-y-4">
              <InputField label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
              <InputField label="Email Address" type="email" value={form.email} disabled hint="Email cannot be changed" />
              <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX" />
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 disabled:opacity-50 transition text-[13px] mt-2">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Account Information</h3>
            <div className="space-y-0.5 mb-6">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone || "Not set" },
                { label: "Account Type", value: user.roles?.[0] || user.roles || "Customer" },
                { label: "Account ID", value: user._id || user.id || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start sm:items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-3">
                  <span className="text-[13px] text-gray-500 font-medium flex-shrink-0">{label}</span>
                  <span className="text-[13px] font-black text-gray-800 text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
              <p className="text-[11px] text-gray-400 mb-3">This action will sign you out of all sessions.</p>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-red-600 transition">Sign Out of Account</button>
            </div>
          </div>
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}