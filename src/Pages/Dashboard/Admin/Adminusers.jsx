import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AdminSidebar } from "./AdminDashboard";

const STATUS_OPTIONS = ["Active", "Suspended", "Banned"];

// Normalize whatever the backend sends into one of our 3 known values
const normalizeStatus = (raw) => {
  const s = (raw || "").toString().trim();
  if (STATUS_OPTIONS.includes(s)) return s;
  return "Active"; // safe default
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const [admin, setAdmin]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [acting, setActing]   = useState({});
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || "").toLowerCase();
    if (!stored || role !== "admin") { navigate("/login", { replace: true }); return; }
    setAdmin(stored);
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/users");
      const raw = r.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.users) ? raw.users : [];
      // Normalize status on every user right here so the select is always controlled
      setUsers(list.map(u => ({ ...u, status: normalizeStatus(u.status) })));
    } catch (_) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (userId, newStatus) => {
    // Optimistically update UI first so select stays controlled
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    setActing(p => ({ ...p, [userId]: true }));
    try {
      await api.put(`/admin/user/${userId}/status`, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      // Revert on failure
      fetchUsers();
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setActing(p => ({ ...p, [userId]: false }));
    }
  };

  const logout = () => { localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  const getRole   = (u) => (Array.isArray(u.roles) ? u.roles[0] : u.roles || "user").toLowerCase();
  const getStatus = (u) => u.status; // already normalized on fetch

  const FILTERS = [
    { key: "all",       label: "All Users"  },
    { key: "user",      label: "Users"      },
    { key: "pharmacy",  label: "Pharmacies" },
    { key: "suspended", label: "Suspended"  },
    { key: "banned",    label: "Banned"     },
  ];

  const filtered = users.filter(u => {
    const role   = getRole(u);
    const status = getStatus(u).toLowerCase();
    const matchFilter =
      filter === "all"       ? true :
      filter === "banned"    ? status === "banned" :
      filter === "suspended" ? status === "suspended" :
      role === filter;
    const q = search.toLowerCase();
    return matchFilter && (!q || (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
  });

  const counts = {
    active:    users.filter(u => getStatus(u) === "Active").length,
    pharmacy:  users.filter(u => getRole(u) === "pharmacy").length,
    suspended: users.filter(u => getStatus(u) === "Suspended").length,
    banned:    users.filter(u => getStatus(u) === "Banned").length,
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold flex items-center gap-2
          ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
          {toast.msg}
        </div>
      )}

      <AdminSidebar active="users" navigate={navigate} onLogout={logout} admin={admin}/>

      <div className="pl-[220px]">
        <main className="px-8 py-7 min-h-screen">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight">User Management</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">{users.length} registered users</p>
            </div>
            <button onClick={fetchUsers}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            {[
              { label: "Active",     count: counts.active,    color: "text-green-600", bg: "bg-green-50"  },
              { label: "Pharmacies", count: counts.pharmacy,  color: "text-blue-600",  bg: "bg-blue-50"   },
              { label: "Suspended",  count: counts.suspended, color: "text-amber-600", bg: "bg-amber-50"  },
              { label: "Banned",     count: counts.banned,    color: "text-red-600",   bg: "bg-red-50"    },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} px-6 py-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>

          {/* Search + filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map(({ key, label }) => {
                const count =
                  key === "all"       ? users.length :
                  key === "banned"    ? counts.banned :
                  key === "suspended" ? counts.suspended :
                  key === "pharmacy"  ? counts.pharmacy :
                  users.filter(u => getRole(u) === key).length;
                return (
                  <button key={key} onClick={() => setFilter(key)}
                    className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5
                      ${filter === key ? "bg-gray-950 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                    {label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3 grid grid-cols-[1.5fr_1fr_1fr_110px_160px] gap-3 rounded-t-2xl">
              {["USER", "ROLE", "JOINED", "STATUS", "CHANGE STATUS"].map(col => (
                <p key={col} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col}</p>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-[14px] font-bold text-gray-700">No users found</p>
                <p className="text-[12px] text-gray-400 mt-1">{search ? "Try clearing your search" : "No users in this category"}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(user => {
                  const role    = getRole(user);
                  const status  = getStatus(user); // "Active" | "Suspended" | "Banned" — always normalized
                  const isAdmin = role === "admin";

                  const roleCls =
                    role === "pharmacy" ? "bg-green-100 text-green-700 border-green-200" :
                    role === "admin"    ? "bg-gray-800 text-white border-gray-700" :
                    "bg-blue-100 text-blue-700 border-blue-200";

                  const statusCls =
                    status === "Banned"    ? "bg-red-100 text-red-600 border-red-200" :
                    status === "Suspended" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-green-100 text-green-700 border-green-200";

                  const statusDot =
                    status === "Banned"    ? "bg-red-500" :
                    status === "Suspended" ? "bg-amber-500" :
                    "bg-green-500";

                  return (
                    <div key={user._id} className="px-5 py-4 grid grid-cols-[1.5fr_1fr_1fr_110px_160px] gap-3 items-center hover:bg-gray-50/40 transition-colors">

                      {/* User info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[13px] flex-shrink-0
                          ${status === "Active" ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gray-300"}`}>
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-bold truncate ${status !== "Active" ? "text-gray-400" : "text-gray-800"}`}>{user.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Role */}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold w-fit capitalize border ${roleCls}`}>
                        {role}
                      </span>

                      {/* Joined */}
                      <p className="text-[12px] text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>

                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit border ${statusCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot}`}/>
                        {status}
                      </span>

                      {/* Change status */}
                      <div>
                        {isAdmin ? (
                          <span className="text-[11px] text-gray-300 italic font-medium">Protected</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* key={status} forces React to remount the select when status changes externally,
                                preventing stale controlled-value issues */}
                            <select
                              key={user._id + status}
                              defaultValue={status}
                              onChange={e => changeStatus(user._id, e.target.value)}
                              disabled={acting[user._id]}
                              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none bg-gray-50 cursor-pointer hover:border-green-300 transition disabled:opacity-40 w-full">
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            {acting[user._id] && (
                              <svg className="animate-spin w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 rounded-b-2xl">
                <p className="text-[12px] text-gray-400">{filtered.length} of {users.length} users shown</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}