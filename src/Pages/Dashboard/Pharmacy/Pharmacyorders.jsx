import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Sidebar({ user, active, onLogout, navigate }) {
  const NAV = [
    { key: "dashboard", label: "Dashboard", path: "/pharmacy/dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { key: "orders", label: "Orders", path: "/pharmacy/orders", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { key: "products", label: "Products", path: "/pharmacy/products", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { key: "profile", label: "Profile", path: "/pharmacy/profile", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];
  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0"><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
          <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "P"}</div>
          <div className="min-w-0"><p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p><p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function StatusSelect({ orderId, current, onUpdate, updating }) {
  const options = [{ value: "pending", label: "Pending" }, { value: "delivered", label: "Delivered" }, { value: "cancalled", label: "Cancelled" }];
  return (
    <select value={current} onChange={e => onUpdate(orderId, e.target.value)} disabled={updating}
      className={`border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50 transition ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-green-300"}`}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function OrderDetail({ order }) {
  const payLabel = { cod: "Cash on Delivery", khalti: "Khalti", esewa: "eSewa" };
  return (
    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/60">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <h4 className="text-[13px] font-bold text-gray-700 mb-3">Items in Order</h4>
          <div className="space-y-2">
            {order.products?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                  {item.productId?.productImageUrl ? <img src={item.productId.productImageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : "💊"}
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
              { label: "Customer", value: order.userId?.name || order.customerName || "—" },
              { label: "Shipping Address", value: order.shippingAddress || "—" },
              { label: "Phone", value: order.phoneNumber || "—" },
              { label: "Payment Method", value: payLabel[order.paymentMethod] || order.paymentMethod || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 p-3"><div><p className="text-[11px] text-gray-400">{label}</p><p className="text-[13px] text-gray-700 font-medium">{value}</p></div></div>
            ))}
            <div className="flex justify-between items-center p-3"><span className="text-[13px] font-bold text-gray-700">Total</span><span className="text-[13px] font-black text-green-600">Rs. {order.totalAmount?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PharmacyOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || "").toLowerCase().trim();
    if (!stored || role !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await api.get("/orders/get/orders");
      const data = (r.data || []).map(o => ({ ...o, orderStatus: o.orderStatus?.toLowerCase() || "pending" }));
      setOrders(data);
    } catch (_) { setOrders([]); }
    finally { setLoading(false); }
  };

  // ✅ FIXED: correct backend route PUT /orders/update/order/:id
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(p => ({ ...p, [orderId]: true }));
    try {
      await api.put(`/orders/update/order/${orderId}`, { orderStatus: newStatus });
      setOrders(p => p.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      showToast("Order status updated!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdating(p => ({ ...p, [orderId]: false }));
    }
  };

  const logout = async () => { try { await api.post("/auth/logout"); } catch (_) { } localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  const FILTERS = [{ key: "all", label: "All" }, { key: "pending", label: "Pending" }, { key: "delivered", label: "Delivered" }, { key: "cancalled", label: "Cancelled" }];
  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);
  const totalRevenue = orders.filter(o => o.orderStatus === "delivered").reduce((s, o) => s + (o.totalAmount || 0), 0);

  if (!user) return null;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
      <div className="text-center"><div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400 text-sm">Loading orders…</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}
      <Sidebar user={user} active="orders" onLogout={logout} navigate={navigate} />
      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen">
          <div className="mb-6"><h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Orders</h1><p className="text-gray-400 text-[13px] mt-0.5">Manage and update customer order statuses</p></div>

          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            {[
              { label: "Total Orders", count: orders.length, color: "text-gray-900", bg: "bg-gray-50" },
              { label: "Pending", count: orders.filter(o => o.orderStatus === "pending").length, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Delivered", count: orders.filter(o => o.orderStatus === "delivered").length, color: "text-green-600", bg: "bg-green-50" },
              { label: "Revenue (Rs.)", count: totalRevenue.toLocaleString(), color: "text-green-700", bg: "bg-emerald-50" },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} px-6 py-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mb-4">
            {FILTERS.map(({ key, label }) => {
              const count = key === "all" ? orders.length : orders.filter(o => o.orderStatus === key).length;
              return (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 ${filter === key ? "bg-gray-950 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                  {label}<span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-20 text-center"><div className="text-4xl mb-3">📋</div><h3 className="text-[15px] font-bold text-gray-700 mb-1">No orders found</h3><p className="text-[13px] text-gray-400">{filter === "all" ? "No orders placed yet" : `No ${FILTERS.find(f => f.key === filter)?.label} orders`}</p></div>
            ) : (
              <>
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3 grid grid-cols-[1.2fr_1fr_1.2fr_90px_100px_130px_28px] gap-3 items-center">
                  {["ORDER", "CUSTOMER", "SHIPPING ADDRESS", "ITEMS", "AMOUNT", "STATUS", ""].map(col => (<p key={col} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col}</p>))}
                </div>
                <div className="divide-y divide-gray-50">
                  {filtered.map(order => {
                    const customerName = order.userId?.name || order.customerName || "Customer";
                    return (
                      <div key={order._id}>
                        <div className="px-5 py-4 grid grid-cols-[1.2fr_1fr_1.2fr_90px_100px_130px_28px] gap-3 items-center hover:bg-gray-50/60 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                              {order.orderStatus === "delivered" ? "✅" : order.orderStatus === "cancalled" ? "❌" : "📦"}
                            </div>
                            <div className="min-w-0"><p className="text-[13px] font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p><p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                          </div>
                          <div className="min-w-0"><p className="text-[13px] font-medium text-gray-700 truncate">{customerName}</p></div>
                          <p className="text-[13px] text-gray-500 truncate">{order.shippingAddress || "—"}</p>
                          <p className="text-[13px] text-gray-600">{order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? "s" : ""}</p>
                          <p className="text-[13px] font-black text-green-600">Rs. {order.totalAmount?.toLocaleString()}</p>
                          <div onClick={e => e.stopPropagation()}><StatusSelect orderId={order._id} current={order.orderStatus} onUpdate={handleStatusUpdate} updating={updating[order._id]} /></div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                        {expanded === order._id && <OrderDetail order={order} />}
                      </div>
                    );
                  })}
                </div>
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40"><p className="text-[12px] text-gray-400">{filtered.length} of {orders.length} orders shown</p></div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}