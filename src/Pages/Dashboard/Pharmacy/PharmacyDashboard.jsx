import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

function Sidebar({ user, active, onLogout, navigate }) {
  const NAV = [
    {
      key: "dashboard", label: "Dashboard", path: "/pharmacy/dashboard",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
    },
    {
      key: "orders", label: "Orders", path: "/pharmacy/orders",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    },
    {
      key: "products", label: "Products", path: "/pharmacy/products",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
    },
    {
      key: "profile", label: "Profile", path: "/pharmacy/profile",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    },
  ];

  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p>
            <p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p>
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

function SparkLine({ data = [3, 5, 2, 8, 6, 9, 7] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80; const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts}/>
    </svg>
  );
}

function OrderRow({ order }) {
  const statusMap = {
    pending:   "bg-amber-100 text-amber-700",
    delivered: "bg-green-100 text-green-700",
    cancalled: "bg-red-100 text-red-600",
  };
  const cls = statusMap[order.orderStatus] || "bg-gray-100 text-gray-600";
  const label = { pending: "Pending", delivered: "Delivered", cancalled: "Cancelled" }[order.orderStatus] || order.orderStatus;
  const customerName = order.userId?.name || order.customerName || "Customer";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-sm flex-shrink-0">💊</div>
          <div>
            <p className="text-[13px] font-bold text-gray-800">#{order._id?.slice(-8).toUpperCase()}</p>
            <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-[13px] text-gray-700 font-medium truncate max-w-[110px]">{customerName}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-[12px] text-gray-500 truncate max-w-[140px]">{order.shippingAddress || "—"}</p>
      </td>
      <td className="py-3 px-4"><p className="text-[13px] font-bold text-green-600">Rs. {order.totalAmount?.toLocaleString()}</p></td>
      <td className="py-3 px-4"><p className="text-[13px] text-gray-600">{order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? "s" : ""}</p></td>
      <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${cls}`}>{label}</span></td>
    </tr>
  );
}

// ── Add Product Modal ──────────────────────────────────────────────────────────
function AddProductModal({ onClose, onSuccess }) {
  const EMPTY = { productName: "", productDescription: "", productPrice: "", productImageUrl: "", productTotalStockQuantity: "" };
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.productName || !form.productDescription || !form.productPrice || !form.productTotalStockQuantity) {
      setError("Name, description, price, and stock quantity are all required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/products/create/product", {
        productName: form.productName,
        productDescription: form.productDescription,
        productPrice: Number(form.productPrice),
        productImageUrl: form.productImageUrl || undefined,
        productTotalStockQuantity: Number(form.productTotalStockQuantity),
      });
      onSuccess("Product submitted! Awaiting admin approval.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-black text-gray-900">Add New Product</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Requires admin approval before going live</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Product Name *</label>
            <input type="text" name="productName" value={form.productName} onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
          </div>

          {/* Price & Stock side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" name="productPrice" value={form.productPrice} onChange={handleChange}
                placeholder="e.g. 150" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Stock Qty *</label>
              <input type="number" name="productTotalStockQuantity" value={form.productTotalStockQuantity} onChange={handleChange}
                placeholder="e.g. 100" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Image URL (optional)</label>
            <input type="text" name="productImageUrl" value={form.productImageUrl} onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
          </div>

          {/* Description — required */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Description *</label>
            <textarea name="productDescription" value={form.productDescription} onChange={handleChange}
              rows={3} placeholder="Describe the medicine, its use, dosage info…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white resize-none transition"/>
          </div>

          {/* Approval notice */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            <p className="text-[11px] text-amber-700 font-medium">Product will be marked <strong>Pending</strong> until an admin approves it.</p>
          </div>

          {error && (
            <p className="text-[12px] font-semibold px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gray-950 text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {saving
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting…</>
                : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>Add Product</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const [user, setUser]                 = useState(null);
  const [orders, setOrders]             = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [revenueData]                   = useState([12, 19, 9, 25, 17, 31, 22]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") {
      navigate("/login", { replace: true });
      return;
    }
    setUser(stored);
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await api.get("/orders/get/orders");
      const data = (r.data || []).map(o => ({
        ...o,
        orderStatus: o.orderStatus?.toLowerCase() || "pending",
      }));
      setOrders(data);
      setRecentOrders(data.slice(0, 6));
    } catch (_) {
      setOrders([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter(o => o.orderStatus === "pending").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
  const cancelledOrders = orders.filter(o => o.orderStatus === "cancalled").length;
  const totalRevenue    = orders
    .filter(o => o.orderStatus === "delivered")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  if (!user) return null;

  const STAT_CARDS = [
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: "💰", color: "text-green-600",   bg: "bg-green-50",   sparkColor: "text-green-500",   trend: "from delivered" },
    { label: "Total Orders",  value: totalOrders,                            icon: "📦", color: "text-blue-600",    bg: "bg-blue-50",    sparkColor: "text-blue-400",    trend: "all time"       },
    { label: "Pending",       value: pendingOrders,                          icon: "⏳", color: "text-amber-600",   bg: "bg-amber-50",   sparkColor: "text-amber-400",   trend: "awaiting"       },
    { label: "Delivered",     value: deliveredOrders,                        icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50", sparkColor: "text-emerald-400", trend: "completed"      },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold
          ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onSuccess={showToast} />
      )}

      <Sidebar user={user} active="dashboard" onLogout={logout} navigate={navigate}/>

      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen">

          <div className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">Pharmacy Dashboard</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Real-time overview of your orders and revenue</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add Product
            </button>
          </div>

          {/* Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-4 gap-4 mb-7">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl mb-3"/>
                  <div className="h-7 bg-gray-100 rounded w-1/2 mb-1"/>
                  <div className="h-3 bg-gray-100 rounded w-3/4"/>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-7">
              {STAT_CARDS.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg`}>{s.icon}</div>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{s.trend}</span>
                  </div>
                  <p className={`text-2xl font-black ${s.color} leading-none mb-1`}>{s.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                  <div className={`mt-2 ${s.sparkColor}`}><SparkLine data={revenueData}/></div>
                </div>
              ))}
            </div>
          )}

          {/* Chart + Status breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="mb-5">
                <h2 className="text-[15px] font-black text-gray-900">Orders This Week</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Orders processed per day over the last 7 days</p>
              </div>
              <div className="flex items-end gap-2 h-32 px-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const heights = [40, 65, 30, 80, 55, 90, 45];
                  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                        <div className={`w-full rounded-t-lg transition-all ${i === todayIdx ? "bg-gray-900" : "bg-gray-100 hover:bg-green-100"}`} style={{ height: `${heights[i]}%` }}/>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <h2 className="text-[15px] font-black text-gray-900 mb-4">Order Status</h2>
              <div className="space-y-3 flex-1">
                {[
                  { label: "Pending",   count: pendingOrders,   color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50"  },
                  { label: "Delivered", count: deliveredOrders, color: "bg-green-500", text: "text-green-700", bg: "bg-green-50"  },
                  { label: "Cancelled", count: cancelledOrders, color: "bg-red-400",   text: "text-red-600",   bg: "bg-red-50"    },
                ].map(s => (
                  <div key={s.label} className={`flex items-center justify-between ${s.bg} rounded-xl px-3.5 py-2.5`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color}`}/>
                      <span className="text-[12px] font-semibold text-gray-700">{s.label}</span>
                    </div>
                    <span className={`text-[13px] font-black ${s.text}`}>{s.count}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/pharmacy/orders")}
                className="mt-4 w-full bg-gray-950 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-gray-800 transition">
                Manage Orders
              </button>
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black text-gray-900">Recent Orders</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">{recentOrders.length} most recent customer orders</p>
              </div>
              <button onClick={() => navigate("/pharmacy/orders")}
                className="text-[12px] font-bold text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition">
                View All Orders →
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-[13px] font-semibold text-gray-600">No orders yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Orders will appear here once customers start purchasing</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["ORDER", "CUSTOMER", "SHIPPING ADDRESS", "AMOUNT", "ITEMS", "STATUS"].map(col => (
                      <th key={col} className="py-2.5 px-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => <OrderRow key={order._id} order={order}/>)}
                </tbody>
              </table>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}