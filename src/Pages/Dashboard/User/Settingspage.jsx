import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Search", path: "/user/search" },
    { label: "Cart", path: "/user/cart" },
    { label: "My Orders", path: "/user/orders" },
    { label: "Profile", path: "/user/profile" },
    { label: "Settings", path: "/user/settings" },
  ];
  const logout = () => { localStorage.clear(); navigate("/login"); };
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <span className="font-black text-[15px] text-gray-900">HealthHaul</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-semibold transition ${location.pathname === item.path ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-[13px] font-bold text-gray-900 truncate">{user.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
        </div>
        <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 transition">Logout</button>
      </div>
    </aside>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[22px] font-black text-gray-900 mb-6">Settings</h1>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">⚙️</div>
            <p className="font-bold text-gray-700">Settings coming soon</p>
            <p className="text-[13px] text-gray-400 mt-1">Account settings and preferences will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}