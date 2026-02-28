import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

// ── Shared Sidebar (exported for AdminUsers + AdminProducts) ──────────────────
export function AdminSidebar({ active, navigate, onLogout, admin }) {
  const NAV = [
    {
      key: "overview", label: "Overview", path: "/admin/dashboard",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
    },
    {
      key: "products", label: "Product Approvals", path: "/admin/products",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
    },
    {
      key: "users", label: "User Management", path: "/admin/users",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    },
  ];

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{admin?.name || "Admin"}</p>
            <p className="text-[11px] text-green-600 font-semibold">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
              ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-5 pt-1 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="opacity-60 flex-shrink-0">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </span>
          Log Out
        </button>
      </div>
    </aside>
  );
}

// ── Admin Overview ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({ totalUsers: 0, totalPharmacies: 0, pendingProducts: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || "").toLowerCase();
    if (!stored || role !== "admin") { navigate("/login", { replace: true }); return; }
    setAdmin(stored);
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/admin/products"),
      ]);

      let users = [];
      if (usersRes.status === "fulfilled") {
        const raw = usersRes.value.data;
        users = Array.isArray(raw) ? raw : Array.isArray(raw?.users) ? raw.users : [];
      }

      let products = [];
      if (productsRes.status === "fulfilled") {
        const raw = productsRes.value.data;
        products = Array.isArray(raw) ? raw : Array.isArray(raw?.products) ? raw.products : [];
      }

      setStats({
        totalUsers:      users.filter(u => (Array.isArray(u.roles) ? u.roles[0] : u.roles || "").toLowerCase() === "user").length,
        totalPharmacies: users.filter(u => (Array.isArray(u.roles) ? u.roles[0] : u.roles || "").toLowerCase() === "pharmacy").length,
        pendingProducts: products.filter(p => p.approvalStatus === "Pending").length,
      });
      setRecentUsers(users.slice(0, 6));
    } catch (_) {}
    finally { setLoading(false); }
  };

  const logout = () => { localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  if (!admin) return null;

  const STAT_CARDS = [
    { label: "Registered Users",  value: stats.totalUsers,      icon: "👥", color: "text-blue-600",  bg: "bg-blue-50"  },
    { label: "Pharmacies",        value: stats.totalPharmacies, icon: "🏥", color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Approvals", value: stats.pendingProducts, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <AdminSidebar active="overview" navigate={navigate} onLogout={logout} admin={admin}/>
      <div className="pl-[220px]">
        <main className="px-8 py-7 min-h-screen">

          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight">Overview</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Platform summary</p>
            </div>
            <button onClick={fetchData}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          {/* Stat cards */}
          {loading ? (
            <div className="grid grid-cols-3 gap-4 mb-7">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-[100px]"/>)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-7">
              {STAT_CARDS.map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
                  <p className={`text-2xl font-black ${s.color} leading-none mb-1`}>{s.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pending products alert */}
          {stats.pendingProducts > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"/>
              <p className="text-[13px] font-semibold text-amber-800">
                <span className="font-black">{stats.pendingProducts}</span> product{stats.pendingProducts > 1 ? "s" : ""} waiting for your approval — pharmacies cannot sell until reviewed
              </p>
              <button onClick={() => navigate("/admin/products")} className="ml-auto text-[11px] font-bold text-amber-700 underline underline-offset-2">
                Review now →
              </button>
            </div>
          )}

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black text-gray-900">Recent Users</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Latest registered accounts</p>
              </div>
              <button onClick={() => navigate("/admin/users")}
                className="text-[12px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 hover:text-gray-900 transition">
                View all →
              </button>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
            ) : recentUsers.length === 0 ? (
              <div className="py-12 text-center"><div className="text-3xl mb-2">👥</div><p className="text-[13px] text-gray-400">No users yet</p></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentUsers.map(user => {
                  const role     = (Array.isArray(user.roles) ? user.roles[0] : user.roles || "user").toLowerCase();
                  const status   = user.status || "Active";
                  const roleBg   = role === "pharmacy" ? "bg-green-100 text-green-700" : role === "admin" ? "bg-gray-800 text-white" : "bg-blue-100 text-blue-700";
                  const statusBg = status === "Banned" ? "bg-red-100 text-red-600" : status === "Suspended" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
                  return (
                    <div key={user._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[12px] flex-shrink-0 ${status === "Active" ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gray-300"}`}>
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">{user.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${roleBg}`}>{role}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBg}`}>{status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("/admin/products")}
                className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Product Approvals
                {stats.pendingProducts > 0 && (
                  <span className="w-5 h-5 bg-amber-400 text-white text-[10px] font-black rounded-full flex items-center justify-center">{stats.pendingProducts}</span>
                )}
              </button>
              <button onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Manage Users
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}