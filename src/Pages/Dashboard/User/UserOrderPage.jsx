import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Topbar({ user, onLogout, navigate, active }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition ${active==="dashboard"?"font-semibold text-gray-900 bg-gray-100":"text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>Dashboard</button>
        <button onClick={() => navigate("/user/search")}    className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition ${active==="search"?"font-semibold text-gray-900 bg-gray-100":"text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")}    className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition ${active==="orders"?"font-semibold text-gray-900 bg-gray-100":"text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>My Orders</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </button>
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
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

function Footer({ navigate }) {
  const quickLinks = [
    { label: "Search Medicines", path: "/user/search" },
    { label: "My Orders",        path: "/user/orders" },
    { label: "My Cart",          path: "/user/cart" },
    { label: "Profile",          path: "/user/profile" },
  ];
  const supportLinks = [
    { label: "Help Center",      path: "/user/support" },
    { label: "Contact Us",       path: "/user/support" },
    { label: "Refund Policy",    path: "/user/support" },
    { label: "Terms of Service", path: "/user/support" },
  ];
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {quickLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {supportLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

// StatusPill - removed "ontheway" status
function StatusPill({ status }) {
  const map = {
    pending:   { cls: "bg-amber-100 text-amber-700",  dot: "bg-amber-400",  label: "Pending" },
    delivered: { cls: "bg-green-100 text-green-700",  dot: "bg-green-500",  label: "Delivered" },
    cancalled: { cls: "bg-red-100 text-red-600",      dot: "bg-red-400",    label: "Cancelled" },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.cls} border-current/10`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`}/>
      {s.label}
    </span>
  );
}

// TrackingBar - 2 steps only: pending → delivered
function TrackingBar({ status }) {
  const steps = ["pending", "delivered"];
  const idx = steps.indexOf(status);
  const isCancelled = status === "cancalled";
  if (isCancelled) return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 h-1 rounded-full bg-red-100"/>
      <span className="text-[11px] text-red-400 font-medium flex-shrink-0">Order Cancelled</span>
    </div>
  );
  return (
    <div className="mt-3">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${i <= idx ? "bg-green-500 shadow-sm shadow-green-200" : "bg-gray-200"}`}/>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-green-400" : "bg-gray-200"}`}/>}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {["Order Placed", "Delivered"].map((label, i) => (
          <span key={label} className={`text-[10px] font-medium ${i <= idx ? "text-green-600" : "text-gray-300"}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function UserOrderPage() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/orders/get/orders")
      .then(r => {
        const data = r.data || [];
        setOrders(data.map(o => ({ ...o, orderStatus: o.orderStatus?.toLowerCase() || "pending" })));
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Removed "ontheway" filter
  const FILTERS = [
    { key: "all",       label: "All" },
    { key: "pending",   label: "Pending" },
    { key: "delivered", label: "Delivered" },
    { key: "cancalled", label: "Cancelled" },
  ];

  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);
  const currentFilterLabel = FILTERS.find(f => f.key === filter)?.label || filter;
  const payLabel = { cod: "Cash on Delivery", esewa: "eSewa" };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400 text-sm">Loading your orders…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar user={user} onLogout={handleLogout} navigate={navigate} active="orders"/>

      <main className="flex-1 px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">My Orders</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => navigate("/user/search")}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
            Browse Medicines
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Stats - removed On the Way card */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Orders", count: orders.length,                                        bg: "bg-gray-50",   text: "text-gray-900",   emoji: "📦" },
            { label: "Pending",      count: orders.filter(o=>o.orderStatus==="pending").length,   bg: "bg-amber-50",  text: "text-amber-700",  emoji: "⏳" },
            { label: "Delivered",    count: orders.filter(o=>o.orderStatus==="delivered").length, bg: "bg-green-50",  text: "text-green-700",  emoji: "✅" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl flex-shrink-0`}>{s.emoji}</div>
              <div>
                <p className={`text-2xl font-black leading-none ${s.text}`}>{s.count}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map(({ key, label }) => {
            const count = key === "all" ? orders.length : orders.filter(o => o.orderStatus === key).length;
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5
                  ${filter === key ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                {label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-1">No orders found</h3>
            <p className="text-gray-400 text-[13px] mb-6">{filter === "all" ? "You haven't placed any orders yet" : `No ${currentFilterLabel} orders`}</p>
            {filter === "all" && (
              <button onClick={() => navigate("/user/search")} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Start Shopping</button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(order => (
              <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-5 py-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                      {order.orderStatus==="delivered"?"✅":order.orderStatus==="cancalled"?"❌":"📦"}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}
                        <span className="mx-1.5 text-gray-200">·</span>
                        {order.products?.length} item{order.products?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <StatusPill status={order.orderStatus}/>
                    <p className="text-[13px] font-black text-gray-800 w-24 text-right">Rs. {order.totalAmount?.toLocaleString()}</p>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>

                <div className="px-5 pb-4"><TrackingBar status={order.orderStatus}/></div>

                {expanded === order._id && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/60">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-700 mb-3">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.products?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                                {item.productId?.productImageUrl
                                  ? <img src={item.productId.productImageUrl} alt="" className="w-full h-full object-cover rounded-lg"/>
                                  : "💊"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-gray-800 truncate">{item.productId?.productName || "Product"}</p>
                                <p className="text-[11px] text-gray-400">Qty: {item.quantity} × Rs. {item.productId?.productPrice?.toLocaleString()}</p>
                              </div>
                              <p className="text-[13px] font-bold text-green-600 flex-shrink-0">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-700 mb-3">Order Details</h4>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                          {[
                            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, label: "Shipping Address", value: order.shippingAddress },
                            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>, label: "Phone", value: order.phoneNumber },
                            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>, label: "Payment Method", value: payLabel[order.paymentMethod] || order.paymentMethod },
                          ].map(({ icon, label, value }) => (
                            <div key={label} className="flex gap-3 p-3">
                              <span className="text-gray-300 mt-0.5 flex-shrink-0">{icon}</span>
                              <div><p className="text-[11px] text-gray-400">{label}</p><p className="text-[13px] text-gray-700 font-medium">{value}</p></div>
                            </div>
                          ))}
                          <div className="flex justify-between items-center p-3">
                            <span className="text-[13px] font-bold text-gray-700">Total Paid</span>
                            <span className="text-[13px] font-black text-green-600">Rs. {order.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer navigate={navigate}/>
    </div>
  );
}