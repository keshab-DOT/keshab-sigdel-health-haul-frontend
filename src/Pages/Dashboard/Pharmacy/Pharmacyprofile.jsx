import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

function Sidebar({ user, active, onLogout, navigate }) {
  const NAV = [
    { key: "dashboard", label: "Dashboard", path: "/pharmacy/dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { key: "orders", label: "Orders", path: "/pharmacy/orders", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { key: "products", label: "Products", path: "/pharmacy/products", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { key: "profile", label: "Profile", path: "/pharmacy/profile", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];
  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0"><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div><span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span></div></div>
      <div className="px-4 py-3.5 border-b border-gray-100"><p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "P"}</div><div className="min-w-0"><p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p><p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p></div></div></div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">{NAV.map(({ key, label, path, icon }) => (<button key={key} onClick={() => navigate(path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}><span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>{label}</button>))}</nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100"><button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"><span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>Sign Out</button></div>
    </aside>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder, disabled, icon }) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          className={`w-full border border-gray-200 rounded-xl py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition ${icon ? "pl-10 pr-4" : "px-3.5"} ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`} />
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
      {toast.type === "error" ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
      {toast.msg}
    </div>
  );
}

export default function PharmacyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "", licenseNumber: "", description: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const logout = async () => { try { await api.post("/auth/logout"); } catch (_) { } localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);
    setProfile({ name: stored.name || "", email: stored.email || "", phone: stored.phone || "", address: stored.address || "", licenseNumber: stored.licenseNumber || "", description: stored.description || "" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put("/auth/update-profile", profile);
      const updated = { ...user, ...profile }; localStorage.setItem("user", JSON.stringify(updated)); setUser(updated);
      showToast("Profile updated successfully!");
    } catch (err) { showToast(err.response?.data?.message || "Failed to update profile", "error"); }
    finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { showToast("New passwords do not match", "error"); return; }
    if (passwords.newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setSaving(true);
    try {
      await api.put("/auth/change-password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed successfully!");
    } catch (err) { showToast(err.response?.data?.message || "Failed to change password", "error"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  const initials = profile.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "PH";
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const TABS = [{ key: "profile", label: "Profile Info" }, { key: "security", label: "Password" }];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Toast toast={toast} />
      <Sidebar user={user} active="profile" onLogout={logout} navigate={navigate} />
      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen max-w-4xl">
          <div className="mb-7"><h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Pharmacy Profile</h1><p className="text-gray-400 text-[13px] mt-0.5">Manage your pharmacy account information</p></div>

          {/* Hero card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-md">{initials}</div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] font-black text-gray-900 leading-tight truncate">{profile.name || "Pharmacy Name"}</h2>
                <p className="text-[13px] text-gray-500 mt-0.5 truncate">{profile.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active Pharmacy</span>
                  {profile.licenseNumber && <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">🪪 License: {profile.licenseNumber}</span>}
                  <span className="text-[11px] text-gray-400 font-medium">Member since {joinedDate}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2">
                <button onClick={() => navigate("/pharmacy/orders")} className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2 rounded-xl font-bold text-[12px] hover:bg-gray-800 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>View Orders</button>
                <button onClick={() => navigate("/pharmacy/dashboard")} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold text-[12px] hover:border-green-300 hover:text-green-700 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>Dashboard</button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-5 w-fit">
            {TABS.map(t => (<button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all ${activeTab === t.key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>{t.label}</button>))}
          </div>

          {activeTab === "profile" && (
            <form onSubmit={saveProfile}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-[15px] font-black text-gray-900">Pharmacy Information</h3><p className="text-[11px] text-gray-400 mt-0.5">Update your pharmacy's public details</p></div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Pharmacy Name *" name="name" value={profile.name} onChange={handleProfileChange} placeholder="e.g. Sunrise Pharmacy" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                    <Field label="Email Address" name="email" value={profile.email} onChange={handleProfileChange} type="email" placeholder="pharmacy@example.com" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone Number" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="98XXXXXXXX" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />
                    <Field label="License Number" name="licenseNumber" value={profile.licenseNumber} onChange={handleProfileChange} placeholder="e.g. PH-2024-XXXXX" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                  </div>
                  <Field label="Pharmacy Address" name="address" value={profile.address} onChange={handleProfileChange} placeholder="Street, City, District" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                  <div><label className="block text-[12px] font-bold text-gray-700 mb-1.5">About Your Pharmacy</label><textarea name="description" value={profile.description} onChange={handleProfileChange} rows={3} placeholder="Briefly describe your pharmacy, specialties, or opening hours…" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white resize-none transition" /></div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">Changes are saved to your account immediately</p>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gray-950 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {saving ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save Changes</>}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={savePassword}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-[15px] font-black text-gray-900">Change Password</h3><p className="text-[11px] text-gray-400 mt-0.5">Use a strong password — at least 6 characters</p></div>
                <div className="p-6 space-y-4 max-w-md">
                  {[{ name: "currentPassword", label: "Current Password", key: "current", placeholder: "Enter current password" }, { name: "newPassword", label: "New Password", key: "new", placeholder: "Enter new password" }, { name: "confirmPassword", label: "Confirm New Password", key: "confirm", placeholder: "Re-enter new password" }].map(({ name, label, key, placeholder }) => (
                    <div key={name}>
                      <label className="block text-[12px] font-bold text-gray-700 mb-1.5">{label}</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <input type={showPw[key] ? "text" : "password"} name={name} value={passwords[name]} onChange={handlePasswordChange} placeholder={placeholder} required className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition" />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                          {showPw[key] ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        </button>
                      </div>
                    </div>
                  ))}
                  {passwords.newPassword && (
                    <div className={`flex items-center gap-2 text-[12px] font-semibold px-3.5 py-2.5 rounded-xl border ${passwords.newPassword.length >= 8 ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                      {passwords.newPassword.length >= 8 ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>Strong password</> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>Use 8+ characters for a stronger password</>}
                    </div>
                  )}
                  {passwords.confirmPassword && (
                    <div className={`flex items-center gap-2 text-[12px] font-semibold px-3.5 py-2.5 rounded-xl border ${passwords.newPassword === passwords.confirmPassword ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                      {passwords.newPassword === passwords.confirmPassword ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Passwords match</> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Passwords do not match</>}
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">You'll stay logged in after changing your password</p>
                  <button type="submit" disabled={saving || passwords.newPassword !== passwords.confirmPassword} className="flex items-center gap-2 bg-gray-950 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    {saving ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Updating…</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Update Password</>}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Danger zone */}
          <div className="mt-5 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2"><svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg><h3 className="text-[15px] font-black text-red-700">Danger Zone</h3></div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div><p className="text-[13px] font-bold text-gray-800">Sign out of your account</p><p className="text-[11px] text-gray-400 mt-0.5">You will be redirected to the login page</p></div>
              <button onClick={async () => { try { await api.post("/auth/logout"); } catch (_) { } localStorage.removeItem("user"); navigate("/login", { replace: true }); }} className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-red-50 hover:border-red-300 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign Out</button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}