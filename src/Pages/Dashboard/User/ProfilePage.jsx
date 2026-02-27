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
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-green-300 rounded-xl px-2.5 py-1.5 transition">
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

function InputField({ label, type = "text", value, onChange, disabled, placeholder, hint }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
        className={`w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition
          ${disabled ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-gray-50/50"}`}/>
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
    } catch { showToast("Failed to update profile", "error"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>{toast.msg}</div>}

      <Topbar user={user} cartCount={0} onLogout={handleLogout} navigate={navigate}/>

      <main className="flex-1 px-8 py-6 space-y-5">
        {/* Page header */}
        <div>
          <h2 className="text-[22px] font-black text-gray-900 tracking-tight">My Profile</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Manage your personal information</p>
        </div>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 px-7 py-6 flex items-center gap-5">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-green-400 blur-3xl"/></div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black text-white flex-shrink-0 border border-white/20">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 relative">
            <h3 className="text-lg font-black text-white">{user.name}</h3>
            <p className="text-white/50 text-[12px]">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
              <span className="text-[11px] text-green-300 font-medium">Verified Account</span>
            </div>
          </div>
          <div className="text-right relative">
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-md">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Edit Profile</h3>
            <div className="space-y-4">
              <InputField label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name"/>
              <InputField label="Email Address" type="email" value={form.email} disabled hint="Email cannot be changed"/>
              <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX"/>
              <button onClick={handleSaveProfile} disabled={saving} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 disabled:opacity-50 transition text-[13px] mt-2">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-md">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Account Information</h3>
            <div className="space-y-0.5 mb-6">
              {[
                { label: "Full Name",    value: user.name },
                { label: "Email",        value: user.email },
                { label: "Phone",        value: form.phone || "Not set" },
                { label: "Account Type", value: user.roles?.[0] || user.roles || "Customer" },
                { label: "Account ID",   value: user._id || user.id || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-[13px] text-gray-500 font-medium">{label}</span>
                  <span className="text-[13px] font-black text-gray-800 text-right max-w-[55%] break-all">{value}</span>
                </div>
              ))}
            </div>
            <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
              <h4 className="text-[13px] font-black text-red-600 mb-1">Danger Zone</h4>
              <p className="text-[11px] text-gray-400 mb-3">This action will sign you out of all sessions.</p>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-red-600 transition">Sign Out of Account</button>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}