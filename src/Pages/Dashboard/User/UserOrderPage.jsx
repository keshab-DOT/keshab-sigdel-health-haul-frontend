import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-[11px] font-black">HH</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">HealthHaul Nepal</h1>
            <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Customer Portal</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-green-50/80 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Customer"}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
              ${active === key ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-200/60" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="opacity-60 flex-shrink-0">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </span>
          Sign Out
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
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">HH</span>
              </div>
              <h4 className="font-bold text-green-400 text-base">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your trusted partner for fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Licensed Pharmacies", "30-min Delivery", "Secure Payment"].map(t => (
                <span key={t} className="bg-gray-800/80 text-gray-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-700/50">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Search Medicines","My Orders","My Cart","Profile"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul>
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

function StatusBadge({ status }) {
  const map = {
    pending:   { cls: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-400",  label: "Pending" },
    ontheway:  { cls: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-400",   label: "On the Way", pulse: true },
    delivered: { cls: "bg-green-50 text-green-700 border-green-200",  dot: "bg-green-500",  label: "Delivered" },
    cancalled: { cls: "bg-red-50 text-red-600 border-red-200",        dot: "bg-red-400",    label: "Cancelled" },
  };
  const s = map[status] || { cls: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function TrackingBar({ status }) {
  const steps = ["pending", "ontheway", "delivered"];
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
        {["Order Placed", "On the Way", "Delivered"].map((label, i) => (
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
        // Normalize orderStatus to lowercase in case backend returns mixed case
        const normalized = data.map(order => ({
          ...order,
          orderStatus: order.orderStatus?.toLowerCase() || "pending",
        }));
        setOrders(normalized);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const FILTERS = [
    { key: "all",       label: "All" },
    { key: "pending",   label: "Pending" },
    { key: "ontheway",  label: "On the Way" },
    { key: "delivered", label: "Delivered" },
    { key: "cancalled", label: "Cancelled" },
  ];

  const currentFilterLabel = FILTERS.find(f => f.key === filter)?.label || filter;
  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);
  const payLabel = { cod: "Cash on Delivery", khalti: "Khalti", esewa: "eSewa" };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="orders" user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-h-screen">

        <header className="bg-white border-b border-gray-100 px-7 py-4 sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">My Orders</h2>
              <p className="text-gray-400 text-xs mt-0.5">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-7 py-5 space-y-4">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total",      count: orders.length,                                          from: "from-gray-100",   to: "to-gray-50",   text: "text-gray-700",   sub: "text-gray-400" },
              { label: "Pending",    count: orders.filter(o=>o.orderStatus==="pending").length,     from: "from-amber-50",   to: "to-amber-50",  text: "text-amber-700",  sub: "text-amber-400" },
              { label: "On the Way", count: orders.filter(o=>o.orderStatus==="ontheway").length,    from: "from-blue-50",    to: "to-blue-50",   text: "text-blue-700",   sub: "text-blue-400" },
              { label: "Delivered",  count: orders.filter(o=>o.orderStatus==="delivered").length,   from: "from-green-50",   to: "to-green-50",  text: "text-green-700",  sub: "text-green-400" },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.from} ${s.to} rounded-2xl p-4 border border-gray-100`}>
                <p className={`text-2xl font-black ${s.text}`}>{s.count}</p>
                <p className={`text-xs font-semibold mt-0.5 ${s.sub}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {FILTERS.map(({ key, label }) => {
              const count = key === "all" ? orders.length : orders.filter(o => o.orderStatus === key).length;
              return (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5
                    ${filter === key ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm shadow-green-200" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                  {label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-base font-bold text-gray-700 mb-1">No orders found</h3>
              <p className="text-gray-400 text-sm mb-6">{filter === "all" ? "You haven't placed any orders yet" : `No ${currentFilterLabel} orders`}</p>
              {filter === "all" && (
                <button onClick={() => navigate("/user/search")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition text-sm">
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map(order => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Row header */}
                  <div className="px-5 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">📦</div>
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
                      <StatusBadge status={order.orderStatus} />
                      <p className="text-[13px] font-bold text-gray-800 w-24 text-right">Rs. {order.totalAmount?.toLocaleString()}</p>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>

                  {/* Tracking bar */}
                  <div className="px-5 pb-4">
                    <TrackingBar status={order.orderStatus} />
                  </div>

                  {/* Expanded detail */}
                  {expanded === order._id && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/60">
                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Items */}
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
                                <p className="text-[13px] font-semibold text-green-600 flex-shrink-0">
                                  Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
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
                                <div>
                                  <p className="text-[11px] text-gray-400">{label}</p>
                                  <p className="text-[13px] text-gray-700 font-medium">{value}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between items-center p-3">
                              <span className="text-[13px] font-bold text-gray-700">Total Paid</span>
                              <span className="text-[13px] font-bold text-green-600">Rs. {order.totalAmount?.toLocaleString()}</span>
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
        <Footer />
      </div>
    </div>
  );
}